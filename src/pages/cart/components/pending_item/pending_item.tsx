import React, { useEffect } from 'react';
import {useState} from 'react';
import {IonItem, IonImg, IonText, IonButton, IonAvatar, IonAccordion, IonAccordionGroup, IonList, IonTitle, useIonAlert, useIonViewWillEnter, useIonLoading} from '@ionic/react';
import { v4 as uuid } from 'uuid';

import'./pending_item.scss';

import  img from  '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faAdd, faMinus} from '@fortawesome/free-solid-svg-icons';
import ProductCartItem from '../product_item/product_item';
import { pendingOrderItem, useStorage } from '../../../../hooks/useStorage';

import { FlutterWaveButton, closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { InitializeFlutterwavePayment } from 'flutterwave-react-v3/dist/types';
import { useCreateOrderMutation } from '../../../../redux/api/order/orderSlice';

let presentDate:string = new Date().toLocaleDateString();

const config = {
    public_key:"FLWPUBK_TEST-ff40ff1208f80a15418bc9d59df84faa-X",
    tx_ref: presentDate,
    amount: 100,
    currency: 'XAF',
    payment_options: 'mobilemoney,ussd',
    customer: {
        email: 'estabannd@gmail.com',
        phone_number: '',
        name: 'john doe',
    },
    customizations: {
      title: 'my Payment Title',
      description: 'Payment for items in cart',
      logo:"https://sanau-abic.com/assets/img/logo%20ABIC%20SVG%20OK.svg"
    //   logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
};

interface pendingCartItem extends pendingOrderItem{
    deleteItem:(merchantId:string) => void,
    updateItem:(params:any) => Promise<void>,
    socket:any,
}

const PendingCartItem:React.FC<pendingCartItem> = ({merchantId, merchantName, merchantPhoto, products, date, deleteItem, updateItem, socket}):JSX.Element => {
    const consumer = useAppSelector((state:any) => state.user)
    const makeFlutterWavePayment = useFlutterwave(config);
    const [presentAlert] = useIonAlert();
    const [presentLoader, dismissLoader] = useIonLoading();
    const [createOrder] = useCreateOrderMutation();
    
    const [total, setTotal] = useState<number>(() => {
        let totalAmount = 0;
        for(let i = 0; i < products.length; i++){
            let total = Number(products[i].unitPrice) * Number(products[i].quantity);
            totalAmount += total;
        }
        return totalAmount;
    });

    const handlePayment = () => {
        presentLoader({
            message:"Proceeding to payment modal",
            spinner:"circles"
        });
        config.tx_ref += merchantName;
        config.amount = total;
        config.customer.name = consumer.name;
        config.customer.email = consumer.email;
        config.customizations.description = `Deposit for merchant ${merchantName}`;
        config.customizations.title = "ABIC Agribusiness order"
        

        let order = {
            orderId:uuid(), 
            consumerId:consumer.userId, 
            merchantId, 
            merchantPay:total, 
            products,
            consumerPhoneNumber:'',
        }

        makeFlutterWavePayment({
            callback:(response) => {
                if(response.status === 'successful'){
                    order.consumerPhoneNumber = response.customer.phone_number
                    createOrder(order);
                    deleteItem(merchantId);
                    presentAlert({
                        header:"Payment successful",
                        message:"Your order is on the way, check it's progress from the ongoing tab"
                    });
                    socket.emit("consumer-pass-order", ({
                        merchantId,
                        message:{
                            id:uuid(),
                            source:consumer.name,
                            notification:"Sent you an order request",
                            timeDate:new Date(),
                        }
                    }));
                }else{
                    presentAlert({
                        header:"Payment unsuccessful",
                        message:"An error occured when processing your payment please try again"
                    });
                }
                dismissLoader();
                closePaymentModal();
            },
            onClose:() => {
                dismissLoader();
                //TODO:Remove the create order from the onclose callback
                createOrder(order)
                    .then(() => deleteItem(merchantId));
            },
        });
    }

    const handleDeleteOrder = () => {
        deleteItem(merchantId);
        console.log("order deleted");
    }

    useEffect(() => {
        let totalAmount = 0;
        for(let i = 0; i < products.length; i++){
            let total = Number(products[i].unitPrice) * Number(products[i].quantity);
            totalAmount += total;
        }
        setTotal(totalAmount);
    }, [updateItem]);
    
    return(
        <IonAccordion value='first' className='pending-item'>
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={merchantPhoto} />
                </IonAvatar>
                <div>
                    <IonText className='merchant-name'>{merchantName}</IonText>
                    <IonText className='date'>{date}</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
                <IonList className='product-list'>
                    {products.map((prod:{productId:string, name:string, unitPrice:string, quantity?:string}) => {
                        return(
                            <ProductCartItem 
                                key={prod.productId} 
                                merchantId={merchantId} 
                                id={prod.productId} 
                                name={prod.name} 
                                price={prod.unitPrice} 
                                prodQuantity={prod.quantity || "0"}
                                updateProduct={updateItem}
                            />
                        );
                    })}
                </IonList>
                <div className='accordion-footer'>
                    <h3>Total: {total}CFA</h3>
                    <IonButton shape='round' onClick={() => 
                        presentAlert({
                            header:"Proceed to payment?",
                            message:"Your payments are handled by ABIC, and will be refunded if the order is not delivered",
                            buttons:[
                                {
                                    text:"No, wait",
                                    role:"cancel",
                                    handler() {
                                    },
                                },
                                {
                                    text:"That's Ok",
                                    role:"confirm",
                                    handler() {
                                      handlePayment()  
                                    },
                                }
                            ]
                        })
                    }>
                        PASS ORDER
                    </IonButton>
                    <IonButton 
                        shape="round"
                        fill="clear"
                        color="white"
                        onClick={() =>
                            presentAlert({
                                header:"Delete Order?",
                                message:`Your order with ${merchantName} will be deleted, should we proceed?`,
                                buttons:[
                                    {
                                        text:"Don't delete",
                                        role:"cancel"
                                    },
                                    {
                                        text:"Yes, delete Order",
                                        role:"confirm",
                                        handler(){
                                            handleDeleteOrder()
                                        }
                                    }
                                ]
                            }) 
                        }
                    >Delete</IonButton>
                </div>
            </div>

        </IonAccordion>
    );
}

export default PendingCartItem;