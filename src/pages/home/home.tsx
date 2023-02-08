import React from "react";
import { Redirect, Route, useRouteMatch, useHistory} from 'react-router-dom';
import { IonContent,IonText, IonBadge, IonRouterOutlet, IonTabs, IonTab, IonTabBar, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";


import { cart, home, chatbox, person, search } from 'ionicons/icons';


import RadioButton from "../../components/radio_button/radio_button";
import MyProducts from "./tabs/my_products/my_products";
import Featured from "./tabs/featured/featured";
import Notifications from "../notifications/notifications";


import "./home.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";

const Home:React.FC = () => {
    const user = useAppSelector(state => state.user);

    const [currentHome, setCurrentHome] = React.useState('Featured');
    const history = useHistory();

    const goToNofifications = () => {
        history.push('/main/home/notifications');
    }
    
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar> 
                    <IonTitle slot='start'>Home</IonTitle>
                    <IonButton routerDirection="forward" routerLink="/main/home/notifications" id='notif-btn' slot='primary' fill='clear' color='primary' onClick={goToNofifications}>
                        <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                        <IonBadge>1</IonBadge>
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="home__container">
                {
                    user.role === 'merchant' && 
                    <RadioButton option1="Featured" option2="My products" setHome={setCurrentHome}/>
                }
                {/* {
                currentHome === 'Featured'?
                <Featured cardAction={setCurrentHome}/>
                :
                <MyProducts />
                } */}
                {
                    <React.Fragment>
                            <Featured cardAction={setCurrentHome} style={currentHome === "Featured"?{}:{display:"none"}}/>
                            <MyProducts style={currentHome === "My products"?{}:{display:"none"}}/>
                    </React.Fragment>  
                }
            </IonContent>
        </IonPage>

    );
}

export default Home;