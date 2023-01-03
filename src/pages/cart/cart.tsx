import React, { useRef } from 'react';
import {IonPage, IonRow, IonText, IonCol, IonGrid, IonHeader,IonContent, IonButton, IonTitle, IonItem, IonList, IonToolbar, IonFab, IonFabButton, IonModal} from '@ionic/react';

import CartItem from './components/cart-item/cart_item';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTasks, faMoneyBillWave, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

import './cart.scss';

const Cart:React.FC = () => {
    const receiptModal = useRef<HTMLIonModalElement>(null);

    const dismissReceiptModal = () => {
        receiptModal.current?.dismiss();
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Cart</IonTitle>
                    <IonButton slot='end' fill='clear'>
                        <FontAwesomeIcon icon={faTasks} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList lines='none'>
                    <CartItem />
                    <CartItem />
                    <CartItem />
                </IonList>
                <IonFab>
                    <IonFabButton id='purchase'>
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                    </IonFabButton>
                </IonFab>

                <IonModal className="receipt__modal" trigger="purchase" ref={receiptModal}>
                        <IonHeader>
                                <IonToolbar>
                                    <IonButton fill='clear' slot='start' onClick={dismissReceiptModal}>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </IonButton>
                                    <IonTitle className='receipt__modal-title'>
                                        Receipt
                                    </IonTitle>
                                </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <div className='reciept__modal-content'>
                                <div className='receipt__modal-header'>
                                    <IonText className='receipt__modal-parties'>
                                        <IonText className='receipt__modal-sender'>
                                            <span>From:</span> Jean Bosco
                                        </IonText>
                                        <IonText className='receipt__modal-reciever'>
                                            <span>To:</span> Rubben Larimya
                                        </IonText>
                                    </IonText>
                                    <IonText className='receipt__modal-date'>
                                        19/02/2022
                                    </IonText>
                                </div>
                                <div className='receipt__modal-table'>
                                    <table>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Unit price</th>
                                            <th>Total price</th>
                                        </tr>
                                        <tr>
                                            <td>Inyames</td>
                                            <td>08</td>
                                            <td>14,000</td>
                                            <td>122,0000</td>
                                        </tr>
                                        <tr>
                                            <td>Banana</td>
                                            <td>08</td>
                                            <td>12,000</td>
                                            <td>100,000</td>
                                        </tr>
                                        <tr>
                                            <td>Orange</td>
                                            <td>09</td>
                                            <td>1,000</td>
                                            <td>12,000</td>
                                        </tr>
                                        <tr>
                                            <td>Beans</td>
                                            <td>08</td>
                                            <td>13,000</td>
                                            <td>50,000</td>
                                        </tr>
                                    </table>
                                </div>
                                <IonText className='receipt__modal-total-amount'>
                                    Totale: 403,000CFA
                                </IonText>
                                <IonButton shape='round'>
                                    Checkout
                                </IonButton>
                                <IonButton fill='outline'shape='round'>
                                    Save
                                </IonButton>
                            </div>
                        </IonContent>
                </IonModal>

            </IonContent>
        </IonPage>
    );
}

export default Cart;