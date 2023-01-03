import React from 'react';
import {IonItem, IonBadge, IonImg, IonText} from '@ionic/react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faDotCircle, } from '@fortawesome/free-solid-svg-icons';
import {faClock, faCircleDot} from '@fortawesome/free-regular-svg-icons';

import './message_chat.scss';

import img from '../../../../assets/images/abic_logo.png';

import textShortener from '../../../../utils/text_shortener';

interface MessageChatProps{
    img:string,
    name:string,
    text:string,
    date:Date,
    status:string, //Determines if the message has been read or not
}

const MessageChat:React.FC = () => {
    return(
        <IonItem lines='none' routerLink='/main/message/chat-page' routerDirection="forward" className="message__chat">
            <div className='message__chat-image'>
                <IonImg className='message__chat-image-img' src={img}></IonImg>
            </div>
            <div className='message__chat-details'>
                <IonText className='message__chat-details-name'>Johnson Bosco</IonText>
                <IonText className='message__chat-details-message'>Le maize la es de bonne qualite...</IonText>
            </div>
            <div className='message__chat-min-details'>
                <IonText className='message__chat-min-details-date'>15/7/22</IonText>
                <IonBadge className="message__chat-min-details-indicator" color='none'>
                    {/* {'successfully sent message'}
                    <FontAwesomeIcon icon={faCheck} />
                    {'recieved message'}
                    <FontAwesomeIcon icon={faDotCircle} />
                    {'unsent messages'} */}
                    <FontAwesomeIcon icon={faClock} />
                </IonBadge>
            </div>
        </IonItem>
    );
}

export default MessageChat;