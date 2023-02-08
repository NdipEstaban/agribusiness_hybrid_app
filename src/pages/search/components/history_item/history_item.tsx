import React from 'react';
import { IonButton, IonItem, IonText } from '@ionic/react';

import './history_item.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCancel, faCross, faCrosshairs, faHistory, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

interface HistoryItemProps{
    text:string;
    deleteItem:(text:string) => void;
}

const HistoryItem:React.FC<HistoryItemProps> = ({text, deleteItem}):JSX.Element => {
    return(
        <IonItem>
            <FontAwesomeIcon icon={faHistory} />
            <IonText>
                {text}
            </IonText>
            <IonButton onClick={() => deleteItem(text)} slot="end" fill="clear">
                <FontAwesomeIcon icon={faTrashAlt} />
            </IonButton>
        </IonItem>
    );
}

export default HistoryItem;