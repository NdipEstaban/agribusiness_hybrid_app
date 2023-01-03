import {IonButton, IonTitle, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow} from '@ionic/react';
import './create_account.scss';
import React, {RefObject, useRef, useState } from 'react';
import { User, insert } from '../../store/auth/signInSlice';

let nameRegex = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}/;
let passwordRegex = /[a-zA-Z0-9]/;
let phoneRegex = /[0-9]{2,}/

const inputHandler = (e:React.ChangeEvent<HTMLInputElement>,regex:RegExp, setValue:Function, inputRef:RefObject<HTMLInputElement>):void => {
    let inputValue = e.target.value;
    if(regex.test(inputValue)){
        setValue([inputValue, true]);
        inputRef.current?.classList.remove("input-error");
    }else{
        setValue([inputValue, false]);
        inputRef.current?.classList.add("input-error");
    }
}

type SignInLevel = 1 | 2 | 3 | 4;

/*sign-in levels
-> 1: name
-> 2: contact
-> 3: contact verification
-> 4: password
*/

export const CreateAccount:React.FC = () => {
    //The sign up level determines which part of the sign-in process to display
    const [signInLevel, setSignInLevel] = useState<SignInLevel>(1);

    //Refs to toggle the forms border color depending on the validity of data
    const nameRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    //Local state to hold the values entered by the user
    const [name, setName] = useState<Array<any>>([]);
    // const [phone, setPhone] = useState<E164PhoneNumber>(' ');
    const [verificationCode, setCode] = useState<Array<any>>([]);
    const [password, setPassword] = useState<Array<any>>([]);
    const [confirmedPassword, setConfirmedPassword] = useState<Array<any>>([]);

    //Navigate between different levels of account creation
    const nextSignInLevel = () => {
        switch(signInLevel){
            case 1:
                setSignInLevel(2);
                break;
            case 2:
                setSignInLevel(3);
                break;
            case 3:
                setSignInLevel(4);
                break;
            case 4:
                handleSignIn();
                break;
        }
    };

    const prevSignInLevel = () => {
        switch(signInLevel){
            case 2:
                setSignInLevel(1);
                break;
            case 4:
                setSignInLevel(2);
                break;
        }
    }

    const handleSignIn = () => {}

    return(
        <IonPage>
            <IonContent>
               <div className="create__account-form">
                <IonTitle className='create__account-form-title'>
                    Create your account
                </IonTitle>
                <form>
                    {(signInLevel === 1) &&
                    <React.Fragment>
                        <label className='create__account-label'>
                        Name
                        <input
                        ref={nameRef} 
                        type='text' 
                        placeholder='enter your name' 
                        onChange={(e) => inputHandler(e, nameRegex, setName, nameRef)} 
                        value={name[0]}
                        required
                        maxLength={25}
                        />
                        {(name[1] === false) && 
                        <p className='input-error-message'>
                            Ayayay, please enter atleast 2 names
                        </p>}
                    </label>
                    </React.Fragment>
                    }
                    {(signInLevel === 2) && 
                    <React.Fragment>
                        <label className='create__account-label'>
                            Phone Number
                            <input type='number' placeholder='enter your phone number' />
                            <p className='input-error-message'>
                                , please enter atleast 2 names
                            </p>
                        </label>
                    </React.Fragment>
                    }
                    {
                        (signInLevel === 3) &&
                        <React.Fragment>
                            <h4>A verification code was sent to your number</h4>
                            <div className='verification__code-container'>
                                <input type='text' maxLength={1} />
                                <input type='text' maxLength={1} />
                                <input type='text' maxLength={1} />
                                <input type='text' maxLength={1} />
                            </div>
                            <p className='input-error-message'>
                                Ooops the code is invalid please
                            </p>
                        </React.Fragment>
                    }
                    {(signInLevel === 4) && 
                    <React.Fragment>
                        <label className='create__account-label'>
                            Password 
                            <input
                            ref={passwordRef}
                            type='password' 
                            placeholder='enter your password'
                            required
                            />
                            <p className='input-error-message'>
                                combine characters, numbers and letters
                            </p>
                        </label>
                        <label className='create__account-label'>
                            Confirm Password 
                            <input type='password'
                            ref={confirmPasswordRef} 
                            placeholder='confirm your password'
                            required
                            />
                            <p className='input-error-message'>
                                password does not match
                            </p>
                        </label>
                    </React.Fragment>
                    }

                    {signInLevel === 4?
                       <React.Fragment>
                            <IonButton 
                            routerLink="/new/create-account/proffession" 
                            className='create__account-submit-btn' 
                            expand="full" 
                            shape="round"
                            onClick={() => handleSignIn()}
                            >
                                Create Account
                            </IonButton>
                       </React.Fragment>
                        :
                        <IonButton 
                        className='create__account-submit-btn' 
                        expand="full" 
                        shape="round"
                        onClick={() => nextSignInLevel()}
                        > 
                            Next 
                        </IonButton>
                    }

                    {signInLevel !== 1 && 
                        <IonButton
                        className='create__account-back-btn'
                        color='primary'
                        expand="full"
                        shape="round"
                        fill='outline'
                        onClick={() => prevSignInLevel()}
                        >Back</IonButton>
                    }
                    
                </form>
               </div>
            </IonContent>
        </IonPage>
    );
}