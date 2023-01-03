import React from 'react';

import { IonImg, IonText, IonItem, IonList } from '@ionic/react';

import HistoryItem from '../../components/history_item/history_item';

const SearchHistory:React.FC = () => {
    return(
        <IonList>
            <HistoryItem />
        </IonList>
    );
}

export default SearchHistory;