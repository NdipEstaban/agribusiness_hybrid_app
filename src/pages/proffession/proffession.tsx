import {IonButton, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow} from '@ionic/react';
import React from 'react';
import './proffession.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTruck, faStore, faWheatAlt} from '@fortawesome/free-solid-svg-icons'


const Proffession:React.FC = () =>{
    return(
        <IonPage>
            <IonContent>
                <h1 className='prof-heading'>Choose your Role</h1>
                <div className='proffession-container'>
                    <IonButton fill='clear' className='prof-card trader'>
                        <h6>Merchant</h6>
                    </IonButton>
                    <IonButton fill='clear' className='prof-card delivery'>
                        <h6>Delivery</h6>
                    </IonButton>
                    <IonButton fill='clear' routerLink='/new/create-account/add-picture' className='prof-card producer'>
                        <h6>Farmer</h6>
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Proffession;