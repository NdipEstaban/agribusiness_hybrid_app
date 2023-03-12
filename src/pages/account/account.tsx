import React, { RefObject } from 'react';
import { useRef, useState } from 'react';
import {IonPage, useIonActionSheet,IonItem,IonImg,IonText,IonModal, IonToolbar, IonHeader, IonTitle, IonButton, IonContent, IonList, IonInput, IonLabel, IonTextarea, IonFooter, useIonToast, useIonAlert, IonLoading, useIonViewWillEnter, IonAvatar, IonSelect, IonSelectOption} from '@ionic/react';

import AccountCard from '../../components/account_card/account_card';
import TransactionItem from './components/transaction_item/transaction_item';

import tomatoes from '../../assets/images/tomatoes.png';
import products from '../../assets/constants/products';
import cities from '../../assets/constants/cities';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowLeftLong, faGear, faListDots,faBiking, faCar, faImage, faTruck, faTruckPickup } from '@fortawesome/free-solid-svg-icons';

import './account.scss';
import { RouteComponentProps, useParams,  } from 'react-router';
import {useHistory} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux_hooks';
import { useGetRecentOrdersQuery, useLazyGetRecentOrdersQuery } from '../../redux/api/order/orderSlice';
import { useUpdateUserMutation } from '../../redux/api/user/userSlice';
import { useStorage } from '../../hooks/useStorage';
import { clearUser, updateEmail, updateUser } from '../../redux/features/user/userSlice';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useLazyGetMostOrderedProductsQuery, useLazyGetOrdersPerMonthQuery } from '../../redux/api/statistics/statisticsSlice';
import OrdersBarChart from '../../components/orders_bar_chart/orders_bar_chart';
import { useChatsStorage } from '../../hooks/useChatStorage';
import { useBackupUserDataMutation } from '../../redux/api/backup/backup';
import { useSendOtpMutation } from '../../redux/api/auth/authSlice';
import { decryptRequest } from '../../utils/crypto_utility';
import { trendingUpOutline } from 'ionicons/icons';

let ratesPrices:number[] = [];
for(let i = 1000; i <= 50000; i+= 500){
    ratesPrices.push(i);
}

let nameRegex = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}/;
let descriptionRegex = /^[a-zA-Z0-9\s]{50,}/;
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

