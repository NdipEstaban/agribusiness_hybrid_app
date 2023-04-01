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
interface myCommandsProps{
    socket:any;
}

const MyCommands:React.FC<myCommandsProps> = ({socket}) => {

    const [currentTab, setCurrentTab] = React.useState('Pending');

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        My Orders
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className='my-commands'>
                    <div className='commands-radio-btn'>
                        <RadioButton option1='Pending' option2='Ongoing' setHome={setCurrentTab} />
                    </div>
                    <PendingCommands socket={socket} style={(currentTab !== "Pending")?{display:"none"}:{}} />
                    <CompletedCommands socket={socket} style={(currentTab !== "Ongoing")?{display:"none"}:{}} />
                    {/* {currentTab === 'Pending'?<PendingCommands />:<CompletedCommands />} */}
                </div>
            </IonContent>
        </IonPage>
    );
}

export default MyCommands;