import React, {useRef} from 'react';
import {IonList, IonModal, useIonModal} from '@ionic/react';

import './pending_commands.scss';

import PendingItem from '../../components/pending_item/pending_item';

const PendingCommands:React.FC = () => {
    const modalRef = useRef<HTMLIonModalElement>(null);

    return(
        <IonList lines='none'>
            <PendingItem />
            <PendingItem />
            <PendingItem />
        </IonList>


    );
}
 
export default PendingCommands;