import React from 'react';
import {IonItem, IonBadge, IonImg, IonText, IonAvatar} from '@ionic/react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faCheckDouble, faDotCircle, } from '@fortawesome/free-solid-svg-icons';
import {faClock, faCircleDot} from '@fortawesome/free-regular-svg-icons';

import './message_chat.scss';

import img from '../../../../assets/images/abic_logo.png';

import textShortener from '../../../../utils/text_shortener';
import { useHistory } from 'react-router';
import { messageItem, chatItem } from '../../../../hooks/useChatStorage';

interface MessageChatProps{
    chatData:chatItem
    //Determines if the message has been read or not
}

const MessageChat:React.FC<chatItem> = ({userId, image, name, messages}):JSX.Element => {
    const history = useHistory();

    const openChat = () => {
        history.push(`/main/message/chat-page/${userId}`, {from:window.location.pathname});
    }

    return(
        <IonItem lines='none' onClick={openChat} routerDirection="forward" className="message__chat">
            <IonAvatar className='message__chat-image'>
                <img className='message__chat-image-img' src={image} alt='recipient'/>
            </IonAvatar>
            <div className='message__chat-details'>
                <IonText className='message__chat-details-name'>{name}</IonText>
                <IonText className='message__chat-details-message'>
                    {/* DISPLAY TEXT OF LAST CHAT */}
                    {
                        messages[messages.length - 1]?.text
                    }
                </IonText>
            </div>
            <div className='message__chat-min-details'>
                <IonText className='message__chat-min-details-date'>
                    {/* DISPLAY DATE OF LAST CHAT */}
                    {
                        messages[messages.length - 1]?.date
                    }
                </IonText>
                <IonBadge className="message__chat-min-details-indicator" color='none'>
                    {/* DISPLAY STATUS OF LAST CHAT */}
                    {
                        (messages[messages.length - 1]?.recieved === false && messages[messages.length - 1].source === 'sender')?
                        <FontAwesomeIcon icon={faCheck} />
                        :(messages[messages.length - 1]?.recieved === true && messages[messages.length - 1].source === 'sender')?
                        <FontAwesomeIcon icon={faCheckDouble} />
                        :(messages[messages.length - 1].source === 'reciever' && messages[messages.length - 1].recieved === false)?messages.filter((messages:messageItem) => messages.recieved === false).length
                        :''
                    }
                </IonBadge>
            </div>
        </IonItem>
    );
}

export default MessageChat;