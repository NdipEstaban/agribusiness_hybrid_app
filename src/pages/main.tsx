import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonLoading,
  useIonViewDidEnter,
} from '@ionic/react';
import { IonReactRouter, } from '@ionic/react-router';
import { cart, home, chatbox, person, search, list, tabletPortraitSharp, shapesOutline, storefront, storefrontOutline, storefrontSharp, cartSharp, chatboxSharp, searchSharp } from 'ionicons/icons';

import { showTabBar } from '../utils/iontabbar-controller';
import * as io from "socket.io-client";

import Home from './home/home';
import Search from './search/search';
import Messaging from './messaging/messaging';
import Cart from './cart/cart';
import Account from './account/account';
import Notifications from './notifications/notifications';
import ChatPage from './chat_page/chat_page';
import UserProfile from './user_profile/user_profile';
import MyCommands from './my_commands/my_commands';

import './main.scss';
import { useStorage } from '../hooks/useStorage';
import { useAppDispatch, useAppSelector } from '../hooks/redux_hooks';
import { useChatsStorage, messageItem } from '../hooks/useChatStorage';
import { updateUser } from '../redux/features/user/userSlice';

const socket = io.connect('http://localhost:7000');

const Main = () => {
    const dispatch = useAppDispatch();
    //used to set the current user being chatted with
    const [currentChat, setCurrentChat] = useState<string | null>(null);
    const [presentLoader, dismissLoader] = useIonLoading();
    const [socketId, setSocketId] = useState<string>('')
    const {pendingOrders, deletePendingOrder, addPendingOrder, updatePendingOrdersProduct} = useStorage();
    const {userDetails} = useStorage();
    const {chats, setChatToRead, createChat, deleteChat, addMessage, deleteMessage, initStorage, markMessageAsSent, getUnsentMessages} = useChatsStorage();
    const user = useAppSelector(state => state.user);

    const getChatData = (userId:string) => {
      return chats.find(chat => chat.userId === userId);
    }

    const setCurrentUserChat = async(userId:string | null) => {
      console.log('setting current chat', userId);
      await setCurrentChat(userId);
    }

    useEffect(() => console.log(currentChat), [currentChat])

    const sendMessage = async(userId:string, messageData:messageItem) => {
      await addMessage(userId, messageData);
      socket.emit('send-message', {sender:user.userId, messageData, reciever:userId}, async(info:any) => {
        console.clear();
        console.log('sending message', info);
        console.log(info);
        if(info?.success === true){
          console.log('marking as read');
          await markMessageAsSent(userId, messageData.id);
        }
      });
    }

    const activateMessaging = async() => {
      await initStorage();
      if(user.userId !== '' && (user !== undefined && user !== null)){
        setSocketId(socket.id);
        socket.emit('activate-user', user.userId, async(info:any) => {
          //go through list of unsentMessages and send them
          if(info?.success === true){
            let unsentMessages = await getUnsentMessages();
            console.log(unsentMessages);
            unsentMessages.forEach((item:any) => {
              socket.emit('send-message', {sender:user.userId, messageData:item.messageData, reciever:item.userId}, async(info:any) => {
                console.clear();
                console.log('sending message', info);
                console.log(info);
                if(info?.success === true){
                  console.log('marking as read');
                  await markMessageAsSent(item.userId, item.messageData.id);
                }
              });
            });
          }
        });
        console.log('connection, userId:', user.userId);
      }
    }

    useEffect(() => {
      socket.on('disconnect', () => {
        setSocketId('disconnected');
      });
      socket.on('connect', async() => {
        console.log('socket.io connected');
      });
    },[]);

    useEffect(() => {
      if(userDetails !== undefined && userDetails !== null && user.userId !== userDetails.userId){
        dispatch(updateUser(userDetails));
      }
    });

    return (
        <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path='/main' to='/main/home' />
          {/*Defining the home tab route and nested routes */}

          <Route exact path="/main/home">
            <Home addOrder={addPendingOrder}/>
          </Route>
          <Route exact path="/main/home/notifications">
            <Notifications />
          </Route>

          <Route exact path="/main/search">
            <Search />
          </Route>
          <Route exact path="/main/account-details/:id">
            <UserProfile/>
          </Route>
 
          {/*Defining the messaging tab route and nested routes*/}
          <Route exact path="/main/messaging">
            <Messaging chats={chats} deleteChat={deleteChat} activateUser={activateMessaging} socket={socket} addRecievedMessage={addMessage} markReadChat={setChatToRead} currentChat={currentChat} />
          </Route>
          <Route exact path="/main/message/chat-page/:id">
            <ChatPage getChatData={getChatData} createChat={createChat} addMessage={sendMessage} deleteMessage={deleteMessage} deleteChat={deleteChat} socket={socket} setCurrentChat={setCurrentUserChat} markReadChat={setChatToRead} addRecievedMessage={addMessage}/>
          </Route>

          <Route path="/main/orders">
            {
              user.role === 'consumer'?
              <Cart  deleteOrder={deletePendingOrder} updateOrder={updatePendingOrdersProduct} pendingOrders={pendingOrders}/>
              :
              <MyCommands />
            }
          </Route>
          <Route exact path="/main/account/">
            <Account/>
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" id='app-tab-bar'>
          <IonTabButton tab="home" href="/main/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/main/search">
            <IonIcon icon={searchSharp} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="messaging" href="/main/messaging">
            <IonIcon icon={chatboxSharp} />
            <IonLabel>Chats</IonLabel>
          </IonTabButton>
          <IonTabButton tab="orders" href="/main/orders"> 
            {
              user.role === 'consumer'?
              <React.Fragment>
                <IonIcon icon={cartSharp} />
                <IonLabel>Cart</IonLabel>
              </React.Fragment>
              :
              <React.Fragment>
                <IonIcon icon={storefrontSharp} />
                <IonLabel>Orders</IonLabel>
              </React.Fragment>
            }
            
          </IonTabButton>
          <IonTabButton tab="account" href="/main/account">
            <IonIcon icon={person}/>
            <IonLabel>My account</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
    );
}

export default Main;