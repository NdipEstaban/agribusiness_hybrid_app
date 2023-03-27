import {IonButton, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonRow} from '@ionic/react';
import './welcome.scss';

import logo from '../../assets/images/abic_logo.png';

const Welcome:React.FC = () => {
    return(
        <IonPage>
            <IonContent>
                <IonGrid className='account-page'>
                    <IonRow className='logo-background' >
                        <IonImg className='logo' src={logo}></IonImg>
                    </IonRow>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgb(201, 201, 201)" fill-opacity="1" d="M0,288L80,245.3C160,203,320,117,480,117.3C640,117,800,203,960,234.7C1120,267,1280,245,1360,234.7L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                   <div className='page-body'>
                        <IonRow className='welcome-text'>
                            Welcome to ALRAYAN's agricbusiness platform! 
                            here you can sell your crops, buy crops and get delivered
                            to your doorstep or offer delivery services, agricbusiness is now online!
                            Are you ready to join us?
                        </IonRow>
                        <IonRow className='btn-section'>
                            <IonButton shape='round' color='primary' fill='solid' className='account-btns' routerLink='/new/create-account'>
                                Join the business
                            </IonButton>
                        </IonRow>
                   </div>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Welcome;