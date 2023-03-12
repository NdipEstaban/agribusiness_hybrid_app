import React, { useState } from 'react';
import {IonButton, IonCard, IonContent, IonHeader, IonItem, IonModal, IonText, IonTitle, IonToolbar, useIonActionSheet} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faCheckDouble, faClock, faClockFour, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';

import './chat_text.scss';

interface ChatTextProps{
    id:string,
    source:string,
    text:string,
    read:Boolean,
    time:string,
    image?:string,
    sent:Boolean,
    delete:(messageId: string) => Promise<void>
}

const ChatText:React.FC<ChatTextProps> = (props): JSX.Element => {
    const [imageView, setImageView] = useState(false);
    const [presentActionSheet, dismissActionSheet] = useIonActionSheet();

    return(
        <IonCard id={props.id} button={true} className={`chat__message__box ${props.source}`} onClick={() => {
            presentActionSheet({
                buttons: [
                    {
                      text: 'Delete',
                      role:"Desctructive",
                      data: {
                        action: 'confirm',
                      },
                      handler:() => props.delete(props.id)
                    },
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      data: {
                        action: 'cancel',
                      },
                    },
                  ],
            })
        }}>
            {
                (props.image !== null && props.image !== undefined) && 
                <img src={props.image} alt='sent' onClick={() => setImageView(true)}/>
            }
            <IonText className='chat__message__box-text'>
                {props.text}
            </IonText>
            <div className='chat__message__box-details'>
                <IonText>{props.time}</IonText>
                <div className='chat-icon'>
                    {props.source === 'sender'?
                        <React.Fragment>
                            {
                                (props.sent === true)?
                                (
                                    (props.read === true)?
                                    <FontAwesomeIcon icon={faCheckDouble} />
                                    :
                                    <FontAwesomeIcon icon={faCheck} />
                                )
                                :
                                <FontAwesomeIcon icon={faClockRotateLeft} />
                            }
                        </React.Fragment>
                        :
                        ''
                    }
                </div>
            </div>
            <IonModal isOpen={imageView} className='view-image-modal'>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot='start' fill='clear' onClick={() => setImageView(false)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </IonButton>
                        <IonTitle>
                            Image
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <img src={props.image} alt='random' />
                    {props.text.length > 0 && <IonText className='image-text'>{props.text}</IonText>}
                </IonContent>
            </IonModal>
        </IonCard>
    );
}

export default ChatText;