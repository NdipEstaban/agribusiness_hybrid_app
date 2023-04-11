import React, {useState, useEffect, useMemo} from 'react';
import { IonPage,IonButton,IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonFabButton, IonFab, IonModal, IonSearchbar, IonText, IonItem, useIonViewWillLeave, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faMessage, faPlus, faTasks } from '@fortawesome/free-solid-svg-icons';
import companyLogo from '../../assets/images/abic_logo.png';

import MessageChat from './components/message_chat/message_chat';

import './messaging.scss';
import { useGetUserByIdMutation, useLazySearchUserQuery, useSearchUserQuery } from '../../redux/api/user/userSlice';
import { decryptRequest } from '../../utils/crypto_utility';
import { useHistory } from 'react-router';
import { chatItem, messageItem,  } from '../../hooks/useChatStorage';
import ChatPage from '../chat_page/chat_page';

interface messagingProps{
    currentChat:string | null;
    chats:chatItem[];
    socket:any;
    markReadChat:(userId: string) => Promise<void>;
    addRecievedMessage:(userId: string, newMessage: messageItem, user?:any) => Promise<void>
    deleteChat:(userId: string) => Promise<void>;
    activateUser:() => void;
}

const Messaging:React.FC<messagingProps> = ({chats, deleteChat, activateUser, socket, addRecievedMessage, markReadChat, currentChat}):JSX.Element => {
    const history = useHistory();
    const [newChatModal, setNewChatModal] = useState<any>(false);
    const [searchedUsers, setSearchedUsers] = useState<Array<any>>([]);
    const [searchUsers] = useLazySearchUserQuery();
    const [getUserInfo] = useGetUserByIdMutation();
    const adminChat = useMemo(() => chats.find(i => i.userId === 'admin'), [chats])

    const handleSearchBar = (ev:Event) => {
        let query:string = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if(target) query = target.value!;

        if(query.length > 0){
            searchUsers(query).then((users) => {
                let fetchedUsers = decryptRequest(users.data);
                setSearchedUsers(fetchedUsers);
            });
        }
    };

    const openNewChat = (userId:string) => {
        setNewChatModal(false);
        history.push(`/main/message/chat-page/${userId}`, {from:window.location.pathname});
    };

    useEffect(() => {
        socket.on('recieve-message', async(data:any) => {
            let {sender, messageData} = data;
            console.log('recieved message');
            console.log(sender, messageData);
            let userInfo:any = await getUserInfo(sender).unwrap().then((data) => {return data});
            userInfo = {
                name:userInfo.name,
                image:userInfo.profile_picture
            }
            await addRecievedMessage(sender, messageData, userInfo);

            //mark chat as read if user currently chatting with user
            // console.log('sender:', sender, 'current chat:', currentChat);
            // if(currentChat === sender){
            //     console.clear();
            //     console.log('currently chatting', currentChat);
            //     await markReadChat(sender);
            // }
            
        });
        
        socket.on('chats-read', async(data:any) => {
            let {chatId} = data;
            console.log('user read chat', chatId);
            await markReadChat(chatId);
        });
    }, [socket]);

    useIonViewWillLeave(() => setSearchedUsers([]));
    useIonViewWillEnter(() => activateUser())

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Messages
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonFab slot='fixed' vertical='bottom' horizontal='end'>
                    <IonFabButton onClick={() => setNewChatModal(true)}>
                        <FontAwesomeIcon icon={faMessage} />
                    </IonFabButton>
                </IonFab>
                
                <IonList lines='none'>
                    <MessageChat
                        userId={'admin'}
                        name={"ABIC Customer Care"}
                        image={companyLogo}
                        messages={adminChat!.messages}
                    />
                    {
                        chats?.filter((item:chatItem) => item.messages.length > 0).length <= 0 &&
                        <h6>No chats, click on the <FontAwesomeIcon icon={faMessage} /> button to start a new chat</h6>
                    }
                    {
                        chats?.filter((item:chatItem) => item.messages.length > 0).map(chat => {
                            if(chat.userId !== 'admin'){
                                return(
                                    <IonItemSliding key={chat.userId}>
                                        <MessageChat
                                            userId={chat.userId}
                                            name={chat.name}
                                            image={chat.image}
                                            messages={chat.messages}
                                        />
                                        <IonItemOptions>
                                            <IonItemOption color="danger" onClick={() => deleteChat(chat.userId)}>
                                                Delete
                                            </IonItemOption>
                                        </IonItemOptions>
                                    </IonItemSliding>
                                ) 
                            }
                            return ''
                        })
                    }
                </IonList>
            </IonContent>
            <IonModal isOpen={newChatModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot='start' fill='clear' onClick={() => setNewChatModal(false)}>
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </IonButton>
                        <IonSearchbar 
                            showCancelButton='focus'
                            debounce={500} 
                            animated={true} 
                            placeholder='Nuno mendes...' 
                            onIonChange={(ev) => handleSearchBar(ev)} 
                        />
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        {searchedUsers.length < 1 && <h6 style={{marginLeft:"10px"}} >Search for a person you wish to chat with</h6>}
                        {
                            searchedUsers.map((user:any) => 
                                <IonItem className='user__account_item' onClick={() => openNewChat(user.user_id)}>
                                    <img className='user__account-photo' src={user.profile_picture} alt="user's account"/>
                                    <IonText className='user__account-name'>
                                        {user.name}
                                    </IonText>
                                    <IonText color='primary' slot='end' className='user__account-occupation'>
                                        {user.role}
                                    </IonText>
                                </IonItem>
                            )
                        }
                    </IonList>
                </IonContent>
            </IonModal>
        </IonPage>
    );
}

export default Messaging;