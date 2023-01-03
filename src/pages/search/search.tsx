import React from 'react';
import {IonPage, IonSearchbar, IonContent, IonList} from '@ionic/react';

import './search.scss';

import HistoryItem from './components/history_item/history_item';
import SearchResults from './tabs/results/results';

const Search:React.FC = () => {
    return(
        <IonPage>
            <IonContent>
                <IonSearchbar debounce={1000} animated={true} placeholder='Search' />
                <SearchResults/>
            </IonContent>
        </IonPage>
    );
}

export default Search;