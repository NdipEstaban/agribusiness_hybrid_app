import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import {IonPage,useIonViewWillEnter, useIonViewWillLeave, IonList, IonTitle,IonText,IonTextarea,IonHeader, IonToolbar, IonAvatar, IonImg, IonContent, IonLabel, IonInput, IonButton, IonModal, IonVirtualScroll, useIonToast,} from '@ionic/react';

import './chat_page.scss';
import companyLogo from '../../assets/images/abic_logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowLeftLong, faFileImage, faImage, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
 
import img from './../../assets/images/abic_logo.png';
import ChatText from './components/chat_text/chat_text';

import { useHistory, useParams } from 'react-router';
import { hideTabBar, showTabBar } from '../../utils/iontabbar-controller';
import {v4 as uuid} from 'uuid';
import { Camera, CameraResultType } from '@capacitor/camera';
import { chatItem, messageItem } from '../../hooks/useChatStorage';
import { useGetUserByIdMutation } from '../../redux/api/user/userSlice';
import { useAppSelector } from '../../hooks/redux_hooks';

const messagesTemp = [
    {
        id:'',
        text:"How are you today",
        source:"sender",
        time:"18:23",
        recieved:true
    },
    {
        id:'',
        text:"Am good and you",
        source:"reciever",
        time:"18:25",
        recieved:false
    },
    {
        id:'',
        text:"How is mom",
        source:"sender",
        time:"18:30",
        recieved:false
    },
    {
        id:'',
        text:"She is fine, how about your wife",
        source:"reciever",
        time:"18:25",
        recieved:false
    },
    {
        id:'',
        text:"How is mom",
        source:"sender",
        time:"18:30",
        recieved:false
    },
    {
        id:'',
        text:"She is fine, how about your wife",
        source:"reciever",
        time:"18:25",
        recieved:false
    },
    {
        id:'',
        text:"How is mom",
        source:"sender",
        time:"18:30",
        recieved:false
    },
    {
        id:'',
        text:"She is fine, how about your wife",
        source:"reciever",
        time:"18:25",
        recieved:false
    },
    {
        id:'',
        text:"How is mom",
        source:"sender",
        time:"18:30",
        recieved:false
    },
    {
        id:'',
        text:"She is fine, how about your wife",
        source:"reciever",
        time:"18:25",
        recieved:false
    }
]

interface chatPageProps{
    socket:any;
    addRecievedMessage:(userId: string, newMessage: messageItem, user?: any) => Promise<void>;
    getChatData:(userId:string) => chatItem | undefined;
    createChat:(userId: string, name: string, image: string) => Promise<void>;
    deleteChat:(userId: string) => Promise<void>;
    addMessage:(userId: string, messageData: messageItem) => Promise<void>;
    deleteMessage:(userId: string, messageId: string) => Promise<void>;
    setCurrentChat:(userId: string | null) => Promise<void>;
    markReadChat:(userId: string) => Promise<void>
}

