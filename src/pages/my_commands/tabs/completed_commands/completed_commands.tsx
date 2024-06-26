import React, { useEffect, useState } from 'react';
import {IonAccordion, IonAccordionGroup, IonList, IonText} from '@ionic/react';

import './completed_commands.scss';
import CompletedItem from '../../components/completed_item/completed_item';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { useLazyGetDeliveryOngoingOrdersQuery, useLazyGetMerchantOngoingOrdersQuery } from '../../../../redux/api/order/orderSlice';

interface completedCommandsProps{
    style:any;
    socket:any;
}

const CompletedCommands:React.FC<completedCommandsProps> = ({style, socket}):JSX.Element => {
    let user = useAppSelector(state => state.user);
    const [orders, setOrders] = useState<Array<any>>([]);

    const [getMerchantOngoingOrders] = useLazyGetMerchantOngoingOrdersQuery();
    const [getDeliveryOngoingOrders] = useLazyGetDeliveryOngoingOrdersQuery();
    let getOrders = user.role === 'merchant'?getMerchantOngoingOrders:getDeliveryOngoingOrders;

    useEffect(() => {
        getOrders(user.userId).unwrap()
        .then((data) => setOrders(data));
    }, []);

    useEffect(() => {
        socket.on('consumer-confirm-order', (data:any) => {
            getOrders(user.userId).unwrap()
            .then((data) => setOrders(data));
        });
        socket.on("delivery-reject-order", () => {
            getOrders(user.userId).unwrap()
            .then((data) => setOrders(data));
        });
        socket.on("delivery-accept-order", () => {
            getOrders(user.userId).unwrap()
            .then((data) => setOrders(data));
        })
    }, [socket]);

    return(
        <IonList style={style} className='ongoing-commands-container'>
            {
                (orders.length < 1) && <IonText className="error-message">No Ongoing orders</IonText>
            }
            <IonText className='orders-section-title'>Ongoing</IonText>
            <IonAccordionGroup>
                {
                    orders.map((order:any) => {
                        if(user.role === 'merchant'){
                            return(
                                <CompletedItem 
                                    key={order.orderId}
                                    orderId={order.orderId}
                                    consumerId={order.consumerId}
                                    consumerName={order.consumerName}
                                    consumerPhoto={order.consumerImage}
                                    amount={order.amount}
                                    consumerLocation={order.location}
                                    delivery={order.delivery}
                                    products={order.products}
                                    date={order.date}
                                />
                            );
                        }else{
                            return(
                                <CompletedItem 
                                    key={order.orderId}
                                    orderId={order.orderId}
                                    consumerName={order.merchantName}
                                    consumerPhoto={order.merchantImage}
                                    amount={order.amount}
                                    consumerLocation={order.merchantLocation}
                                    deliveryLocation={order.merchantLocation}
                                    delivery={null}
                                    products={order.products}
                                    clientPhoto={order.customerImage}
                                    clientName={order.customerName}
                                    date={order.date}
                                    socket={socket}
                                    consumerId={order.customerId}
                                />
                            );
                        }
                    }
                    )
                }    
            </IonAccordionGroup>       
        </IonList>
    );
}

export default CompletedCommands;