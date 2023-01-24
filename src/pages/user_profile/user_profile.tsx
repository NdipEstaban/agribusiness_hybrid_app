import React from 'react';
import {useIonViewWillEnter, useIonViewWillLeave,IonPage,IonContent, IonHeader, IonButton, IonToolbar, IonList, IonText} from '@ionic/react';
import {useHistory, useLocation} from 'react-router-dom';

import { hideTabBar,showTabBar } from '../../utils/iontabbar-controller';

import tomatoes from '../../assets/images/tomatoes.png';

import './user_profile.scss';

import ProductCard from '../home/components/product_card/product_card';
import AccountCard from '../../components/account_card/account_card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMessage } from '@fortawesome/free-solid-svg-icons';

const UserProfile:React.FC = () => {
    const history = useHistory();
    
    const previousPage = () => {
        let previous:any = history.location.state;
        previous = previous.from;
        console.log(previous);
        history.push(previous);
        
    }
    const cardAction = () => {};

    useIonViewWillEnter(() => {
        hideTabBar();
    });

    useIonViewWillLeave(() => {
        showTabBar();
    });

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar className='user__profile-toolbar'>
                    <IonButton fill='clear' slot='start' onClick={previousPage}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <AccountCard />
                <IonText className='user_profile-title'>My Products</IonText>
                <IonList className='user__profile__specs-list'>
                <ProductCard name='banane' price='7000' description="Nice banana" image={tomatoes} merchantId="1" tab="featured" cardAction={() => {}} />
                </IonList>
                <IonButton className='send-message'>
                    <FontAwesomeIcon icon={faMessage} />
                    Send message
                </IonButton>
            </IonContent>
        </IonPage>
    );
}

export default UserProfile;