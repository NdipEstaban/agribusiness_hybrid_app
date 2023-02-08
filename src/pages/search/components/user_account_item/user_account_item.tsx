import React from 'react';

import { IonImg, IonText, IonItem, useIonViewWillEnter, useIonViewWillLeave, IonAvatar } from '@ionic/react';

import tomate from '../../../../assets/images/tomatoes.png';

import './user_account_item.scss';
import { hideTabBar, showTabBar } from '../../../../utils/iontabbar-controller';
import { useHistory } from 'react-router';


interface userAccountProps{
    userId:string;
    image:string;
    name:string;
    role:string;
}


const UserAccountItem:React.FC<userAccountProps> = (props):JSX.Element => {
    const history = useHistory();
    const goToUserProfile = () => {
        history.push(`/main/account-details/${props.userId}`, {from:window.location.pathname});
    }

    return(
        <IonItem className='user__account_item' onClick={goToUserProfile}>
            <img className='user__account-photo' src={props.image} alt="user's account"/>
            <IonText className='user__account-name'>
                {props.name}
            </IonText>
            <IonText color='primary' slot='end' className='user__account-occupation'>
                {props.role}
            </IonText>
        </IonItem>
    );
}

export default UserAccountItem;