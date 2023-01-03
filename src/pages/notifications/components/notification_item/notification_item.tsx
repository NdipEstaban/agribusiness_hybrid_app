import React from 'react';
import {IonButton, IonItem, IonText} from '@ionic/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

import './notification_item.scss';

const NotificationItem:React.FC = () => {
    return(
        <IonItem className='notification__item' color='primary'>
            <div className='name-message'>
                <IonText className='name'>
                    Alrayan
                </IonText>
                <IonText className='message'>
                    payment de 25,000 effectuer avec success
                </IonText>
            </div>
            <div className='time-trash'>
                <IonText className='time'>
                    14:30
                </IonText>
                <IonButton fill='clear' color='secondary'>
                    <FontAwesomeIcon icon={faTrash} />
                </IonButton>
            </div>
        </IonItem>
    );
}

export default NotificationItem;
