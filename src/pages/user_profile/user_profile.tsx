import React, {useState} from 'react';
import {useIonViewWillEnter, useIonViewWillLeave,IonPage,IonContent, IonHeader, IonButton, IonToolbar, IonList, IonText, IonFab, IonFabButton} from '@ionic/react';
import {useHistory, useLocation, useParams} from 'react-router-dom';

import { hideTabBar,showTabBar } from '../../utils/iontabbar-controller';

import tomatoes from '../../assets/images/tomatoes.png';

import './user_profile.scss';

import ProductCard from '../home/components/product_card/product_card';
import AccountCard from '../../components/account_card/account_card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowLeft, faMessage, faTruck } from '@fortawesome/free-solid-svg-icons';
import { useGetUserByIdMutation} from '../../redux/api/user/userSlice';
import { useGetDeliveryOrdersQuery, useLazyGetConsumerOrdersQuery, useLazyGetDeliveryOrdersQuery, useLazyGetMerchantOrdersQuery } from '../../redux/api/order/orderSlice';
import { useAppSelector } from '../../hooks/redux_hooks';


const UserProfile:React.FC = () => {

    const userRole = useAppSelector((state:any) => state.user.role);
    const params:{id:string} = useParams();
    const [GetUserById, {data:user}] = useGetUserByIdMutation(); 
    const [products, setProducts] = useState<Array<any>>([]);
    // const [user, setUser] = useState<any>();

    const history = useHistory();
    
    const previousPage = () => {
        let previous:any = history.location.state;
        previous = previous.from;
        history.push(previous);
        
    }
    const cardAction = () => {};

    useIonViewWillEnter(() => {
        hideTabBar();
        GetUserById(params.id);
    });

    useIonViewWillLeave(() => {
        showTabBar();
    });

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar className='user__profile-toolbar'>
                    <IonButton fill='clear' slot='start' onClick={previousPage}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonFab slot="fixed" horizontal="end" vertical="bottom">
                    <IonFabButton>
                        <FontAwesomeIcon icon={faMessage} />
                    </IonFabButton>
                </IonFab>
                <div className='user-profile-page'>
                    <div className='profile-page-account-card'>
                        <AccountCard 
                        name={user?.name}
                        role={user?.role}
                        image={user?.profile_picture}
                        description={user?.description}
                        id={user?.user_id}
                        city={user?.city}
                        edit={false}
                    />
                    </div>
                    
                    <div className='orders-section'>
                        <h4>Activity</h4>
                        <div className='orders-section-number'>
                            <span>
                                <FontAwesomeIcon icon={faTruck} />
                            </span>
                            20 orders successfully completed
                        </div>
                        
                    </div>
                    <div className='user_products_list'>
                        <h4 className='user_profile-title'>Products offered</h4>
                        <IonList className='user__profile__specs-list'>
                            <ProductCard productId="card" name='banane' price='7000' description="Nice banana" image={tomatoes} merchantId="1" tab="featured" cardAction={() => {}} />
                            <ProductCard productId="card" name='banane' price='7000' description="Nice banana" image={tomatoes} merchantId="1" tab="featured" cardAction={() => {}} />

                        </IonList>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default UserProfile;