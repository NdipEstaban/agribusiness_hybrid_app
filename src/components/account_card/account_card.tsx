import React from 'react';
import { IonFabButton, IonImg, IonText } from '@ionic/react';

import './account_card.scss'; 

import img from '../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPen } from '@fortawesome/free-solid-svg-icons';

interface AccountCardProps{
    id?:string,
    editable?:boolean
}

const AccountCard:React.FC<AccountCardProps> = (props) => {
    return(
        <div className='account-card'>
            <div className='img-wrapper'>
                <IonImg src={img} />
            </div>
            <div className='user-details'>
                <IonText className='user-name'>
                    Pricile Linongue
                </IonText>
                <IonText className='user-occupation'>
                    Productrice Agroalimentaire
                </IonText>
                <IonText className='user-description'>
                    Vente des produit agroalimentaire
                </IonText>
                <IonText className='user-location'>
                    <FontAwesomeIcon icon={faLocationDot} />
                    _CM, Douala
                </IonText>
                <IonText className='phone-number'>
                    +2376XXXXXXXX
                </IonText>
            </div>
            <IonFabButton className='edit-button' id={props.id}>
                <FontAwesomeIcon icon={faPen} />
            </IonFabButton>
        </div>
    );
}

export default AccountCard;