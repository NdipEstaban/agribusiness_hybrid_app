import React from "react";
import {IonButton, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonCol, IonText} from '@ionic/react';
import './receipt.scss';


const Receipt:React.FC = () => {
    return(
        <IonPage>
            <IonContent>
                <div className='receipt-card'>
                    <header>
                        <h2>Receipt</h2>
                    </header>
                    <div className="receipt-body">
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonRow>
                                        From: James
                                    </IonRow>
                                    <IonRow>
                                        To: Jonah
                                    </IonRow>
                                </IonCol>
                                <IonCol>
                                    <IonRow>
                                        22/33/44
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonGrid className='receipt-table'>
                            <IonRow className='table-heading'>
                                <IonCol>Name</IonCol>
                                <IonCol>Qty</IonCol>
                                <IonCol>Unit price</IonCol>
                                <IonCol>Total</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>John</IonCol>
                                <IonCol>07</IonCol>
                                <IonCol>3000</IonCol>
                                <IonCol>300000</IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonText className="total-amount">
                            <span>Total:</span>
                            <span>300000</span>
                        </IonText>
                    </div>
                    <footer>
                        <button>Pay</button>
                    </footer>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Receipt;