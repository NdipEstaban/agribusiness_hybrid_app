import React, {useRef} from 'react';
import {IonAccordionGroup, IonList, IonModal, useIonModal} from '@ionic/react';

import './pending_commands.scss';

import PendingItem from '../../components/pending_item/pending_item';

const PendingCommands:React.FC = () => {
    const modalRef = useRef<HTMLIonModalElement>(null);

    return(
        <IonList lines='none'>
            <IonAccordionGroup>
                <PendingItem />
                <PendingItem />
                <PendingItem />
            </IonAccordionGroup>
        </IonList>


    );
}
 
export default PendingCommands;