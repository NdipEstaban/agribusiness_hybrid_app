import React, { useRef } from 'react';
import { IonItem,IonText, IonImg, IonButton, IonAccordion, IonAvatar, IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonTitle, IonSearchbar, IonList} from '@ionic/react';

import './pending_item.scss';

import img from '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faXmark, faClock, faLocation, faArrowLeftLong, faMessage} from '@fortawesome/free-solid-svg-icons';
import { useLazyGetDeliveryOrdersQuery } from '../../../../redux/api/order/orderSlice';
import { useLazyGetDeliveryServicesQuery } from '../../../../redux/api/user/userSlice';
 
const PendingItem:React.FC = () => {
    const deliveryServiceModal = useRef<HTMLIonModalElement>(null);

    const [getDelivery, {data:delivery}] = useLazyGetDeliveryServicesQuery();

    const handleSearchBar = async(ev:Event) => {
        let query:string = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if(target) query = target.value!;

        await getDelivery(query).unwrap().then((data) => console.log(data));

    }

    return(
        <IonAccordion value='pending' className='pending-item'>
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={img} />
                </IonAvatar>
                <div>
                    <IonText>Ndip Estaban</IonText>
                    <IonText>200,000CFA</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
                <div className='pending-location'>
                    <h5>
                        <FontAwesomeIcon icon={faLocation} />
                        Location
                    </h5>
                    <IonText>
                        Douala,Cite de palmier-carrefour express
                    </IonText>
                </div>
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Quantity(Kg)</th>
                        <th>Price per Kg</th>
                        {/* <th>Total price</th> */}
                    </tr>
                    <tr>
                        <td>Inyames</td>
                        <td>08</td>
                        <td>14,000</td>
                        {/* <td>122,0000</td> */}
                    </tr>
                    <tr>
                        <td>Banana</td>
                        <td>08</td>
                        <td>12,000</td>
                        {/* <td>100,000</td> */}
                    </tr>
                    <tr>
                        <td>Orange</td>
                        <td>09</td>
                        <td>1,000</td>
                        {/* <td>12,000</td> */}
                    </tr>
                    <tr>
                        <td>Beans</td>
                        <td>08</td>
                        <td>13,000</td>
                        {/* <td>50,000</td> */}
                    </tr>
                </table>
                <div className='accordion-footer'>
                    <h4>Total Forwarded: 200,000CFA</h4>
                    <IonButton shape='round' id='open-delivery-modal'>
                        SELECT A DELIVERY SERVICE
                    </IonButton>
                    <div className='btns'>
                        <IonButton shape='round' fill='outline' className='decline-btn'>
                            DECLINE
                        </IonButton>
                        <IonButton shape='round' fill="clear" color={"primary"} className='chat-btn'>
                            <FontAwesomeIcon icon={faMessage} />
                        </IonButton>
                    </div>
                    
                </div>
            </div>

            {/*Search for a delivery service and choose */}
            <IonModal ref={deliveryServiceModal} trigger="open-delivery-modal" onWillDismiss={(ev) => deliveryServiceModal.current?.dismiss()}>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot="start" fill="clear" onClick={() => deliveryServiceModal.current?.dismiss()}>
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                        </IonButton>
                        <IonSearchbar
                            slot="start"
                            debounce={500} 
                            animated={true} 
                            placeholder='Search' 
                            onIonChange={(ev) => handleSearchBar(ev)}
                        />
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    
                    <IonList>
                        {delivery?.map((item:any) => 
                            <IonItem>
                                <IonAvatar>
                                    <img src={item.profile_picture} alt='delivery service' />
                                </IonAvatar>
                                <IonText className='delivery-modal-item-name'>
                                    {item.name}
                                </IonText>
                            </IonItem>
                        )}
                    </IonList>
                    
                </IonContent>
            </IonModal>
        </IonAccordion>
    );
}

export default PendingItem;