import React from 'react';
import {IonButton, IonItem, IonText, useIonToast} from '@ionic/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

import './notification_item.scss';
import { notificationItem } from '../../../../hooks/useNotificationStorage';

interface notificationItemProps{
    notification:notificationItem;
    deleteNotification:(id:string) => Promise<void>;
}

const NotificationItem:React.FC<notificationItemProps> = ({deleteNotification, notification}) => {
    const [presentToast] = useIonToast();

    const handleDelete = () => {
        deleteNotification(notification.id).then(() => {
            presentToast({
                message:"notification deleted successfully",
                duration:1500
            });
        }).catch((err) => presentToast({
            message:"An error occured, please report to abic",
            duration:1800
        }));
    }

    return(
        <IonItem className='notification__item'>
            <div className='name-message'>
                <IonText className='name'>
                    {notification.source}
                </IonText>
                <IonText className='message'>
                    {notification.message}
                </IonText>
            </div>
            <div className='time-trash'>
                <IonText className='time'>
                    {notification.timeDate}
                </IonText>
                <IonButton fill='clear' color='primary' onClick={() => handleDelete()}>
                    <FontAwesomeIcon icon={faTrash} />
                </IonButton>
            </div>
        </IonItem>
    );
}

export default NotificationItem;
