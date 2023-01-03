import React from 'react';
import {useState} from 'react';
import {IonItem, IonImg, IonText, IonButton} from '@ionic/react';

import'./cart_item.scss';

import  img from  '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faAdd, faMinus} from '@fortawesome/free-solid-svg-icons';

const CartItem:React.FC = () => {
    const [quantity, setQuantity] = useState('01');

    const addQuantity = (current:string = quantity) => {
        let newQuantity = Number(current)  + 1;
        current = String(newQuantity);

        if(newQuantity < 10){
            current = current.padStart(2, '0');
        }
        setQuantity(current);
    }

    const reduceQuantity = (current:string = quantity) => {
        let newQuantity = Number(current);
        newQuantity = newQuantity <= 0?0:newQuantity - 1;
        current = String(newQuantity);

        if(newQuantity < 10){
            current = current.padStart(2, '0');
        }
        setQuantity(current);
    }

    return(
        <IonItem lines='none' className='cart__item'>
            <div className='cart__item-image'>
                <IonImg src={img} />
            </div>
            <div className='cart__item-details'>
                <IonText className='cart__item-details-name'>Orange</IonText>
                <IonText className='cart__item-details-price'>14,000/kg</IonText>
            </div>
            <div className='cart__item-quantity'>
                <IonButton fill='clear' onClick={() => reduceQuantity()}>
                    <FontAwesomeIcon icon={faMinus} />
                </IonButton>
                <IonText>
                    {quantity}
                </IonText>
                <IonButton fill='clear' onClick={() => addQuantity()}>
                    <FontAwesomeIcon icon={faAdd} />
                </IonButton>
            </div>
        </IonItem>
    );
}

export default CartItem;