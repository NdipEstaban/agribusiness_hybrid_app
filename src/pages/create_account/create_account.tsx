import {IonButton, IonTitle, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonSelect, IonSelectOption, useIonLoading} from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBiking, faCar, faImage, faTruck, faTruckPickup } from '@fortawesome/free-solid-svg-icons';
import './create_account.scss';
import React, {RefObject, useRef, useState } from 'react';
import cities from '../../assets/constants/cities';
import products from '../../assets/constants/products';
import {CameraResultType, Camera, CameraSource} from "@capacitor/camera"
import { useAppDispatch, useAppSelector } from '../../hooks/redux_hooks';
import { useSignInMutation, useSendOtpMutation, useLogInMutation } from '../../redux/api/auth/authSlice';
import { useUpdateConsumerMutation, useUpdateMerchantMutation, useUpdateDeliveryMutation } from '../../redux/api/user/userSlice';
import { setFlagsFromString } from 'v8';
import { logIn, send } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { updateUser } from '../../redux/features/user/userSlice';
import { decryptRequest } from '../../utils/crypto_utility';
import { useIonAlert } from '@ionic/react';
import { User, useStorage } from '../../hooks/useStorage';
import { current } from '@reduxjs/toolkit';
import { useLazyGetUserDataQuery } from '../../redux/api/backup/backup';
import { useChatsStorage } from '../../hooks/useChatStorage';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from '../../components/imageCropper/imageCropper';


let nameRegex = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}/;
let emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
let quaterRegex = /^[a-zA-Z]{3,}|[0-9a-zA-Z]{3,}\s[a-zA-Z0-9]{2,} | [0-9a-zA-Z]{3,}/i;

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

let ratesPrices:number[] = [];
for(let i = 1000; i <= 50000; i+= 500){
    ratesPrices.push(i);
}

type SignInLevel = 1 | 2 | 3 | 4 | 5 | 6;

/*sign-in levels
-> 1: email
-> 2: verification code
-> 3: name
-> 4:selection of profile picture
-> 5:selection of role
-> 6:user prefferences
*/
interface createAccountProps{
    saveUserDetails:(user: User) => Promise<void>;
    markAuthed:() => Promise<void>
}

