import React from 'react';
import {IonCard, IonItem, IonText} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';

import './chat_text.scss';

interface ChatTextProps{
    source:string,
    // recieved:Boolean,
    // read:Boolean,
    // time:Date,
}

const ChatText:React.FC<ChatTextProps> = (props): JSX.Element => {
    return(
        <IonCard button={true} className={`chat__message__box ${props.source}`}>
            <IonText className='chat__message__box-text'>
                Lorem ipsum dolor res anotic sumo ricardo 
                login shont gus latin goala
            </IonText>
            <div className='chat__message__box-details'>
                <IonText>18:29</IonText>
                <div className='chat-icon'>
                    {props.source === 'sender'?
                        <FontAwesomeIcon icon={faCheckDouble} />
                        :
                        ''
                    }
                </div>
            </div>
        </IonCard>
    );
}

export default ChatText;