import React from 'react';
import {IonAccordion, IonAccordionGroup, IonList} from '@ionic/react';

import './completed_commands.scss';
import CompletedItem from '../../components/completed_item/completed_item';

const CompletedCommands:React.FC = () => {
    return(
        <IonList lines='none'>
            <IonAccordionGroup>
                <CompletedItem />
                <CompletedItem />
                <CompletedItem />     
            </IonAccordionGroup>       
        </IonList>
    );
}

export default CompletedCommands;