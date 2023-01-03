import React from 'react';
import { IonAvatar, IonContent, IonImg, IonItem, IonText } from '@ionic/react';

import img from '../../../../assets/images/abic_logo.png';

import './completed_item.scss';

const CompletedItem:React.FC = () => {
    return(
        <IonItem className='command__completed'>
            <div className='img-column'>
                <IonImg className='product-img' src={img}/>
                <IonImg className='client-img' src={img} />
            </div>
            <div className='name-quantity-column'>
                <IonText className='name'>John Bosco</IonText>
                <IonText className='quantity'>20kg de banane</IonText>
            </div>
            <div className='date-location-column'>
                <IonText className='date'>02/05/22</IonText>
                <IonText className='location'>Douala</IonText>
            </div>
        </IonItem>
    );
} 

export default CompletedItem