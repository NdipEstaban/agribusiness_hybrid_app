import React from 'react';
import {IonList} from '@ionic/react';

import './completed_commands.scss';
import CompletedItem from '../../components/completed_item/completed_item';

const CompletedCommands:React.FC = () => {
    return(
        <IonList lines='none'>
            <CompletedItem />
            <CompletedItem />
            <CompletedItem />            
        </IonList>
    );
}

export default CompletedCommands;