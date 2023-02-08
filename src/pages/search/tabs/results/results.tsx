import React, { Fragment, useState } from 'react';

import { IonImg, IonText, IonItem, IonList, IonContent, useIonLoading} from '@ionic/react';
import RadioButton from '../../../../components/radio_button/radio_button';

import ProductCard from '../../../home/components/product_card/product_card';
import UserAccountItem from '../../components/user_account_item/user_account_item';

import tomatoes from '../../../../assets/images/tomatoes.png';

import './results.scss';

import { useAppSelector } from '../../../../hooks/redux_hooks';

interface searchResultsProps{
    loader:Boolean
}
const SearchResults:React.FC<searchResultsProps> = (props):JSX.Element => {
    const [currentTab, setCurrentTab] = useState('Products');
    const usersSearchResult = useAppSelector(state => state.search.searchResults.users);
    const productsSearchResult = useAppSelector(state => state.search.searchResults.products);

    return(
        <div className='search__results'>
            <div className='search__results-radio'>
                <RadioButton option1='Products' option2='Users' setHome={setCurrentTab}/>
            </div>
            
            <IonList lines='none' className='results__list' style={currentTab !== "Users"?{display:"none"}:{}}>
                {
                    usersSearchResult.length > 0?
                        usersSearchResult.map((user:any) => 
                            <UserAccountItem
                                key={user.user_id}
                                image={user.profile_picture}
                                name={user.name}
                                userId={user.user_id}
                                role={user.role}
                            />
                        )
                    :
                    <h5 className='search-message'>No users found from your search</h5>
                }
            </IonList>
            
            <IonList lines='none' className='results__list' style={currentTab !== "Products"?{display:"none"}:{}}>
                    {
                        productsSearchResult.length > 0?

                            productsSearchResult.map((prod:any) =>
                                <ProductCard 
                                    key={"search" + prod.product_id}
                                    productId={prod.product_id}
                                    name={prod.name}
                                    price={prod.unit_price} 
                                    description={prod.description} 
                                    image={prod.image} 
                                    merchantId={prod.merchant_id} 
                                    tab="search" 
                                    cardAction={() => {}} 
                                />
                            )
                        :
                        <h5 className='search-message'>No products found from your search</h5>
                    }
            </IonList>
            
        </div>
    );
}

export default SearchResults;