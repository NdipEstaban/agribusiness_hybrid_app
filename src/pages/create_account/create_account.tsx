import {IonButton, IonTitle, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonSelect, IonSelectOption} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import './create_account.scss';
import React, {RefObject, useRef, useState } from 'react';
import cities from '../../assets/constants/cities';
import products from '../../assets/constants/products';
import {CameraResultType, Camera} from "@capacitor/camera"
import { useAppDispatch, useAppSelector } from '../../hooks/redux_hooks';
import { useSignInMutation, useSendOtpMutation, useLogInMutation } from '../../redux/api/auth/authSlice';
import { useUpdateConsumerMutation, useUpdateMerchantMutation, useUpdateDeliveryMutation } from '../../redux/api/user/userSlice';
import { setFlagsFromString } from 'v8';
import { logIn, send } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { updateUser } from '../../redux/features/user/userSlice';


let nameRegex = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}/;
let phoneRegex = /^6[0-9]{8}$/g;

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

type SignInLevel = 1 | 2 | 3 | 4 | 5 | 6;

/*sign-in levels
-> 1: contact
-> 2: verification code
-> 3: name
-> 4:selection of profile picture
-> 5:selection of role
-> 6:user prefferences
*/

export const CreateAccount:React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();

    const [signIn] = useSignInMutation();
    const [sendOtp, {data:otp}] = useSendOtpMutation();
    const [logIn, {}] = useLogInMutation();
    const [updateConsumer] = useUpdateConsumerMutation();
    const [updateMerchant] = useUpdateMerchantMutation();
    const [updateDelivery] = useUpdateDeliveryMutation();
    //The sign up level determines which part of the sign-in process to display
    const [signInLevel, setSignInLevel] = useState<SignInLevel>(1);

    //Refs to toggle the forms border color depending on the validity of data
    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const verifCodeRef = useRef<HTMLInputElement>(null);


    /*Local state to hold the values entered by the user, each is an array containing the
    the user at index 0 and whether it's valid using a boolean at index 1*/
    
    const [name, setName] = useState<Array<any>>([]);
    const [phoneNumber, setPhoneNumber] = useState<Array<any>>([]);
    const [role, setRole] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [photo, setPhoto] = useState<string | undefined>('');
    const [userPref, setUserPref] = useState<Array<string>>([]);
    const [newUser, setNewUser] = useState<boolean>(false);

    const [verifCode, setVerifCode] = useState<Array<any>>([]);

    //Navigate between different levels of account creation
    const nextSignInLevel = () => {
        switch(signInLevel){
            case 1:
                getVerificationCode();
                if(phoneNumber[1] === true) setSignInLevel(2);
                break;
            case 3:
                if(name[1] === true && city !== '' ) setSignInLevel(4);
                break;
            case 4:
                if(photo !== '') setSignInLevel(5);
                break;
            case 5:
                setSignInLevel(6);
                break;
        }
    };

    const prevSignInLevel = () => {
        switch(signInLevel){
            case 2:
                setSignInLevel(1);
                break;
            case 4:
                setSignInLevel(3);
                break;
            case 5:
                setSignInLevel(4);
                break;
            case 6:
                setSignInLevel(5);
                break;
        }
    }

    //fetch verification code, if number already exist in db, login into app else go through account creation
    const getVerificationCode = () => {
        let number = String(phoneNumber[0]);
        sendOtp(number).then((result:any) => {
            console.log(result?.data?.otpCode);
            if(result?.data?.numberExist){
                logIn(number).then( info => {
                    dispatch(updateUser(info));
                });
            }
        });
    };

    //check verification code, if successful then move on to next level in account creation
    const handleVerificatonCode = (e:any) => {
        let code = e.target.value;
        if(code === otp.otpCode){
            setVerifCode([verifCode, true]);
            if(newUser)history.push("/main");
            setSignInLevel(3);
        }else{
            setVerifCode([verifCode, false]);
        }
    };

    //prompt user to select photo either from gallery or camera
    const handlePhoto = async() => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl
          });
          setPhoto(image.dataUrl);
    }

    //set userPrefference depending on the type of user, products for merchants and consumers and city for delivery
    const handleUserPref = (e:any) => {
        setUserPref([...e.detail.value])
    }

    //send sign in information to database
    const handleSignIn = () => {
        let user = {
            id:'',
            name:name[0], 
            profilePhoto:photo, 
            city, 
            role, 
            phoneNumber:phoneNumber[0], 
            userPref:(role === 'merchant')?userPref.join(''):userPref
        }

        signIn(user).then((result:any) => {
            user.id = result?.data?.id;
            console.log(result.data);
            dispatch(updateUser(user));
        });
    }


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
                        <p className='form_message'>
                            Your phone number will enable others to
                            contact you and you can equally contact others
                        </p>
                        <label className='create__account-label'>
                            Phone Number
                            <input
                                ref={phoneRef} 
                                type='string' 
                                placeholder='enter your phone number' 
                                value={phoneNumber[0]}
                                maxLength={9}
                                onChange={(e) => {
                                    inputHandler(e, phoneRegex, setPhoneNumber, phoneRef)}
                                }
                            />
                            {
                                phoneNumber[1] === false &&
                                <p className='input-error-message'>
                                    Oops, invalid number please try again
                                </p> 
                            }
                        </label>
                    </React.Fragment>
                    }
                    {
                        (signInLevel === 2) &&
                        <React.Fragment>
                            <p className='form_message'>Please enter the verification code sent to you via sms</p>
                            <div className='verification__code-container'>
                                <input type='text' maxLength={6} placeholder="123456" onChange={(e) => handleVerificatonCode(e)}/>
                            </div>
                            
                            {verifCode[1] === true && 
                                <p className='input-error-message'>
                                    Ooops the code is invalid please
                                </p>
                            }
                        </React.Fragment>
                    }
                     {(signInLevel === 3) &&
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
                        {/* render an error text only when the value does not pass the regex test */}
                        {(name[1] === false) && 
                        <p className='input-error-message'>
                            Ayayay, please enter atleast 2 names
                        </p>}
                    </label>
                    <label className='selection-label'>
                        Select your city of residence
                        <IonSelect value={city} className='selection' interface="popover" placeholder='select your city of residence' onIonChange={(e) => setCity(e.detail.value)}>
                            {cities.map(i => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                        </IonSelect>
                    </label>
                    </React.Fragment>
                    }
                    {
                        (signInLevel === 4) && 
                        <React.Fragment>
                            <div className='add-pic-section'>
                                <div className='picture-wrapper'>
                                    {
                                        photo === ''?
                                        <FontAwesomeIcon className='picture' icon={faImage}/>
                                        :
                                        <img src={photo} className='picture' alt="user's profile" />
                                    }
                                    
                                </div>
                                <h3 onClick={() => {handlePhoto()}}>Add a profile picture</h3>
                            </div>
                        </React.Fragment>
                    }
                    {
                        (signInLevel === 5) && 
                        <React.Fragment>
                            <div className='proffession-container'>
                                <h3>What will you be doing?</h3>
                                <button className='prof-card trader' onClick={() => setRole('merchant')} type="button">
                                    <h6>Merchant</h6>
                                    <p>
                                        I sell crops on the platform and I can make use 
                                        of the delivery services
                                    </p>
                                </button>
                                <button className='prof-card delivery' onClick={() => setRole('delivery')} type="button">
                                    <h6>Delivery</h6>
                                    <p>
                                        I offer delivery services to merchants and safely deliver
                                        crops from merchant to consumer
                                    </p>
                                </button>
                                <button className='prof-card producer' onClick={() => setRole('consumer')} type="button">
                                    <h6>Consumer</h6>
                                    <p>
                                        I explore and purchase crops from merchants on the platform
                                    </p>
                                </button>
                            </div>
                        </React.Fragment>
                    }
                    {
                        (signInLevel === 6) && 
                        <React.Fragment>
                            {(role === 'delivery')?
                                <label className='selection-label'>
                                    <IonSelect className='selection' interface="popover" placeholder="Select your destinations" multiple={true} onIonChange={(e) => handleUserPref(e)}>
                                        {cities.map(i => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                                    </IonSelect>
                                </label>
                                :
                                <label className='selection-label'>
                                    <IonSelect className='selection' interface="popover" placeholder="select preffered products" multiple={role === "merchant"?false:true} onIonChange={(e) => handleUserPref(e)}>
                                        {products.map(i => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                                    </IonSelect>
                                </label>}
                        </React.Fragment>
                    }
                    {signInLevel === 6?
                       <React.Fragment>
                            <IonButton 
                            routerLink="/main" 
                            className='create__account-submit-btn' 
                            expand="full" 
                            shape="round"
                            onClick={() => handleSignIn()}
                            >
                                Welcome !
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

                    {(signInLevel > 3) && 
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