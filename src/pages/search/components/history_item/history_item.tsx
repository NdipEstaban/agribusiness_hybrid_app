import React from 'react';
import { IonItem, IonText } from '@ionic/react';

import './history_item.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHistory} from '@fortawesome/free-solid-svg-icons';

const HistoryItem = () => {
    return(
        <IonItem>
            <FontAwesomeIcon icon={faHistory} />
            <IonText>
                Banane
            </IonText>
        </IonItem>
    );
}

export default HistoryItem;