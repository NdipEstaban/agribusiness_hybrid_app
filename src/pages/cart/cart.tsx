import React, { useRef, useState, useEffect } from 'react';
import {IonPage, IonRow, IonText, IonCol, IonGrid, IonHeader,IonContent, IonButton, IonTitle, IonItem, IonList, IonToolbar, IonFab, IonFabButton, IonModal, IonAccordionGroup, useIonViewWillEnter, useIonViewDidEnter} from '@ionic/react';

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

const Cart:React.FC = ():JSX.Element => {
    const dispatch = useAppDispatch();
    const [currentView, setCurrentView] = useState<string>("Pending");
    const {pendingOrders:storedPendingOrder, deletePendingOrder} = useStorage();

    const pendingOrders = useAppSelector(state => state.cart.pendingOrders);

    const deleteOrder = (merchantId:string) => {
        deletePendingOrder(merchantId)
        // .then(() => {
        //     setTimeout(() => dispatch(updatePendingOrders(storedPendingOrder)), 200);
        //     console.log("cart:")
        //     console.log(storedPendingOrder);
        // })
    }

    useEffect(() => {
        dispatch(updatePendingOrders(storedPendingOrder));
    }, [storedPendingOrder]);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Cart</IonTitle>
                    <IonButton slot='end' fill='clear'>
                        <FontAwesomeIcon icon={faTasks} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <RadioButton option1='Pending' option2='Ongoing' setHome={setCurrentView}/>
                
                {/*Ongoing orders */}
                    <IonAccordionGroup style={(currentView !== "Ongoing")?{display:"none"}:{}}>
                        <OngoingCartItem />
                    </IonAccordionGroup>

                {/*Pending orders */}
                    <IonAccordionGroup style={(currentView !== "Pending")?{display:"none"}:{}}>
                        {pendingOrders.map((order:pendingOrderItem) => 
                            <PendingCartItem 
                                key={`order-${order.merchantId}`} 
                                merchantId={order.merchantId} 
                                merchantName={order.merchantName} 
                                merchantPhoto={order.merchantPhoto} 
                                date={order.date} 
                                products={order.products}
                                deleteItem={deleteOrder}
                            />
                        )}
                    </IonAccordionGroup>
            </IonContent>
        </IonPage>
    );
}

export default Cart;