const Account:React.FC = () => {
    const history = useHistory();
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const {clearUserDetails, retrievePendingOrders, userDetails, saveUserDetails, updateUserEmail} = useStorage();
    const {retrieveChatData} = useChatsStorage();

    //refs for toggling and untoggling
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef(null);
    const emailRef = useRef<HTMLInputElement>(null);

    
    const verifCodeRef = useRef<HTMLInputElement>(null);
    const quaterRef = useRef<HTMLInputElement>(null);

    //ionic's hooks
    const [presentToast] = useIonToast();
    const [presentAlert] = useIonAlert();
    const [presentActionSheet] = useIonActionSheet();

    //edit account modal states
    const [modalName, setModalName] = useState<Array<any>>([user.name, true]);
    const [modalCity, setModalCity] = useState<string>(user.city);
    const [modalQuater, setModalQuater] = useState<Array<any>>([user.quater, true]);
    const [modalDescription, setModalDescription] = useState<any>([user.description, true]);
    const [modalImage, setModalImage] = useState<any>(user.profilePicture);
    const [userPref, setUserPref] = useState<any>(user.userPref);

    const [updateUserInfo] = useUpdateUserMutation();
    const accountModal = useRef<HTMLIonModalElement>(null);
    //loader's state
    const [editFormOpen, setEditFormOpen] = useState<boolean>(false);

    //options modal states
    const [optionsModal, setOptionsModal] = useState<any>({isOpen:false, purpose:'logout'});
    const [email, setEmail] = useState<Array<any>>([]);
    const [changeEmail, setChangeEmail] = useState<boolean>(false);

    const [fetchRecentOrders, {data:recentOrders, isLoading:fetchingRecentOrders, isError:couldNotFetchRecentOrders}] = useLazyGetRecentOrdersQuery();
    const [fetchOrdersPerMonth, {data:ordersPerMonth, isLoading:fetchingOrdersPerMonth, isError:couldNotFetchOrdersPerMonth}] = useLazyGetOrdersPerMonthQuery();
    const [fetChMostOrderedProducts, {data:mostOrderedProducts, isLoading:fetchingMostOrderedProducts, isError:couldNotFetchMostOrderedProducts}] = useLazyGetMostOrderedProductsQuery();
    const [sendOtp, {data:otp, isLoading, isSuccess:otpSuccess}] = useSendOtpMutation();
    const [backupUserData] = useBackupUserDataMutation();

    const dismissModal = () => {
        accountModal.current?.dismiss();
    }

    const handleOptCode = (e:any) => {
        let inputVal = e.target.value;
        let {otpCode} = decryptRequest(otp);
        console.clear();
        if(inputVal === otpCode){
             //clear states for user
            presentToast({
                message:"Account successfully deleted",
                duration:1500
            });
            dispatch(clearUser());
            clearUserDetails();

            //Todo:take user to login page
            setOptionsModal({isOpen:false, purpose:'delete account'})
            history.replace('/');
            window.location.reload();
        }
    }

    const handleChangePhoto = async() => {
        const image = await Camera.getPhoto({
            quality: 50,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
          });
          setModalImage(image.dataUrl);
    }

    const handleUserPref = (e:any) => {
        if(user.role === 'delivery'){
            
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

    const handleConfirmEmailChange = async() => {
        if(email[1] === true){
            await sendOtp(email);
            setChangeEmail(true);
        }
    }

    const handleOtpForEmail = async(e:any) => {
        let inputVal = e.target.value;
        let {otpCode} = decryptRequest(otp);
        console.clear();
        if(inputVal === otpCode){
             //clear states for user
            presentToast({
                message:"Email successfully updated",
                duration:1500
            });

            //Todo:take user to login page
            setOptionsModal({isOpen:false, purpose:'delete account'});
            dispatch(updateEmail({email:email[0]}));
            updateUserEmail(email[0]);
        }
    }

    const logout = async() => {
        //retrieve user data from store
        let chatsData = await retrieveChatData();
        let pendingOrdersData = await retrievePendingOrders();

        //backup user data on server
        backupUserData({userData:{chatsData, pendingOrdersData}, userId:user.userId});

        //clear states for user
        dispatch(clearUser());
        clearUserDetails();

        //redirect to login/signin page
        history.replace('/');
        window.location.reload();
    }

    const canDismissModal = () => {
        return new Promise<boolean>((resolve, reject) => {
            presentActionSheet({
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
                        updateUserDetails();
                    }else{
                        reject();
                    }
                }
            })
        });
    }

    const updateUserDetails = async() => {
        let states = [modalDescription[1], modalName[1], modalQuater[1]];
        if(states.indexOf(false) !== -1 || userPref.length < 1 || modalCity.length < 2){
            presentAlert({
                message:"Some fields have not been filled properly"
            });
            return;
        }
        setEditFormOpen(true);
        let userDetails = {
            userId:user.userId,
            name:modalName[0],
            description:modalDescription,
            city:modalCity,
            quater:modalQuater[0],
            profilePicture:modalImage,
            userPref
        }

        updateUserInfo(userDetails).unwrap().then((data) => {
            presentToast({
                message:'details successfully updated',
                duration:1500
            });

            let userDetailToStore = {
                userId:user.userId,
                name:data.name,
                email:data.email,
                quater:data.quater,
                city:data.city,
                profilePicture:data.profile_picture,
                role:data.role,
                userPref:user.userPref,
                description:data.description[0],
                apiKey:data.api_key,
                authed:true
            }
            saveUserDetails(userDetailToStore).then(() => dispatch(updateUser(userDetails)))
            dismissModal();
            setEditFormOpen(false);
        }).catch((err:any) => {
            presentAlert({
                header:'Oops, Connection issues',
                message:"There was a problem when processing your request, please try again"
            });
            setEditFormOpen(false);
        });
    }


    useIonViewWillEnter(() => {
        let date = new Date();
        fetchRecentOrders({userId:user.userId, role:user.role});
        fetchOrdersPerMonth({userId:user.userId, year:date.getFullYear()});
        fetChMostOrderedProducts(user.userId);
    })

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot='start'>
                        Account
                    </IonTitle>
                    <IonButton
                        slot='end' 
                        fill='clear' 
                        onClick={() => presentActionSheet({
                            header:"Extra",
                            cssClass:'my-custom-class',
                            buttons:[
                                {
                                    text: 'Logout',
                                    role: 'logout'
                                },
                                {
                                    text:'Delete Account',
                                    role:'delete account'
                                },
                                {
                                    text:"Change my Email",
                                    role:"change email"
                                }
                            ],
                            onWillDismiss:(ev) => {
                                if(ev.detail.role === 'logout'){
                                    presentAlert({
                                        header:"Are you sure you want to logout?",
                                        message:"You will be logged-out of this device and will be required to verify your account to log-in again",
                                        buttons:[
                                            {
                                                text:"Yes",
                                                role:"Confirm",
                                                handler:() => {
                                                    logout();
                                                }
                                            },
                                            {
                                                text:"No",
                                                role:"cancel"
                                            }
                                        ]
                                    });
                                }else if(ev.detail.role === 'delete account'){
                                    presentAlert({
                                        header:"Are you sure you want to delete your account??",
                                        buttons:[
                                            {
                                                text:"Yes",
                                                role:"Confirm",
                                                handler:() => {
                                                    setOptionsModal({isOpen:true, purpose:'delete account'});
                                                    sendOtp(user.email);
                                                }
                                            },
                                            {
                                                text:"No",
                                                role:"cancel"
                                            }
                                        ]
                                    });
                                }else if(ev.detail.role === 'change email'){
                                    setOptionsModal({isOpen:true, purpose:'change email'})
                                }else{return}
                            }
                        })}
                    >
                        <FontAwesomeIcon icon={faListDots} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className='account-page'>
                <div className='account-page-inner'>
                    <section className='account-card-section'>
                        <div className='account-card-wrapper'>
                            <AccountCard 
                                id='account-card-edit' 
                                edit={true}
                                name={user.name}
                                image={user.profilePicture}
                                quarter={user.quater}
                                city={user.city}
                                role={user.role}
                                description={user.description}
                            />
                        </div>
                        <IonText>
                            <h3 style={{'marginLeft':"0.5rem"}}>Last Transactions</h3>
                        </IonText>
                        <IonList lines='none'>
                            {
                                recentOrders?.map((order:any) => {
                                    let date = new Date(`${order.date}`);
                                    return(
                                        <TransactionItem
                                            key={order.id}
                                            id={order.id}
                                            image={order.picture}
                                            name={order.name}
                                            date={`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
                                            amount={order.amount}
                                            fromMe={order.fromMe}
                                        />
                                    );
                                })
                            }
                        </IonList>
                        {/*Edit account form*/}
                        <div className='most-popular most-popular-product-section'>
                            <h3>Most ordered products</h3>
                            <IonList>
                                {
                                    mostOrderedProducts?.map((prod:any) => 
                                        <IonItem className='most-popular-product' key={`popular-${prod.id}`}>
                                            <IonAvatar>
                                                <img src={prod.image} alt=''/>
                                            </IonAvatar>
                                            <div className='product-attributes'>
                                                <IonText className='product-name'>
                                                    {prod.name}
                                                </IonText>
                                                <IonText className='product-price'>{prod.unitPrice} CFA/Kg</IonText>
                                            </div>
                                            <div>
                                                {prod.numOfOrders} order{prod.numOfOrders > 1 && 's'}
                                            </div>
                                        </IonItem>
                                    )
                                }
                            </IonList>
                        </div>
                        {
                            user.role !== 'consumer' && 
                            <div className='most-popular most-popular-user-section'>
                            <h3>My most frequent {user.role === 'merchant'?"Clients": "Merchants"}</h3>
                            <IonList>
                                <IonItem>
                                    <IonAvatar>
                                        <img src={tomatoes} alt=''/>
                                    </IonAvatar>
                                    <div className='user-name'>
                                        <IonText>
                                            John summerset
                                        </IonText>
                                    </div>
                                    <div>
                                        20 orders
                                    </div>
                                </IonItem>
                            </IonList>
                        </div>
                        }
                    </section>
                    <section className='charts-section'>
                        {
                            (ordersPerMonth !== undefined) &&
                            <>
                                <OrdersBarChart data={ordersPerMonth}/>
                                {/* <BarChart data={ordersPerMonth} isLoading={fetchingOrdersPerMonth} isError={couldNotFetchOrdersPerMonth}/> */}
                            </>
                        }
                    </section>
                </div>
                
                
                
                <IonModal ref={accountModal} trigger='account-card-edit' className='edit__account__modal'>
                    <IonLoading isOpen={editFormOpen} spinner={'circles'} />
                    <IonContent>
                        <div className='edit__account__modal-image'>
                            <div className='picture-wrapper'>
                                {
                                    (modalImage === undefined || modalImage === null || modalImage.length < 5 )?
                                    <FontAwesomeIcon className='picture' icon={faImage}/>
                                    :
                                    <img src={modalImage} className='picture' alt="user's profile" />
                                }
                                
                            </div>
                            <IonButton fill='clear' onClick={() => handleChangePhoto()}>
                                change profile picture
                            </IonButton>
                        </div>
                        <IonList>
                            <label className='create__account-label'>
                                    Name
                                    <input
                                    ref={nameRef} 
                                    type='text' 
                                    placeholder='James bond' 
                                    onChange={(e) => inputHandler(e, nameRegex, setModalName, nameRef)} 
                                    value={modalName[0]}
                                    required
                                    maxLength={25}
                                    />
                                    {/* render an error text only when the value does not pass the regex test */}
                                    {(modalName[1] === false) && 
                                    <p className='input-error-message'>
                                        Ayayay, please enter atleast 2 names
                                    </p>}
                            </label>
                            <label className='create__account-label selection-label'>
                                City
                                <IonSelect value={modalCity} className='selection' interface="popover" placeholder='Douala' onIonChange={(e) => setModalCity(e.detail.value)}>
                                    {cities.map(i => <IonSelectOption key={i} value={i} defaultChecked={userPref.indexOf(i) !== -1}>{i}</IonSelectOption>)}
                                </IonSelect>
                            </label>
                            <label className='create__account-label'>
                                Quarter
                                <input ref={quaterRef} type='text' placeholder='Makepe, carrefour petit pays' onChange={(e) => inputHandler(e,quaterRegex, setModalQuater, quaterRef)}/>
                                {
                                    (modalQuater[1] === false) &&
                                    <p className='input-error-message'>
                                        please enter a precise area in {modalCity}
                                    </p>
                                } 
                            </label>
                            <React.Fragment>
                                {(user.role === 'delivery')?
                                    <React.Fragment>
                                        <label className='selection-label'>
                                            City
                                            <IonSelect className='selection' interface="popover" placeholder="Douala" onIonChange={(e) => handleUserPref({value: e.detail.value, field:'city'})}>
                                                {cities.map(i => <IonSelectOption key={i} value={i} defaultChecked={userPref.indexOf(i) !== -1}>{i}</IonSelectOption>)}
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
                                                <IonSelectOption value={"tricycle"} defaultChecked={userPref.indexOf('tricycle') !== -1}>
                                                    <FontAwesomeIcon icon={faCar} />
                                                    Tricycle
                                                </IonSelectOption>
                                                <IonSelectOption value={"pickup"} defaultChecked={userPref.indexOf('pickup') !== -1}>
                                                    <FontAwesomeIcon icon={faTruckPickup} />
                                                    Pickup
                                                </IonSelectOption>
                                                <IonSelectOption value={"truck"} defaultChecked={userPref.indexOf('truck') !== -1}>
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
                                                            <IonSelectOption value={i} defaultChecked={userPref.indexOf('truck') !== -1}>{i}</IonSelectOption>
                                                        )
                                                    }
                                                </IonSelect>XAF/Order
                                            </div>
                                            
                                        </label>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <label className='selection-label create__account-label'>
                                            {user.role === 'merchant'?"Main product":"Favorite products"}

                                            <IonSelect className='selection' interface="popover" placeholder="Mango" multiple={user.role === "merchant"?false:true} onIonChange={(e) => handleUserPref(e)}>
                                                {products.map(i => <IonSelectOption key={i} value={i} defaultChecked={userPref.indexOf(i) !== -1}>{i}</IonSelectOption>)}
                                            </IonSelect>
                                        </label>
                                    </React.Fragment>
                                    }
                            </React.Fragment>
                            <label className='create__account-label'>
                                Description
                                <textarea ref={descriptionRef} maxLength={150} className='edit__account__modal-textarea' value={modalDescription[0]} onChange={(e:any) => inputHandler(e, descriptionRegex, setModalDescription, descriptionRef)} /> 
                                {
                                    (modalDescription[1] === false) &&
                                    <p className='input-error-message'>
                                        description is too short, write something about yourself
                                    </p>
                                } 
                            </label>
                            <div className='edit__modal__buttons'>
                                <IonButton shape='round' expand='full' className='account__modal__buttons' fill='solid'  onClick={canDismissModal}>Confirm</IonButton>
                                <IonButton shape='round' expand='full' className='account__modal__buttons' fill='outline' onClick={dismissModal}>Cancel</IonButton>
                            </div>
                        </IonList>
                    </IonContent>
                </IonModal>

                <IonModal isOpen={optionsModal.isOpen} className="options-modal">
                    <IonHeader>
                        <IonToolbar>
                            <IonButton slot='start'  fill='clear' onClick={() => setOptionsModal({isOpen:false, purpose:'none'})}>
                                <FontAwesomeIcon icon={faArrowLeftLong} />
                            </IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {
                            (optionsModal.purpose === 'change email')?
                                <React.Fragment>
                                    {
                                        (changeEmail === false)?
                                        <React.Fragment>
                                            <label className='create__account-label' style={{marginTop:"12rem"}}>
                                                New Email
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
                                            <div className='edit__modal__buttons'>
                                                <IonButton shape='round' expand='full' className='account__modal__buttons' fill='solid'  onClick={() => handleConfirmEmailChange()}>Confirm</IonButton>
                                            </div>
                                        </React.Fragment>
                                        :
                                        <label className='create__account-label verification-code-label'  style={{marginTop:"12rem"}}>
                                            <input type='text' maxLength={6} placeholder="123456" onChange={(e) => handleOtpForEmail(e)}/>
                                        </label>
                                    }
                                </React.Fragment>
                            :
                                <React.Fragment>
                                        <p className='delete-account-warning-message'>
                                            Your account will be deleted with all the ongoing transactions,
                                            and orders. Enter the verification code sent to your email to delete your account
                                        </p>
                                        <label className='create__account-label verification-code-label'>
                                            <input type='text' maxLength={6} placeholder="123456" onChange={(e) => handleOptCode(e)}/>
                                        </label>
                                </React.Fragment>
                        }
                    
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
}

export default Account;