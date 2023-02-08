import React from 'react';
import { IonAvatar, IonContent, IonImg, IonItem, IonText, IonButton, IonAccordion } from '@ionic/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocation } from '@fortawesome/free-solid-svg-icons';

import img from '../../../../assets/images/abic_logo.png';

import './completed_item.scss';
import ProgressBar from '../progress_bar/progress_bar';

const CompletedItem:React.FC = () => {
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
                <ProgressBar />
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
                <div className='ongoing-item-footer'>
                    <h5>Incoming: 200,000</h5>
                    <h5>Delivery Charges: 90,000</h5>
                    <h5>Profit: 180, 000</h5>
                </div>
            </div>
        </IonAccordion>
    );
} 

export default CompletedItem;