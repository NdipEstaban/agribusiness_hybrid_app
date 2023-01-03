import React from 'react';
import {IonItem, IonImg, IonText} from '@ionic/react';

import './transaction_item.scss';

import img from '../../../../assets/images/abic_logo.png';

const TransactionItem:React.FC = () => {
    return(
        <IonItem className='recent__transaction__item'>
            <div className='recent__transaction__item-image'>
                <IonImg src={img} />
            </div>
            <div className='recent__transaction__item-details'>
                <IonText className='recent__transaction-details-name'>
                    Jean Bosco
                </IonText>
                <IonText className='recent__transaction-details-amount'>
                    67,000F
                </IonText>
            </div>
            <div className='recent__transaction-date'>
                <IonText>
                    10/02/2022
                </IonText>
            </div>
        </IonItem>
    );
}

export default TransactionItem;