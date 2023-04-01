import React, {useEffect, useRef, useState} from 'react';
import {IonAccordionGroup, IonList, IonModal, IonText, useIonLoading, useIonModal, useIonViewWillEnter} from '@ionic/react';

import './pending_commands.scss';

import img from '../../../../assets/images/tomatoes.png';

import PendingItem from '../../components/pending_item/pending_item';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { useLazyGetDeliveryPendingOrdersQuery, useLazyGetMerchantPendingOrdersQuery, useMerchantDeclineOrderMutation} from '../../../../redux/api/order/orderSlice';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { v4 as uuid } from 'uuid';

interface pendingCommandsProps{
    style:any;
    socket:any;
}

const PendingCommands:React.FC<pendingCommandsProps> = ({style, socket}):JSX.Element => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const user = useAppSelector(state => state.user);

    const [presentLoader, dismissLoader] = useIonLoading();

    const [getDeliveryOrders] = useLazyGetDeliveryPendingOrdersQuery();
    const [getMerchantOrders] = useLazyGetMerchantPendingOrdersQuery();
    const [merchantDeclineOrder] = useMerchantDeclineOrderMutation();
 
    const [orders, setOrders] = useState<Array<any>>([]);

    const fetchPendingCommands = () => {
        let getOrders = user.role === 'merchant'?getMerchantOrders:getDeliveryOrders;
        getOrders(user.userId).unwrap()
        .then(data => {
            console.log('merchant orders', data);
            setOrders(data || []);
        });
    }

    const handleDeclinePendingOrder = async(orderId:string, recipientId:string) => {
        let declineOrder:any = (user.role === 'merchant')?merchantDeclineOrder:() => {};
        let getOrders = (user.role === 'merchant')? getMerchantOrders:getDeliveryOrders;
        
        presentLoader({
            message:"Updating list of pending orders",
            spinner:"circles"
        });

        await declineOrder(orderId).unwrap().then(() => {
            console.log("deleted item");
            if(user.role === 'merchant'){
                let notification = {
                    id:uuid(),
                    source:user.name,
                    message:"rejected your order request",
                    timeDate:new Date()
                }
                socket.emit("merchant-reject-order", {notification, consumerId:recipientId});
            }else{
                let notification = {
                    id:uuid(),
                    source:user.name,
                    message:"rejected your delivery request",
                    timeDate:new Date()
                }
                socket.emit("delivery-reject-order", {notification, merchantId:recipientId});
            }
            getOrders(user.userId).unwrap().then((data:any )=> {
                console.log("fetched items");
                setOrders(data);
                console.log('setted items');
            });
        });

        fetchPendingCommands();
        dismissLoader();
    }
    
    useIonViewWillEnter(() => {
        fetchPendingCommands();
    });

    useEffect(() => {
        socket.on("consumer-pass-order", () => {
            fetchPendingCommands();
        });
        socket.on("delivery-reject-order", () => {
            fetchPendingCommands();
        });
        socket.on("delivery-accept-order", () => {
            fetchPendingCommands();
        });
    }, [socket]);

    return(
        <IonList style={style} className='pending-commands-container'>
            <IonText className='orders-section-title'>Pending</IonText>
            {
                (orders.length < 1) && <IonText className="error-message">No Pending orders</IonText>
            }
            <IonAccordionGroup>
                        {/* <PendingItem
                            key={1} 
                            orderId={"1"}
                            customerName={"Ndip Estaban"}
                            customerImage={img}
                            deliveryLocation={"Douala, Makepe"}
                            customerProducts={[]}
                            merchantLocation={"Yaouonde, omnisport"}
                            amountPaid={1200}
                            deleteOrder={handleDeclinePendingOrder}
                            updatePendingCommands={fetchPendingCommands}
                            date={"2023-02-18 19:40:44"}
                            custommerId={'332'}
                        /> */}
                {
                    orders.map((order:any) =>
                        <PendingItem
                            key={order.orderId} 
                            orderId={order.orderId}
                            customerId={order.customerId}
                            customerName={order.customerName}
                            customerImage={order.customerImage}
                            deliveryLocation={order.deliveryLocation}
                            customerProducts={order.customerProducts}
                            merchantLocation={order.merchantLocation}
                            amountPaid={order.amountPaid}
                            deleteOrder={handleDeclinePendingOrder}
                            updatePendingCommands={fetchPendingCommands}
                            date={order.date}
                            socket={socket}
                        />
                    )
                }
            </IonAccordionGroup>
        </IonList>
    );
}
 
export default PendingCommands;