const ChatPage:React.FC<chatPageProps> = ({getChatData, createChat, addMessage, deleteMessage, deleteChat, socket, setCurrentChat, markReadChat, addRecievedMessage}):JSX.Element => {
    const user = useAppSelector(state => state.user);
    const params:{id:string} = useParams();
    console.log(params.id);
    const [presentToast] = useIonToast();
    const messagesContainer = useRef<null | HTMLDivElement>(null);
    const [fetchUserData] = useGetUserByIdMutation();

    const [messageText, setMessageText] = useState<any>('');
    const [messages, setMessages] = useState<Array<any>>([]);
    const [openImageModal, setOpenImageModal] = useState<any>(false);
    const [recipientInfo, setRecipientInfo] = useState<{
                                                        userId:string, 
                                                        name:string, 
                                                        profilePicture:string
                                                    }>({
                                                        userId:'', 
                                                        name:'', 
                                                        profilePicture:''
                                                    });

    const [sendImage, setSendImage] = useState<any>('');
    const [userOnline, setUserOnline] = useState<Boolean>(false);

    useIonViewWillEnter(() => {
        //utility to hide tabbar
        hideTabBar();

        //set the data required by the chat page or fetch info
        let chatData = getChatData(params.id);
        if(chatData !== undefined && chatData !== null){
            setMessages(chatData.messages);
            setRecipientInfo({userId:chatData.userId, name:chatData.name, profilePicture:chatData.image});
            setCurrentChat(chatData.userId);
            socket.emit('user-read-messages', {reciever:chatData.userId, sender:user.userId});
            
            //verify if user is online
            socket.emit('verify-user-online', params.id, (info:any) => {
                if(info.userOnline === true){
                    setUserOnline(true);
                }else{
                    setUserOnline(false);
                }
            });
        }else{
            fetchUserData(params.id).unwrap().then((data:any) => {
                console.log(data);
                setRecipientInfo({userId:data.user_id, name:data.name, profilePicture:data.profile_picture});
                createChat(data.user_id, data.name, data.profile_picture);
                setCurrentChat(data.user_id)
                socket.emit('user-read-messages', {reciever:data.user_id, sender:user.userId});
                socket.emit('verify-user-online',data.user_id);
                //verify if user online

                socket.emit('verify-user-online', params.id, (info:any) => {
                    if(info.userOnline === true){
                        setUserOnline(true);
                    }else{
                        setUserOnline(false);
                    }
                });
            })
        }
        
        //scroll to the bottom of the messages
        messagesContainer.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    });

    useIonViewWillLeave(() => {
        setCurrentChat(null);
        showTabBar();
    });

    //whenever a message is sent update the list of messages
    useEffect(() => {
        let chatData = getChatData(params.id);
        if(chatData !== undefined && chatData !== null){
            setMessages(chatData.messages);
        }
    }, [addMessage]);

    useEffect(() => {
        socket.on('recieve-message', async(data:any) => {
            let {sender, messageData} = data;
            if(params.id === 'admin'){
                let userInfo = {
                    name:'',//admin chat is always present so no need to add data
                    image:'',
                }
                await addRecievedMessage(sender, messageData, userInfo)
                await markReadChat('admin');
                socket.emit('user-read-messages', {reciever:'admin', sender:user.userId});
            }else{
                fetchUserData(params.id).unwrap().then(async(data:any) => {
                    console.clear();
                    if(sender === data.user_id){
                        let userInfo = {
                            name:data.name,
                            image:data.profile_picture
                        }
                        console.log('currenttly chatting with');
                        await addRecievedMessage(sender, messageData, userInfo)
                        await markReadChat(data.user_id);
                        socket.emit('user-read-messages', {reciever:data.user_id, sender:user.userId});
                    }
                })
            }
            
        });

        socket.on('chats-read', async(data:any) => {
            let {chatId} = data;
            console.log('user read chat', chatId);
            await markReadChat(chatId);
        });

        socket.on('user-gone-offline', async(userId:string) => {
            if(userId === params.id){
                setUserOnline(false);
            }
        });

        socket.on('user-came-online', async(userId:string) => {
            if(userId === params.id){
                setUserOnline(true);
            }
        });

        socket.emit('verify-user-online', params.id, (info:any) => {
            if(info.userOnline === true){
                setUserOnline(true);
            }else{
                setUserOnline(false);
            }
        });

    }, [socket])

    const sendMessage = async() => {
        //creating the message object
        let today = new Date();
        let newMessage = {
            id:uuid(),
            text:messageText,
            date:today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(),
            time:today.getHours() + ":" + today.getMinutes(),
            recieved:false,
            source:'sender',
            image:null,
            sent:false
        }

        if(sendImage?.length >= 1){
            newMessage.image = sendImage;
            setMessageText('');
            setSendImage('');
        }else if(messageText?.length >= 1){
            setMessageText('');
        }else{
            presentToast({
                message:"Cannot send empty message",
                duration:1500
            });
        }

        if(params.id === 'admin'){
            await addMessage('admin', newMessage);
            let chat = getChatData(params.id);
            if(chat !== null && chat !== undefined){
                setMessages(chat!.messages);
                setOpenImageModal(false);
                console.log('not creating chat');
            }
        }else{
            await addMessage(recipientInfo.userId, newMessage);
            let chat = getChatData(params.id);
            if(chat !== null && chat !== undefined){
                setMessages(chat!.messages);
                setOpenImageModal(false);
                console.log('not creating chat');
            }
        }
    }

    const attachPicture = async() => {
        const image = await Camera.getPhoto({
            quality: 70,
            allowEditing: true,
            resultType: CameraResultType.DataUrl
        });
        setSendImage(image.dataUrl);

        setOpenImageModal(true);
    }

    const handleDeleteMessage = async(messageId:string) => {
        await deleteMessage(recipientInfo.userId, messageId);
        let chatData = getChatData(params.id);
        setMessages(chatData!.messages);
    }

    useEffect(() => {
        messagesContainer.current?.scrollIntoView({ block: 'end', behavior:'auto' });
    }, [messages])

    return(
        <IonPage className='chat-page'>
            <IonHeader>
                <IonToolbar className='chat__toolbar'>
                    <IonButton routerLink="/main/messaging" routerDirection="back" fill='clear' slot='start' >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </IonButton>
                    <IonAvatar slot='start'>
                        <IonImg src={(params.id === 'admin')?companyLogo:recipientInfo.profilePicture} />
                    </IonAvatar>
                    <IonLabel>
                        <h1 className='recipient-name'>{recipientInfo.name}</h1>
                        <h2 className={`recipient-status-${userOnline}`}>{(params.id !== 'admin')?((userOnline === true)?'online':'offline'):''}</h2>
                    </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div ref={messagesContainer} className='chat__messages-container'>
                    {
                        messages.map((item:any) => 
                        <ChatText 
                            key={item.id} 
                            id={item.id} 
                            source={item.source} 
                            time={item.time}
                            read={item.recieved} 
                            image={item?.image} 
                            text={item.text}
                            delete={handleDeleteMessage}
                            sent={item.sent}
                        />)
                    }
                </div>
                <div className='user-input'>
                    <IonButton className='pin-button' fill='clear' shape='round' slot='right' onClick={() => attachPicture()}>
                        <FontAwesomeIcon icon={faImage} />
                    </IonButton>
                    <IonTextarea 
                        className='chat-text-area' 
                        wrap='soft' 
                        maxlength={800} 
                        autoGrow={true} 
                        spellcheck={true} 
                        placeholder='Hello...' 
                        color='none'
                        value={messageText} 
                        onIonChange={(e) => setMessageText(e.detail.value)}
                    />
                    <IonButton className='send-button' color='primary' fill='solid' shape='round' onClick={() => sendMessage()}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </IonButton>
                </div>
            </IonContent>
            <IonModal isOpen={openImageModal} className='chat-image-modal-container'>
                    <IonHeader>
                        <IonToolbar>
                            <IonButton slot='start' fill='clear' onClick={() => setOpenImageModal(false)}>
                                <FontAwesomeIcon icon={faArrowLeftLong} />
                            </IonButton>
                            <IonTitle>
                                Share Image
                            </IonTitle>
                        </IonToolbar>
                        
                    </IonHeader>
                    <IonContent>
                        <div className='share-image-modal'>
                            <img src={sendImage} alt='added' />
                            <div className='user-input'>
                                <IonTextarea 
                                    className='chat-text-area' 
                                    wrap='soft' 
                                    maxlength={800} 
                                    autoGrow={true} 
                                    spellcheck={true} 
                                    placeholder='Hello...' 
                                    color='none'
                                    value={messageText} 
                                    onIonChange={(e) => setMessageText(e.detail.value)}
                                />
                                <IonButton className='send-button' color='primary' fill='solid' shape='round' onClick={() => sendMessage()}>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
            </IonModal>
        </IonPage>
    );
}

export default ChatPage;