import React from 'react';
import { useRef } from 'react';
import {IonPage,useIonViewWillEnter, useIonViewWillLeave, IonList, IonTitle,IonText,IonTextarea,IonHeader, IonToolbar, IonAvatar, IonImg, IonContent, IonLabel, IonInput, IonButton,} from '@ionic/react';

import './chat_page.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
 
import img from './../../assets/images/abic_logo.png';
import ChatText from './components/chat_text/chat_text';

import { useHistory } from 'react-router';
import { hideTabBar, showTabBar } from '../../utils/iontabbar-controller';

const ChatPage:React.FC = () => {
    const messagesContainer = useRef<null | HTMLDivElement>(null); 

    useIonViewWillEnter(() => {
        hideTabBar();
        messagesContainer.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    });

    useIonViewWillLeave(() => {
        showTabBar();
    });

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar className='chat__toolbar'>
                    <IonButton routerLink="/main/messaging" routerDirection="back" fill='clear' slot='start' >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </IonButton>
                    <IonAvatar slot='start'>
                        <IonImg src={img} />
                    </IonAvatar>
                    <IonLabel>
                        <h1 className='recipient-name'>John Bosco</h1>
                        <h2 className='recipient-status'>online</h2>
                    </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div ref={messagesContainer} className='chat__messages-container'>
                    <ChatText source='sender'/>
                    <ChatText source='reciever'/>
                    <ChatText source='sender'/>
                    <ChatText source='reciever'/>
                    <ChatText source='sender'/>
                    <ChatText source='reciever'/> 
                    <ChatText source='sender'/>
                </div>
                <div className='user-input'>
                    <IonButton className='pin-button' fill='clear' shape='round' slot='right'>
                        <FontAwesomeIcon icon={faPaperclip} />
                    </IonButton>
                    <IonTextarea className='chat-text-area' wrap='soft' maxlength={800} autoGrow={true} spellcheck={true} placeholder='Message...' color='none'>
                    </IonTextarea>
                    <IonButton className='send-button' color='primary' fill='solid' shape='round'>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default ChatPage;