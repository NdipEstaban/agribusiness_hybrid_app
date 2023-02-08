import React from 'react';
import { IonFabButton, IonImg, IonText } from '@ionic/react';

import './account_card.scss'; 

import img from '../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs, faLocationDot, faMapLocation, faMessage, faPen, faPerson, faPersonBooth, faPersonCircleCheck, faPersonCircleXmark } from '@fortawesome/free-solid-svg-icons';

interface AccountCardProps{
    id?:string;
    name?:string;
    description?:string;
    city?:string;
    role?:string;
    image?:string;
    edit:Boolean;
    email?:string;
    quarter?:string;
}

const AccountCard:React.FC<AccountCardProps> = (props):JSX.Element => {
    return(
        <div className='account-card'>
            <div className='user-details'>
                <div className='img-wrapper'>
                    <img className='user-photo' src={props.image} alt='person'/>
                </div>
                <div className='user-info'>
                    <IonText className='user-name'>
                        {props.name}
                    </IonText>
                    <IonText className='user-description'>
                        A good merchant which sells mainly beans,
                        groundnuts and all other type of agricultural products...
                        {props.description}
                    </IonText>
                </div>
                
            </div>
            <div className='user-props'>
                <IonText className='user-occupation'>
                    <FontAwesomeIcon icon={faPersonCircleCheck} />
                    {props.role}
                </IonText>
                <IonText className='user-location'>
                    <FontAwesomeIcon icon={faMapLocation} />
                    {props.city}
                </IonText>
                <IonText>
                    <FontAwesomeIcon icon={faMapLocation} />
                    Cite de palmier carrefour express
                </IonText>
                <IonText>
                    <FontAwesomeIcon icon={faMessage} />
                    estabannd@gmail.com
                </IonText>
            </div>
                {props.edit &&
                    <IonFabButton className='edit-button' id={props.id}>
                        <FontAwesomeIcon icon={faPen} />
                    </IonFabButton>
                }
        </div>
    );
}

export default AccountCard;