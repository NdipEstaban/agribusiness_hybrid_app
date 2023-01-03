import {IonButton, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow} from '@ionic/react';
import './log_in.scss'

const LogIn:React.FC = () => {
    return(
        <IonPage>
            <IonContent>
                <form className='login-page'>
                    <h1>Welcome Back</h1>
                      <label>
                        Username
                        <input type='text' placeholder="enter your username"/>
                    </label>
                    <label>
                        Password
                        <input type='password' placeholder='enter your password'/>
                        <IonButton className='forgot-password' fill='clear'>Forgot Password</IonButton>
                    </label>
                    <IonButton id='create-account-btn' color='primary' shape='round' routerLink='/main'>
                        Log-in
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
}

export default LogIn;