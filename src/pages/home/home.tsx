import React from "react";
import { Redirect, Route, useRouteMatch, useHistory} from 'react-router-dom';
import { IonContent,IonText, IonBadge, IonRouterOutlet, IonTabs, IonTab, IonTabBar, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";


import RadioButton from "../../components/radio_button/radio_button";
import MyProducts from "./tabs/my_products/my_products";
import Featured from "./tabs/featured/featured";
import Notifications from "../notifications/notifications";


import "./home.scss";

const Home:React.FC = () => {

    const [currentHome, setCurrentHome] = React.useState('Featured');
    const match = useRouteMatch();
    const history = useHistory();

    const goToNofifications = () => {
        history.push('/main/home/notifications');
    }
    
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot='start'>AL-RAYYAN</IonTitle>
                    <IonButton routerDirection="forward" routerLink="/main/home/notifications" id='notif-btn' slot='primary' fill='clear' color='warning' onClick={goToNofifications}>
                        <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                        <IonBadge color="warning">9</IonBadge>
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="home__container">
                <RadioButton option1="Featured" option2="My products" setHome={setCurrentHome}/>
                {
                currentHome === 'Featured'?
                <Featured cardAction={setCurrentHome}/>
                :
                <MyProducts />
                }
            </IonContent>
        </IonPage>

    );
}

export default Home;