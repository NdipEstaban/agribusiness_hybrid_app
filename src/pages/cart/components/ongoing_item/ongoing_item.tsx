import React from 'react';
import {useState} from 'react';
import {IonItem, IonImg, IonText, IonButton, IonAvatar, IonAccordion, IonAccordionGroup, IonList, IonTitle} from '@ionic/react';

import'./ongoing_item.scss';

import  img from  '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faAdd, faMinus, faBuilding, faTruck, faHome, faIndustry, faBuildingFlag, faShop, faBuildingNgo, faBuildingColumns, faShoppingBag} from '@fortawesome/free-solid-svg-icons';
import ProductCartItem from '../product_item/product_item';
import OrderProgress from '../order_progress/order_progress';
import { v4 as uuid } from 'uuid';
import { useAppSelector } from '../../../../hooks/redux_hooks';

interface ongoingItemProps{
    merchantPhoto:string;
    merchantName:string;
    date:string;
    products:{quantity:string, name:string, price:string}[];
    progress:string;
    orderId:string;
    amountPaid:number;
    socket:any;
}

const OngoingCartItem:React.FC<ongoingItemProps> = ({merchantName, merchantPhoto, date, products, progress, orderId, amountPaid, socket}):JSX.Element => {
    const user = useAppSelector(state => state.user);
    const handleCompleteOrder = () => {
        let notification = {
            id:uuid(),
            source:user.name,
            message:"Notified his order was recieved, payment successful",
            timeDate:new Date()

        }
        socket.emit('consumer-confirm-order', {notification, orderId});
    }

    return(
        <IonAccordion value={orderId} className='pending-item'>
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={merchantPhoto} />
                </IonAvatar>
                <div>
                    <IonText className='merchant-name'>{merchantName}</IonText>
                    <IonText className='date'>{date.slice(0, 10).split("-").reverse().join("/")}     {date.slice(11, 16)}</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
               <OrderProgress progress={Number(progress)}/>
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Quantity(Kg)</th>
                        <th>Price per Kg</th>
                    </tr>
                    {products.map((product:any, n) => 
                        <tr key={n + 'ongoing'+orderId + product.name}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.unitPrice}</td>
                        </tr>
                    )}
                </table>
                <div className='accordion-footer'>
                    <h4>Total Paid: {amountPaid}CFA</h4>
                    <IonButton shape='round' onClick={() => handleCompleteOrder()}>
                        MARK AS RECIEVED
                    </IonButton>
                </div>
            </div>

        </IonAccordion>
    );
}

export default OngoingCartItem;