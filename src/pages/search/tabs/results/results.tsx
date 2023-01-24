import React, { Fragment, useState } from 'react';

import { IonImg, IonText, IonItem, IonList, IonContent} from '@ionic/react';
import RadioButton from '../../../../components/radio_button/radio_button';

import ProductCard from '../../../home/components/product_card/product_card';
import UserAccountItem from '../../components/user_account_item/user_account_item';

import tomatoes from '../../../../assets/images/tomatoes.png';

import './results.scss';

const SearchResults:React.FC = () => {

    const [currentTab, setCurrentTab] = useState('Products');

    return(
        <div className='search__results'>
            <div className='search__results-radio'>
                <RadioButton option1='Products' option2='Users' setHome={setCurrentTab}/>
            </div>
            
            {(currentTab === 'Users'?
            <IonList lines='none' className='results__list'>
                <UserAccountItem />
                <UserAccountItem />
            </IonList>
            :
            <IonList lines='none' className='results__list'>
                    <ProductCard name='banane' price='7000' description="Nice banana" image={tomatoes} merchantId="1" tab="featured" cardAction={() => {}} />
            </IonList>
            )}
        </div>
    );
}

export default SearchResults;