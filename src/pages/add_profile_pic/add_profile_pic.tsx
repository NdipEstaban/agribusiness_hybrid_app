import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {IonButton, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow} from '@ionic/react';
import React from 'react';
import './add_profile_pic.scss';
import {faImage} from '@fortawesome/free-solid-svg-icons';
 
const AddPic:React.FC = () => {
    return(
        <IonPage>
            <IonContent>
               <div className='add-pic-page'>
                    <div className='picture-wrapper'>
                        <FontAwesomeIcon className='picture' icon={faImage}/>
                    </div>
                    <h3>Add a profile picture</h3>
                    <IonButton className='confirm-btn' expand='block' size='large' fill='solid' color='primary' shape='round' routerLink='/main'>
                        Continuer
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default AddPic;