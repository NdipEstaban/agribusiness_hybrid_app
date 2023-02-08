import React from 'react';
import {useIonViewWillEnter, useIonViewWillLeave, IonPage,IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonList} from '@ionic/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import './notifications.scss';

import NotificationItem from './components/notification_item/notification_item';
import {showTabBar, hideTabBar} from '../../utils/iontabbar-controller';

import { useHistory } from 'react-router';

const Notifications:React.FC = () => {

    useIonViewWillEnter(() => {
        hideTabBar();
    });

    useIonViewWillLeave(() => {
        showTabBar();
    });

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
                <IonList lines='none' className="notification-list">
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default Notifications;