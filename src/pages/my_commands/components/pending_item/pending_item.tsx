import React, { useRef, useState } from 'react';
import { IonItem,IonText, IonImg, IonButton, IonAccordion, IonAvatar, IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonTitle, IonSearchbar, IonList, useIonAlert, useIonLoading, IonIcon, useIonToast, IonLoading} from '@ionic/react';

import './pending_item.scss';

import img from '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faXmark, faClock, faLocation, faArrowLeftLong, faMessage, faMotorcycle, faTruckPickup, faTruck, faPersonBiking, faRoad} from '@fortawesome/free-solid-svg-icons';
import { useAddDeliveryPaymentMutation, useDeliveryAceptOrderMutation, useDeliveryDeclineOrderMutation, useMerchantDeclineOrderMutation, useMerchantSelfDeliveryMutation } from '../../../../redux/api/order/orderSlice';
import { useLazyGetDeliveryServicesQuery } from '../../../../redux/api/user/userSlice';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { v4 as uuid } from 'uuid';

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

interface pendingItemProps{
    orderId:string,
    customerId:string,
    customerName:string,
    amountPaid:number,
    customerImage:string,
    deliveryLocation:string,
    customerProducts:any[],
    merchantLocation?:string,
    deleteOrder:(orderId:string, recipientId:string) => Promise<void>,
    updatePendingCommands:() => void,
    date:string,
    socket:any;
}

