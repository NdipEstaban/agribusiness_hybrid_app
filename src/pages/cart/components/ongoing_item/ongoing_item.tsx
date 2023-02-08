import React from 'react';
import {useState} from 'react';
import {IonItem, IonImg, IonText, IonButton, IonAvatar, IonAccordion, IonAccordionGroup, IonList, IonTitle} from '@ionic/react';

import'./ongoing_item.scss';

import  img from  '../../../../assets/images/abic_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faAdd, faMinus, faBuilding, faTruck, faHome, faIndustry, faBuildingFlag, faShop, faBuildingNgo, faBuildingColumns, faShoppingBag} from '@fortawesome/free-solid-svg-icons';
import ProductCartItem from '../product_item/product_item';
import OrderProgress from '../order_progress/order_progress';

const OngoingCartItem:React.FC = () => {
    

    return(
        <IonAccordion value='first' className='pending-item'>
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={img} />
                </IonAvatar>
                <div>
                    <IonText>Ndip Estaban</IonText>
                    <IonText>26/01/2022</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
               <OrderProgress />
                <table>
                    <thead>
                        <th>Product</th>
                        <th>Quantity(Kg)</th>
                        <th>Price per Kg</th>
                        {/* <th>Total price</th> */}
                    </thead>
                    <tbody>
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
                    </tbody>
                    
                </table>
                <div className='accordion-footer'>
                    <h4>Total Paid:200000CFA</h4>
                    <IonButton shape='round'>
                        MARK AS RECIEVED
                    </IonButton>
                </div>
            </div>

        </IonAccordion>
    );
}

export default OngoingCartItem;