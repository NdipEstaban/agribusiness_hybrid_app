import React from 'react';

import { IonImg, IonText, IonItem, IonList } from '@ionic/react';
import "./history.scss";

import HistoryItem from '../../components/history_item/history_item';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { useStorage } from '../../../../hooks/useStorage';

const SearchHistory:React.FC = ():JSX.Element => {
    const {searchHistory:history, deleteSearchHIstory} = useStorage();

    
    const deleteHistoryItem = (item:string) => {
        deleteSearchHIstory(item);
        console.log("item deleted");
    }

    return(
        <IonList className='history-list'>
            {history.map((item:any) => <HistoryItem text={item} deleteItem={deleteHistoryItem}/>)}
        </IonList>
    );
}

export default SearchHistory;