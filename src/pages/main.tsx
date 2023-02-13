import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonViewDidEnter,
} from '@ionic/react';
import { IonReactRouter, } from '@ionic/react-router';
import { cart, home, chatbox, person, search } from 'ionicons/icons';

import { showTabBar } from '../utils/iontabbar-controller';

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

const Main = () => {
    const {pendingOrders, deletePendingOrder, addPendingOrder, updatePendingOrdersProduct} = useStorage();

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
            <Messaging />
          </Route>
          <Route exact path="/main/message/chat-page">
            <ChatPage />
          </Route>

          <Route path="/main/cart">
            <MyCommands />
            {/* <Cart  deleteOrder={deletePendingOrder} updateOrder={updatePendingOrdersProduct} pendingOrders={pendingOrders}/> */}
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
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="messaging" href="/main/messaging">
            <IonIcon icon={chatbox} />
            <IonLabel>Chats</IonLabel>
          </IonTabButton>
          <IonTabButton tab="cart" href="/main/cart">
            <IonIcon icon={cart} />
            <IonLabel>Cart</IonLabel>
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