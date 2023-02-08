import React, { useRef } from 'react';
import { IonItem,IonText, IonImg, IonButton, IonAccordion, IonAvatar, IonModal, IonHeader, IonContent, IonToolbar, IonButtons, IonTitle, IonSearchbar} from '@ionic/react';

import './pending_item.scss';

import img from '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faXmark, faClock, faLocation} from '@fortawesome/free-solid-svg-icons';
 
const PendingItem:React.FC = () => {
    const deliveryServiceModal = useRef<HTMLIonModalElement>(null);

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
                </div>
            </div>
            <IonModal ref={deliveryServiceModal} trigger="open-delivery-modal" onWillDismiss={(ev) => deliveryServiceModal.current?.dismiss()}>
                <IonContent className="ion-padding">
                    <IonSearchbar />
                    <IonItem>
                        <IonText>Hello world</IonText>
                    </IonItem>
                </IonContent>
            </IonModal>
        </IonAccordion>
    );
}

export default PendingItem;