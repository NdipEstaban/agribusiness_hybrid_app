import React from 'react';
import { IonButton, IonFabButton, IonImg, IonText } from '@ionic/react';

import './account_card.scss'; 

import img from '../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs, faLocationDot, faMapLocation, faMessage, faPen, faPerson, faPersonBooth, faPersonCircleCheck, faPersonCircleXmark } from '@fortawesome/free-solid-svg-icons';

interface AccountCardProps{
    id?:string;
    name?:string;
    description?:any;
    city?:string;
    role?:string;
    image?:string;
    edit:Boolean;
    email?:string;
    quarter?:string;
    openEditForm?:React.Dispatch<React.SetStateAction<boolean>>
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
                        {props.description?.split('').filter((i:string) => i !== ' ').join('').length > 0?
                            <>{props.description}</>
                        :
                        <>No description added, edit your description by tapping on the <FontAwesomeIcon icon={faPen} /></>
                        }
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
                    {props.quarter}
                    
                </IonText>
                <IonText>
                    <FontAwesomeIcon icon={faMessage} />
                    {props.email}
                </IonText>
            </div>
                {props.edit &&
                    <button className='edit-button' id={props.id}>
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                }
        </div>
    );
}

export default AccountCard;