import React from 'react';
import { IonItem,IonText, IonImg, IonButton} from '@ionic/react';

import './pending_item.scss';

import img from '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faXmark, faClock} from '@fortawesome/free-solid-svg-icons';
 
const PendingItem:React.FC = () => {
    return(
        <IonItem className='pending__command'>
            <div className='img-column'>
                <IonImg className='product-img' src={img}/>
                <IonImg className='client-img' src={img} />
            </div>
            <div className='name-location-column'>
                <IonText className='name'>John Bosconhh</IonText>
                <IonText className='quantity'>banana 25kg</IonText>
                <IonText className='quantity'>Douala</IonText>
            </div>
            <div className='options' slot='end'>
                <IonText className='options'>
                    <IonButton className='check-btn' fill='clear'>
                        <FontAwesomeIcon icon={faCheck} />
                    </IonButton>
                    <IonButton className='reject-btn' fill='clear'>
                        <FontAwesomeIcon icon={faXmark} />
                    </IonButton>
                </IonText>
            </div>
        </IonItem>
    );
}

export default PendingItem;