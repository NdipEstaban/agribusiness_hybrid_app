import React from "react";
import { useState, useEffect } from "react";
import {IonButton, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow} from '@ionic/react';
import './add_product.scss';
import '@fortawesome/react-fontawesome';
import {faCameraAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddProd:React.FC = () =>{
    const [productImage, setProductImage] = useState('');

    return(
        <IonPage>
            <IonContent>
                
            </IonContent>
        </IonPage>
    );
}

export default AddProd;