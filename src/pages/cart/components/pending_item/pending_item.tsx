import React, { useEffect } from 'react';
import {useState} from 'react';
import {IonItem, IonImg, IonText, IonButton, IonAvatar, IonAccordion, IonAccordionGroup, IonList, IonTitle, useIonAlert, useIonViewWillEnter} from '@ionic/react';
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
        phone_number: '070********',
        name: 'john doe',
    },
    customizations: {
      title: 'my Payment Title',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
};

interface pendingCartItem extends pendingOrderItem{
    deleteItem:(merchantId:string) => void;
}

const PendingCartItem:React.FC<pendingCartItem> = ({merchantId, merchantName, merchantPhoto, products, date, deleteItem}):JSX.Element => {
    const {deletePendingOrder} = useStorage();
    const consumer = useAppSelector(state => state.user)
    // const makeFlutterWavePayment = useFlutterwave(config);
    const [presentAlert] = useIonAlert();
    const [createOrder] = useCreateOrderMutation();
    
    const [total, setTotal] = useState<number>(() => {
        let totalAmount = 0;
        for(let i = 0; i < products.length; i++){
            let total = Number(products[i].unitPrice) * Number(products[i].quantity);
            totalAmount += total;
        }
        // return totalAmount;
        return 5000
    });

    const handlePayment = () => {
        config.amount = total;
        config.customer.name = consumer.name;
        config.customer.email = consumer.email;

        let order = {
            orderId:uuid(), 
            consumerId:consumer.userId, 
            merchantId, 
            merchantPay:total, 
            products
        }

        // makeFlutterWavePayment({
        //     callback:(response) => {
        //         console.log(response);
        //         closePaymentModal();
        //         console.log('flutterwave');
        //     },
        //     onClose:() => {
        //         createOrder(order);
        //     }
        // });
    }

    const handleDeleteOrder = () => {
        deleteItem(merchantId);
    }
    
    return(
        <IonAccordion value='first' className='pending-item'>
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={merchantPhoto} />
                </IonAvatar>
                <div>
                    <IonText>{merchantName}</IonText>
                    <IonText>{date}</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
                <IonList className='product-list'>
                    {products.map((prod:{productId:string, name:string, unitPrice:string, quantity?:string}) => {
                        return(<ProductCartItem key={prod.productId} merchantId={merchantId} id={prod.productId} name={prod.name} price={prod.unitPrice} prodQuantity={prod.quantity || "0"}/>)
                    })}
                </IonList>
                <div className='accordion-footer'>
                    <h3>Total: {total}XAF</h3>
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