const PendingItem:React.FC<pendingItemProps> = ({orderId, customerId, customerImage, customerName, deliveryLocation, merchantLocation, amountPaid, customerProducts, deleteOrder, updatePendingCommands, date, socket}):JSX.Element => {
    const user = useAppSelector(state => state.user);
    const [presentAlert, dismissAlert] = useIonAlert();
    const [presentLoader, dismissLoader] = useIonLoading();
    const [presentToast] = useIonToast();
    const [addDeliveryPayment] = useAddDeliveryPaymentMutation();
    const [deliveryDeclineOrder] = useDeliveryDeclineOrderMutation();
    const [deliveryAceptOrder] = useDeliveryAceptOrderMutation();
    const [merchantSelfDelivery] = useMerchantSelfDeliveryMutation();
    const makeFlutterWavePayment = useFlutterwave(config); 
    const deliveryServiceModal = useRef<HTMLIonModalElement>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [getDelivery, {data:delivery}] = useLazyGetDeliveryServicesQuery();

    const handleSearchBar = async(ev:Event) => {
        let query:string = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if(target) query = target.value!;

        await getDelivery(query).unwrap().then((data) => console.log(data));

    }

    const handleDeliveryInPerson = () => {
        let notification = {
            id:uuid(),
            source:user.name,
            message:"Acepted your delivery order & is on the way to collect package",
            timeDate:new Date()
        }
        merchantSelfDelivery(orderId).unwrap()
        .then((data) => {
            presentToast({
                message:"Your client is informed, don't keep him waiting for long"
            });
            socket.emit("merchant-accept-order", {notification, customerId});
        });
    }

    const handleDeliveryAceptOrder = () => {
        setLoading(true);
        let details = {
            orderId,
            deliveryId:user.userId
        }
        
        deliveryAceptOrder(details).unwrap()
        .then(() => {
            presentToast({
                message:"Order added to ongoing orders",
                duration:3000
            });
            let notification = {
                id:uuid(),
                source:user.name,
                message:"Acepted your delivery order & is on the way to collect package",
                timeDate:new Date()
            }
            socket.emit("delivery-accept-order", {merchantId:customerId, notification})
            updatePendingCommands();
        })
        .catch(err => {
            presentAlert({
                header:"Connection issues",
                message:"Please make sure your internet connection is on"
            });
        });

        setLoading(false);
    }

    const handleDeclineOrder = () => {
        setLoading(true);

        let details = {
            orderId, 
            deliveryId:user.userId
        }

        if(user.role === 'delivery'){
            deliveryAceptOrder(details).unwrap()
            .then(() => {
                presentToast({
                    message:"Order successfully declined orders",
                    duration:3000
                });
                updatePendingCommands();
            })
            .catch(err => {
                presentAlert({
                    header:"Connection issues",
                    message:"Please make sure your internet connection is on"
                });
            });
        }else{
            deleteOrder(orderId, customerId);
        }

        setLoading(false);
    }

    const handlePayment = (amount:number, deliveryId:string) => {
        presentLoader({
            message:"Proceeding to payment modal",
            spinner:"circles"
        });

        config.amount = amount;
        config.customer.name = user.name;
        config.customer.email = user.email;
        config.customizations.description = `Deposit by ${user.name} for order`;
        config.customizations.title="ABIC Agribusiness delivery payment" ;

        makeFlutterWavePayment({
            callback:(response) => {
                if(response.status === 'successful'){
                    addDeliveryPayment({deliveryId, amount, orderId, merchantPhoneNumber:response.customer.phone_number})
                    presentAlert({
                        header:"Payment successful",
                        message:"Your order is on the way, check it's progress from the ongoing tab"
                    });
                    socket.emit("merchant-send-delivery-order")
                }else{
                    presentAlert({
                        header:"Payment unsuccessful",
                        message:"An error occured when processing your payment please try again"
                    });
                }
                //update the list of pending commands
                updatePendingCommands();
                dismissLoader();
                //close modal to select delivery service
                deliveryServiceModal.current?.dismiss();
                closePaymentModal();
            },
            onClose:() => {
                dismissLoader();
            },
        });
    }

    return(
        <IonAccordion value={orderId} className='pending-command-item'>
            <IonLoading isOpen={loading} spinner={"circles"} />
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={customerImage} />
                </IonAvatar>
                <div className='top-details'>
                    <IonText>{customerName}</IonText>
                    <IonText>{date.slice(0, 10).split("-").reverse().join("/")}     {date.slice(11, 16)}</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
                {
                    user.role === 'merchant'?
                    <div className='pending-location'>
                        <h5>
                            <FontAwesomeIcon icon={faLocation} />
                            Location
                        </h5>
                        <IonText>
                            {deliveryLocation}
                        </IonText>
                    </div>
                    :
                    <div className='pending-location'>
                        <IonText className='users-location'>
                            <b>Merchant:</b>
                            <span>{merchantLocation}</span>
                        </IonText>
                        <span className='road-icon'><FontAwesomeIcon icon={faRoad} /></span>
                        <IonText className='users-location'>
                            <b>Client</b>
                            <span>{deliveryLocation}</span>
                        </IonText>
                    </div>
                }
                
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Quantity(Kg)</th>
                        {
                            user.role === 'merchant' && <th>Net Total</th>
                        }
                    </tr>
                    {customerProducts.map((prod:any) => 
                        <tr>
                            <td>{prod.name}</td>
                            <td>{prod.quantity}</td>
                            {user.role === 'merchant' && <td key={orderId + prod.name}>{prod.unitPrice * prod.quantity}</td>}
                        </tr>
                    )}
                </table>
                <div className='accordion-footer'>
                    <h4>Total Forwarded: {amountPaid} CFA</h4>
                    {
                        (user.role === 'merchant')?
                        <React.Fragment>
                            <IonButton shape='round' id='open-delivery-modal'>
                                SELECT A DELIVERY SERVICE
                            </IonButton>
                            <IonButton shape='round' color={'success'} onClick={() => handleDeliveryInPerson()}>
                                DELIVER IN PERSON
                            </IonButton>
                        </React.Fragment>
                        :
                        <IonButton shape='round' onClick={() => handleDeliveryAceptOrder()}>
                            ACCEPT REQUEST
                        </IonButton>
                    }
                    
                    <div className='btns'>
                        <IonButton 
                            shape='round' 
                            fill='outline' 
                            className='decline-btn' 
                            onClick={() => presentAlert({
                                header:`Decline the order from ${customerName}?`,
                                message:"You are going to decline this order and, it won't be available later",
                                buttons:[
                                    {
                                        text:"Cancel",
                                        role:"cancel"
                                    },
                                    {
                                        text:"Yes, decline",
                                        role:"confirm",
                                        handler:() => handleDeclineOrder()
                                    }
                                ]
                            })}
                        >
                            DECLINE REQUEST
                        </IonButton>
                    </div>
                    
                </div>
            </div>

            {/*Search for a delivery service and choose */}
            <IonModal ref={deliveryServiceModal} trigger="open-delivery-modal" onWillDismiss={(ev) => deliveryServiceModal.current?.dismiss()}>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot="start" fill="clear" onClick={() => deliveryServiceModal.current?.dismiss()}>
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </IonButton>
                        <IonSearchbar
                            slot="start"
                            debounce={500} 
                            animated={true} 
                            placeholder='Search' 
                            onIonChange={(ev) => handleSearchBar(ev)}
                        />
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    
                    <IonList lines='none'>
                        {delivery?.map((item:any) => 
                            <IonItem className='delivery-service-details' onClick={() => presentAlert({
                                header:"Proceed to payment?",
                                message:`Your payment will be recieved by ABIC and will be refunded if delivery is unsuccessful`,
                                buttons:[
                                    {
                                        text:"cancel",
                                        role:"cancel",
                                    },
                                    {
                                        text:`Pay ${item.delivery.rate_per_order}CFA`,
                                        role:"confirm",
                                        handler:() => {
                                            handlePayment(item.delivery.rate_per_order, item.delivery.user_id);
                                        }
                                    },
                                ]
                            })}>
                                <div slot='start' className='delivery-service-section'>
                                    <img src={item.profile_picture} alt='delivery service' className='delivery-picture'/>
                                    <IonText className='delivery-modal-item-name'>
                                        {item.name}dlkjfdljfld
                                    </IonText>
                                </div>
                                <div slot='end' className='delivery-service-section delivery-attrs'>
                                    <div className='vehicles-icon'>
                                        {
                                            item.delivery.vehicle === 'bike'?
                                                <FontAwesomeIcon icon={faPersonBiking} />
                                            :(item.delivery.vehicle === 'tricycle')?
                                            <FontAwesomeIcon icon={faMotorcycle} />
                                            :(item.delivery.vehicle === 'pickup')?
                                            <FontAwesomeIcon icon={faTruckPickup} />
                                            :<FontAwesomeIcon icon={faTruck} />
                                        }
                                    </div>
                                    <div className='delivery-rate'>
                                        {item.delivery.rate_per_order} CFA/order
                                    </div>  
                                </div>
                            </IonItem>
                        )}
                    </IonList>
                    
                </IonContent>
            </IonModal>
        </IonAccordion>
    );
}

export default PendingItem;