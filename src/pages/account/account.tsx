import React from 'react';
import { useRef } from 'react';
import {IonPage, useIonActionSheet,IonItem,IonImg,IonText,IonModal, IonToolbar, IonHeader, IonTitle, IonButton, IonContent, IonList, IonInput, IonLabel, IonTextarea, IonFooter} from '@ionic/react';

import AccountCard from '../../components/account_card/account_card';
import TransactionItem from './components/transaction_item/transaction_item';

import tomatoes from '../../assets/images/tomatoes.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGear } from '@fortawesome/free-solid-svg-icons';

import './account.scss';

const Account:React.FC = () => {
    
    const accountModal = useRef<HTMLIonModalElement>(null);
    const [present] = useIonActionSheet();

    const dismissModal = () => {
        accountModal.current?.dismiss();
    }

    const canDismissModal = () => {
        return new Promise<boolean>((resolve, reject) => {
            present({
                header:'Apply changes to your account?',
                cssClass:'my-custom-class',
                buttons:[
                    {
                        text: 'Yes',
                        role: 'confirm'
                    },
                    {
                        text:'No',
                        role:'cancel'
                    }
                ],

                onWillDismiss:(ev) => {
                    if(ev.detail.role === 'confirm'){
                        resolve(true);
                        dismissModal();
                    }else{
                        reject();
                    }
                }
            })
        });
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot='start'>
                        Account
                    </IonTitle>
                    <IonButton slot='end' fill='clear'>
                        <FontAwesomeIcon icon={faGear} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <AccountCard id='account-card-edit'/>
                <IonText>
                    <h1>Last Transactions</h1>
                </IonText>
                <IonList lines='none'>
                    <TransactionItem />
                    <TransactionItem />
                </IonList>
                <IonText>
                    <h1>Statistics</h1>
                </IonText>

                {/*Edit account form*/}
                <IonModal ref={accountModal} trigger='account-card-edit' className='edit__account__modal'>
                    <IonContent>
                        <div className='edit__account__modal-image'>
                            <div className='edit__account__modal-image-img'>
                                <IonImg src={tomatoes} />
                            </div>
                            <IonButton fill='clear'>
                                change profile picture
                            </IonButton>
                        </div>
                        <IonList>
                            <IonItem className='edit__account__modal-elements'>
                                <IonLabel className='edit__account__label' position='stacked'>Name</IonLabel>
                                <IonInput value='pricile Linongue'></IonInput>
                            </IonItem>
                            <IonItem className='edit__account__modal-elements'>
                                <IonLabel className='edit__account__label' position='stacked'>Location</IonLabel>
                                <IonInput value='CM, Douala'></IonInput>
                            </IonItem>
                            <IonItem className='edit__account__modal-elements'>
                                <IonLabel className='edit__account__label' position='stacked'>Phone number</IonLabel>
                                <IonInput value='+2376XXXXXXXX'></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel className='edit__account__label' position='stacked'>About</IonLabel>
                                <IonTextarea maxlength={50} className='edit__account__modal-textarea' value='je suis une ...'></IonTextarea>
                            </IonItem>
                            <div className='edit__modal__buttons'>
                                <IonButton shape='round' expand='full' className='account__modal__buttons' fill='solid'  onClick={canDismissModal}>Confirm</IonButton>
                                <IonButton shape='round' expand='full' className='account__modal__buttons' fill='outline' onClick={dismissModal}>Cancel</IonButton>
                            </div>
                        </IonList>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default Account;