export const CreateAccount:React.FC<createAccountProps> = ({saveUserDetails, markAuthed}) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const imageCropperRef = useRef<HTMLDivElement>(null);
    const [presentLoader, dismissLoader] = useIonLoading();
    // const {saveUserDetails, markAuthed, } = useStorage();
    const {restorePendingOrders} = useStorage();
    const {restoreChatData} = useChatsStorage();

    const [signIn, {isLoading:signInLoading, isError:signInError, isSuccess:signInSuccess}] = useSignInMutation();
    const [sendOtp, {data:otp, isLoading, isSuccess:otpSuccess}] = useSendOtpMutation();
    const [getBackupData] = useLazyGetUserDataQuery();
    const [logIn, {}] = useLogInMutation();
    const [updateConsumer] = useUpdateConsumerMutation();
    const [updateMerchant] = useUpdateMerchantMutation();
    const [updateDelivery] = useUpdateDeliveryMutation();
    //The sign up level determines which part of the sign-in process to display
    const [signInLevel, setSignInLevel] = useState<SignInLevel>(1);

    //Refs to toggle the forms border color depending on the validity of data
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const verifCodeRef = useRef<HTMLInputElement>(null);
    const quaterRef = useRef<HTMLInputElement>(null);

    /*Local state to hold the values entered by the user, each is an array containing the
    the user at index 0 and whether it's valid using a boolean at index 1*/
    
    const [name, setName] = useState<Array<any>>(['']);
    const [email, setEmail] = useState<Array<any>>(['']);
    const [role, setRole] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [quater, setQuater] = useState<Array<any>>(['']);
    const [photo, setPhoto] = useState<string | undefined>('');
    const [userPref, setUserPref] = useState<Array<string>>([]);
    const [userExist, setUserExist] = useState<boolean>(false);

    const [verifCode, setVerifCode] = useState<Array<any>>(['']);

    //Navigate between different levels of account creation
    const nextSignInLevel = () => {
        switch(signInLevel){
            case 1:
                getVerificationCode();
                if(email[1] === true) setSignInLevel(1);
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
        let emailAddress = String(email[0]);

        if(email[1] === true){
            sendOtp(emailAddress).then((result:any) => {
                const response = decryptRequest(result?.data);
                console.log(response);
    
                if(response.hasOwnProperty("otpCode") === false){
                    presentAlert({
                        header: 'Oops, connection issues',
                        message: 'Could not send verification code please try again',
                        buttons: ['Try again'],
                    });
                }else{
                    setSignInLevel(2);
                } 
    
                if(response?.emailExist === true){
                    logIn(emailAddress).then( (info:any) => {
                        console.log(info);
                        let data = decryptRequest(info.data);
                        dispatch(updateUser(data));
                        setUserExist(true);

                        //restore backup data, will return empty arrays if none
                        getBackupData(data.user_id).unwrap().then((backup) => {
                            restoreChatData(backup.chatsData);
                            restorePendingOrders(backup.pendingOrdersData);
                        });
    
                        let userDetails:User = {
                            quater:data.quater,
                            userId:data.user_id,
                            email:data.email,
                            name:data.name,
                            city:data.city,
                            profilePicture:data.profile_picture,
                            role:data.role,
                            userPref,
                            description:data.description,
                            apiKey:data.api_key,
                            authed:false,
                        };
                        
                        saveUserDetails(userDetails);
                    });
                }
            }).catch(err => {
                presentAlert({
                    header: 'Oops, no network connection',
                    message: 'Please turn on your network connection and try again',
                    buttons: ['Try again'],
                })
            });
        }
        
    };

    //check verification code, if successful then move on to next level in account creation
    const handleVerificatonCode = async(e:any) => {
        let code = e.target.value;
        let data = decryptRequest(otp);
        console.log(data)
        if(code === data.otpCode){
            setVerifCode([verifCode, true]);
            //If user already has an account then move to home screen
            // await markAuthed();
            if(userExist){
                await markAuthed();
                history.push("/main");
            };
            setSignInLevel(3);
        }else{
            setVerifCode([verifCode, false]);
        }
    };

    //prompt user to select photo either from gallery or camera
    const handlePhoto = async() => {
        console.log('handling photo')
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            width:200,
            height:200,
        });
        console.log('done handling photo');
        setPhoto(image.dataUrl);
        imageCropperRef.current!.style.display = 'flex';
    }

    const handlePhotoFromCropper = (image:string) => {
        imageCropperRef.current!.style.display = 'none';
        setPhoto(image);
    }

    //set userPrefference depending on the type of user, products for merchants and consumers and city for delivery
    const handleUserPref = (e:any) => {
        if(role === 'delivery'){
            
            let userPrefs = [...userPref];
            let {field, value} = e;
            if(field === 'city'){
                userPrefs[0] = value;
            }else if(field === 'vehicle'){
                userPrefs[1] = value;
            }else{
                userPrefs[2] = value;
            }
            setUserPref(userPrefs);
        }else{
            setUserPref([...e.detail.value]);
        }
    }

    //send sign in information to database
    const handleSignIn = () => {

        //check if userpref has been entered
        if(role === 'merchant'){
            if(userPref.length < 1){
                presentAlert({
                    header:"Empty field",
                    message:"please choose a product"
                });
                return;
            }
        }else if(role === 'delivery'){
            if(userPref.length < 2){
                presentAlert({
                    header:"Empty field",
                    message:"Please fill in all the fields"
                });
                return;
            }
        }else if(role === 'consumer'){
            if(userPref.length < 2){
                presentAlert({
                    header:"Choose more products",
                    message:"Please choose atleast 3 products"
                })
                return;
            }
        }else{
            //nothing
        }

        console.log(userPref);
        let user = {
            userId:'',
            name:name[0], 
            profilePhoto:photo, 
            city,
            quater:quater[0], 
            role, 
            email:email[0], 
            userPref:(role === 'merchant')?userPref.join(''):userPref,
            apiKey:"",
            description:"Edit your description",
        };

        let userDetails:User = {
            quater:quater[0],
            userId:user.userId,
            email:email[0],
            name:name[0],
            city:city,
            profilePicture:photo,
            role:role,
            userPref,
            description:null,
            apiKey:user.apiKey,
            authed:true,
        };

        signIn(user).unwrap().then(async(result:any) => {
            let data = decryptRequest(result);
            user.userId = data?.userId;
            userDetails.userId = data?.userId;
            user.apiKey = data?.apiKey;
            userDetails.apiKey = data?.apiKey
            
            await saveUserDetails(userDetails);
            dispatch(updateUser(user));
            history.push("/main");
        }).catch(err => {
            presentAlert({
                header: 'Oops, no network connection',
                message: 'Please turn on your network connection and try again',
                buttons: ['Try again'],
            });
        });
    }

    //Display otp loader
    if(isLoading){
        presentLoader({
            message:"Sending verification code",
            spinner:"circles"
        })
    }else{
        dismissLoader();
    }

    //Display sign-in loader
    if(signInLoading){
        presentLoader({
            message:"Creating your account",
            spinner:"circles"
        })
    }else{
        dismissLoader();
    }

    return(
        <IonPage>
            <IonContent>
               <div className="create__account-form-wrapper">
                <h3 className='create__account-form-title'>
                    Create your account
                </h3>
                <form className='create__account-form'>

                    {(signInLevel === 1) && 
                    <React.Fragment>
                        <p className='form_message'>
                            Your email address will be used to send you details about your
                            transactions. Please verify your email
                        </p>
                        <label className='create__account-label'>
                            Email
                            <input
                                ref={emailRef} 
                                type='email' 
                                placeholder='myemail@company.com' 
                                value={email[0]}
                                onChange={(e) => {
                                    inputHandler(e, emailRegex, setEmail, emailRef)}
                                }
                            />
                            {
                                email[1] === false &&
                                <p className='input-error-message'>
                                    Oops, invalid email please try again
                                </p> 
                            }
                        </label>
                    </React.Fragment>
                    }
                    {
                        (signInLevel === 2) &&
                        <React.Fragment>
                            <p className='form_message'>Verify your email by entering the code send to your email address</p>
                            <label className='create__account-label verification-code-label'>
                                <input type='text' maxLength={6} placeholder="123456" onChange={(e) => handleVerificatonCode(e)}/>
                            </label>
                            
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
                        placeholder='James bond' 
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
                    <label className='create__account-label selection-label'>
                        City
                        <IonSelect value={city} className='selection' interface="popover" placeholder='Douala' onIonChange={(e) => setCity(e.detail.value)}>
                            {cities.map(i => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                        </IonSelect>
                    </label>
                    <label className='create__account-label'>
                        Quater
                        <input ref={quaterRef} type='text' placeholder='Makepe, carrefour petit pays' onChange={(e) => inputHandler(e,quaterRegex, setQuater, quaterRef)}/>
                        {
                            (quater[1] === false) &&
                            <p className='input-error-message'>
                                please enter a precise area in {city}
                            </p>
                        } 
                    </label>
                    </React.Fragment>
                    }
                    {
                        (signInLevel === 4) && 
                        <React.Fragment>
                            <div className='add-pic-section'>
                                {
                                    (photo !== undefined && photo !== '') &&
                                    <div  ref={imageCropperRef} className='image-cropper-util'>
                                        <ImageCropper image={photo} aspect={1} width={300} height={300} submitImage={handlePhotoFromCropper}/>
                                    </div>
                                    
                                }
                                <div className='picture-wrapper'>
                                    {
                                        (photo === '' || photo === undefined)?
                                        <FontAwesomeIcon className='picture' icon={faImage}/>
                                        :
                                        <img src={photo} className='picture' alt="user's profile"/>
                                    }
                                </div>
                                <h6 className='camera-btn' onClick={() => {handlePhoto()}}>Add a profile picture</h6>
                            </div>
                        </React.Fragment>
                    }
                    {
                        (signInLevel === 5) && 
                        <React.Fragment>
                            <div className='proffession-container'>
                                {/* <h3>What will you be doing?</h3> */}
                                <button className='prof-card trader' onClick={() => {setRole('merchant');setUserPref([])}} type="button">
                                    <h6>Merchant</h6>
                                    <p>
                                        I sell crops on the platform and I can make use 
                                        of the delivery services
                                    </p>
                                </button>
                                <button className='prof-card delivery' onClick={() => {setRole('delivery');setUserPref([])}} type="button">
                                    <h6>Delivery</h6>
                                    <p>
                                        I offer delivery services to merchants and safely deliver
                                        crops from merchant to consumer
                                    </p>
                                </button>
                                <button className='prof-card producer' onClick={() => {setRole('consumer');setUserPref([])}} type="button">
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
                                <React.Fragment>
                                    <label className='selection-label'>
                                        City
                                        <IonSelect className='selection' interface="popover" placeholder="Douala" onIonChange={(e) => handleUserPref({value: e.detail.value, field:'city'})}>
                                            {cities.map(i => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                                        </IonSelect>
                                    </label>
                                    <label className='selection-label'>
                                        Vehicle
                                        <IonSelect className='selection' interface='popover' placeholder='bike' onIonChange={(e) => handleUserPref({value: e.detail.value, field:'vehicle'})}>
                                            <IonSelectOption value={"bike"}>
                                                <div>
                                                    Bike
                                                    <FontAwesomeIcon icon={faBiking} />
                                                </div>
                                                
                                            </IonSelectOption>
                                            <IonSelectOption value={"tricycle"}>
                                                <FontAwesomeIcon icon={faCar} />
                                                Tricycle
                                            </IonSelectOption>
                                            <IonSelectOption value={"pickup"}>
                                                <FontAwesomeIcon icon={faTruckPickup} />
                                                Pickup
                                            </IonSelectOption>
                                            <IonSelectOption value={"truck"}>
                                                <FontAwesomeIcon icon={faTruck} />
                                                Truck
                                            </IonSelectOption>
                                        </IonSelect>
                                    </label>
                                    <label className='selection-label'>
                                        Rate
                                        <div className='create__account-rate'>
                                            <IonSelect className='selection' interface='popover' placeholder='1000' onIonChange={(e) => handleUserPref({value: e.detail.value, field:'rate'})}>
                                                {
                                                    ratesPrices.map(i => 
                                                        <IonSelectOption value={i}>{i}</IonSelectOption>
                                                    )
                                                }
                                            </IonSelect>XAF/Order
                                        </div>
                                        
                                    </label>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <p className='form_message'>
                                        Select your most consumed or sold products
                                    </p>
                                    <label className='selection-label'>
                                    <IonSelect className='selection' interface="popover" placeholder="Mango" multiple={role === "merchant"?false:true} onIonChange={(e) => handleUserPref(e)}>
                                        {products.map(i => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                                    </IonSelect>
                                    </label>
                                </React.Fragment>
                                }
                        </React.Fragment>
                    }
                    {signInLevel === 6?
                       <React.Fragment>
                            <IonButton 
                            className='create__account-btn create__account-submit-btn' 
                             
                            shape="round"
                            onClick={() => handleSignIn()}
                            >
                                Welcome !
                            </IonButton>
                       </React.Fragment>
                        :
                        <IonButton
                        className='create__account-btn create__account-submit-btn' 
                        expand="full" 
                        shape="round"
                        onClick={() => nextSignInLevel()}
                        > 
                            Next 
                        </IonButton>
                    }

                    {(signInLevel > 3) && 
                        <IonButton
                        className='create__account-btn create__account-back-btn'
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