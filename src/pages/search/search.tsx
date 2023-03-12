import React, { useState } from 'react';
import {IonPage, IonSearchbar, IonContent, IonList, useIonLoading} from '@ionic/react';

import './search.scss';

import HistoryItem from './components/history_item/history_item';
import { useLazySearchUserQuery } from '../../redux/api/user/userSlice';
import { useLazySearchProductQuery } from '../../redux/api/product/productSlice';
import { search } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux_hooks';
import { addSearchHistory, updateSearchResult } from '../../redux/features/search/searchSlice';
import SearchResults from './tabs/results/results';
import SearchHistory from './tabs/history/history';
import { decryptRequest } from '../../utils/crypto_utility';
import { useStorage } from '../../hooks/useStorage';

const Search:React.FC = () => {
    const [searchLoader, dismissLoader] = useIonLoading();
    const {saveSearchHistory} = useStorage();
    const dispatch = useAppDispatch();
    const [searchUsers, {isFetching:usersLoading, isError:usersError}] = useLazySearchUserQuery();
    const [searchProducts, {isFetching:productsLoading, isError:productsError}] = useLazySearchProductQuery();
    const [currentView, setCurrentView] = useState<string>('history');

    const handleSearchBar = (ev:Event) => {
        let query:string = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if(target) query = target.value!;

        if(query.length > 0){
            searchProducts(query).then((prods) => {
                searchUsers(query).then((users:any) => {
                    let fetchedProducts = decryptRequest(prods.data);
                    let fetchedUsers = decryptRequest(users.data);
                    let searchResults = {
                        products:[...fetchedProducts],
                        users:[...fetchedUsers]
                    };
                    dispatch(updateSearchResult(searchResults));
                })
            });

            setCurrentView('results');
            saveSearchHistory(query);
            // dispatch(addSearchHistory(query));
        }
    }


    return(
        <IonPage>
            <IonContent>
                <IonSearchbar 
                    showCancelButton='focus'
                    debounce={500} 
                    animated={true} 
                    placeholder='Search' 
                    onIonChange={(ev) => handleSearchBar(ev)} 
                    onIonCancel = {() => setCurrentView('history')}
                />
                {(currentView === 'results')?
                    <SearchResults loader={productsLoading}/>
                    :
                    <SearchHistory/>
                }
            </IonContent>
        </IonPage>
    );
}

export default Search;