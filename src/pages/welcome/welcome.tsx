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
                    <IonRow className='welcome-text'> 
                        Bienvenue sur la plateforme d'agribusiness
                        AL-RAYYAN, achetez les produits des
                        meilleurs agriculteurs du Cameroun ou
                        vendez vos produits agricoles et construisez
                        votre entreprise virtuelle. 
                    </IonRow>
                    <IonRow className='btn-section'>
                        <IonButton shape='round' color='primary' fill='solid' className='account-btns' routerLink='/new/create-account'>
                            Creer votre compte
                        </IonButton>
                        <IonButton shape='round' fill='outline' className='account-btns' routerLink='/new/log-in'>
                            Vous avez deja un compte?
                        </IonButton>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Welcome;