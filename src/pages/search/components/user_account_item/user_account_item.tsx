import React from 'react';

import { IonImg, IonText, IonItem, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';

import tomate from '../../../../assets/images/tomatoes.png';

import './user_account_item.scss';
import { hideTabBar, showTabBar } from '../../../../utils/iontabbar-controller';
import { useHistory } from 'react-router';

const UserAccountItem:React.FC = () => {
    const history = useHistory();
    const goToUserProfile = () => {
        history.push("/main/search/account-details", {from:'/main/search'});
    }

    return(
        <IonItem className='user__account_item' onClick={goToUserProfile}>
            <IonImg className='user__account-photo' src={tomate}></IonImg>
            <IonText className='user__account-name'>
                Jean bosco
            </IonText>
            <IonText color='primary' slot='end' className='user__account-occupation'>
                Producteur
            </IonText>
        </IonItem>
    );
}

export default UserAccountItem;