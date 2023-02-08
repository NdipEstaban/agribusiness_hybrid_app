import React from 'react';
import {useState} from 'react';
import {IonItem, IonImg, IonText, IonButton, IonAvatar, IonAccordion, IonAccordionGroup} from '@ionic/react';

import'./product_item.scss';

import  img from  '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faAdd, faMinus} from '@fortawesome/free-solid-svg-icons';
import { useStorage } from '../../../../hooks/useStorage';

interface ProductCartItemProps{
    id:string,
    name:string,
    prodQuantity:string,
    price:string,
    merchantId:string
}

const ProductCartItem:React.FC<ProductCartItemProps> = ({merchantId, id, name, prodQuantity, price}):JSX.Element => {
    const [quantity, setQuantity] = useState(prodQuantity);

    const {updatePendingOrdersProduct} = useStorage();

    const addQuantity = (current:string = quantity) => {
        let newQuantity = Number(current)  + 1;
        current = String(newQuantity);

        if(newQuantity < 10){
            current = current.padStart(2, '0');
        }
        setQuantity(current);

        updatePendingOrdersProduct({productId:id, quantity:current, merchantId});
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
        <IonItem lines='none' className='cart__item' color={"none"}>
            <div className='cart__item-details'>
                <IonText className='cart__item-details-name'>{name}</IonText>
                <IonText className='cart__item-details-price'>{price}/kg</IonText>
            </div>
            <div className='cart__item-quantity'>
                <IonButton slot='end' fill='clear' onClick={() => reduceQuantity()}>
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

export default ProductCartItem;




