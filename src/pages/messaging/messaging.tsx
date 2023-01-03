import React from 'react';
import { IonPage,IonButton,IonList, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

import MessageChat from './components/message_chat/message_chat';

import './messaging.scss';

const Messaging:React.FC = () => {
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Messages
                    </IonTitle>
                    <IonButton fill='clear' slot='primary' color='none'>
                        <FontAwesomeIcon icon={faTasks} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList lines='none'>
                    <MessageChat />
                    <MessageChat />
                    <MessageChat />
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default Messaging;