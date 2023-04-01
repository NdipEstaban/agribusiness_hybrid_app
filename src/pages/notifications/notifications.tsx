import React, {useEffect} from 'react';
import {useIonViewWillEnter, useIonViewWillLeave, IonPage,IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonList} from '@ionic/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import './notifications.scss';

import NotificationItem from './components/notification_item/notification_item';
import {showTabBar, hideTabBar} from '../../utils/iontabbar-controller';

import { useHistory } from 'react-router';
import { notificationItem, useNotificationStorage } from '../../hooks/useNotificationStorage';

interface notificationProps{
    socket:any;
}

const tempNotificationItem:notificationItem = {
    id:'2',
    source:"James carter",
    message:"You are here my friend",
    timeDate:"28/28/28"
}

const Notifications:React.FC<notificationProps> = ({socket}) => {
    const {notifications, addNotification, deleteNotification} = useNotificationStorage();

    useIonViewWillEnter(() => {
        hideTabBar();
    });

    useIonViewWillLeave(() => {
        showTabBar();
    });

    useEffect(() => {
        socket.on("new-notification", async(data:any) => {
            let {notification} = data;
            addNotification(notification);
        });

    }, [socket]);

    const history = useHistory();

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButton routerDirection='back' routerLink='/main/home' slot='start' fill='clear'>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </IonButton>
                    <IonTitle>Notifications</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {
                    notifications.length > -1?
                    <IonList lines='none' className="notification-list">
                        <NotificationItem notification={tempNotificationItem} deleteNotification={deleteNotification} />
                        <NotificationItem notification={tempNotificationItem} deleteNotification={deleteNotification} />
                        {
                            notifications.map(item => (
                                <NotificationItem notification={item} deleteNotification={deleteNotification} />
                            ))
                        }
                    </IonList>
                    :
                    <h1>No new notifications</h1>
                }
            </IonContent>
        </IonPage>
    );
}

export default Notifications;