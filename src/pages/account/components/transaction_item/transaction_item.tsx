import React from 'react';
import {IonItem, IonImg, IonText, IonAvatar} from '@ionic/react';

import './transaction_item.scss';

import img from '../../../../assets/images/abic_logo.png';

interface transactionItemProps{
    id:string,
    image:string,
    name:string,
    date:string,
    amount:string,
    fromMe:Boolean
}

const TransactionItem:React.FC<transactionItemProps> = ({id, image, name, date, amount, fromMe}):JSX.Element => {
    return(
        <IonItem className='recent__transaction__item'>
            <div className='recent__transaction__item-image'>
                <IonAvatar>
                    <img src={image} alt={'person'}/>
                </IonAvatar>
            </div>
            <div className='recent__transaction__item-details'>
                <IonText className='recent__transaction-details-name'>
                    {name}
                </IonText>
                <IonText className='recent__transaction-details-amount'>
                    {amount} CFA
                </IonText>
            </div>
            <div className='recent__transaction-date'>
                <IonText>
                    {date}
                </IonText>
                <IonText className={(fromMe === true)?'sent':'recieved'}>
                    <span>
                        {
                            (fromMe === true)?'Sent':'Recieved'
                        }
                    </span>
                </IonText>
            </div>
        </IonItem>
    );
}

export default TransactionItem;