import React, { useRef, useState, useEffect } from 'react';
import {IonPage, IonRow, IonText, IonCol, IonGrid, IonHeader,IonContent, IonButton, IonTitle, IonItem, IonList, IonToolbar, IonFab, IonFabButton, IonModal, IonAccordionGroup, useIonViewWillEnter, useIonViewDidEnter, useIonLoading, useIonAlert, IonLoading} from '@ionic/react';

import CartItem from './components/pending_item/pending_item';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTasks, faMoneyBillWave, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import './cart.scss';
import PendingCartItem from './components/pending_item/pending_item';
import RadioButton from '../../components/radio_button/radio_button';
import OngoingCartItem from './components/ongoing_item/ongoing_item';
import { pendingOrderItem, useStorage } from '../../hooks/useStorage';
import { useAppSelector, useAppDispatch } from '../../hooks/redux_hooks';
import { updatePendingOrders } from '../../redux/features/cart/cartSlice';
import { useGetConsumerOrdersQuery, useLazyGetConsumerOrdersQuery } from '../../redux/api/order/orderSlice';
import { decryptRequest } from '../../utils/crypto_utility';

interface cartProps{
    deleteOrder:(params:any) => Promise<void>;
    updateOrder:(params:any) => Promise<void>;
    pendingOrders:pendingOrderItem[];
    socket:any;
}

const Cart:React.FC<cartProps> = ({deleteOrder, pendingOrders, updateOrder, socket}):JSX.Element => {
    const [presentLoader, dismissLoader] = useIonLoading();
    const [presentAlert, dissmissLoader] = useIonAlert();

    const consumer = useAppSelector(state => state.user)
    const [currentView, setCurrentView] = useState<string>("Pending");

    const [getConsumerOrders, {isLoading, isError}] = useLazyGetConsumerOrdersQuery();
    const [consumerOrders, setConsumerOrders] = useState([]);

    // const {data:consumerOrders, isLoading, isError,} = useGetConsumerOrdersQuery(consumer.userId);

    useEffect(() => {
        socket.on("delivery-notify-consumer", (details:any) => {
            getConsumerOrders(consumer.userId).unwrap().then(data => {
                setConsumerOrders(data);
            });
        });

        socket.on("merchant-acept-order", (details:any) => {
            getConsumerOrders(consumer.userId).unwrap().then(data => {
                setConsumerOrders(data);
            });
        });

        socket.on("merchant-reject-order", (details:any) => {
            getConsumerOrders(consumer.userId).unwrap().then(data => {
                setConsumerOrders(data);
            });
        });
    },[socket]);

    useIonViewWillEnter(() => {
        getConsumerOrders(consumer.userId).unwrap().then(data => {
            setConsumerOrders(data);
        })
    });

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Cart</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading 
                    isOpen={isLoading}
                    message={'Setting up your orders'}
                    spinner={"circles"}
                    duration={5000}
                />
                <div className='cart-radio-btn'>
                    <RadioButton option1='Pending' option2='Ongoing' setHome={setCurrentView}/>
                </div>
                
                <div className='cart-page-content'>
                {/*Ongoing orders */}
                    {
                        <IonAccordionGroup className='ongoing-cart-orders' style={(currentView !== "Ongoing")?{display:"none"}:{}}>
                            <h5>Ongoing Orders</h5>
                            {(isError === true) && <h3>Sorry, your orders are only available online for your security</h3>}
                            {
                                consumerOrders?.map((order:any) =>
                                    <OngoingCartItem
                                        key={order.orderId}
                                        merchantName={order.merchantName} 
                                        merchantPhoto={order.merchantPhoto} 
                                        products={order.products} 
                                        date={order.date}
                                        progress={order.progress}
                                        orderId={order.orderId}
                                        amountPaid={order.amountPaid}
                                        socket={socket}
                                    />
                                )
                            }
                            {consumerOrders.length <= 0 && <h6>No orders, pass order from a list of your pending orders</h6>}
                        </IonAccordionGroup>
                    }

                {/*Pending orders */}
                    <IonAccordionGroup className='pending-cart-orders' style={(currentView !== "Pending")?{display:"none"}:{}}>
                        <h5>Pending orders</h5>
                        {pendingOrders.map((order:pendingOrderItem) => 
                            <PendingCartItem 
                                key={`order-${order.merchantId}`} 
                                merchantId={order.merchantId} 
                                merchantName={order.merchantName} 
                                merchantPhoto={order.merchantPhoto} 
                                date={order.date} 
                                products={order.products}
                                deleteItem={deleteOrder}
                                updateItem={updateOrder}
                                socket={socket}
                            />
                        )}
                        {pendingOrders.length <= 0 && <h6>No items in the cart go do some shopping</h6>}
                    </IonAccordionGroup>
                    
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Cart;