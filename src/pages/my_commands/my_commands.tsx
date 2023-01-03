import React from 'react';
import {IonPage, IonHeader, IonTitle, IonToolbar,IonList, IonButton, IonContent} from '@ionic/react';
import RadioButton from '../../components/radio_button/radio_button';


import './my_commands.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSortAlphaDownAlt} from '@fortawesome/free-solid-svg-icons';

import CompletedItem from './components/completed_item/completed_item';
import PendingItem from './components/pending_item/pending_item';

import CompletedCommands from './tabs/completed_commands/completed_commands';
import PendingCommands from './tabs/pending_commands/pending_commands';
const MyCommands:React.FC = () => {

    const [currentTab, setCurrentTab] = React.useState('Pending');

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        My Commands
                    </IonTitle>
                    <IonButton slot='end' fill='clear'>
                        <FontAwesomeIcon icon={faSortAlphaDownAlt} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <RadioButton option1='Pending' option2='Completed' setHome={setCurrentTab} />
                {currentTab === 'Pending'?<PendingCommands />:<CompletedCommands />}
            </IonContent>
        </IonPage>
    );
}

export default MyCommands;