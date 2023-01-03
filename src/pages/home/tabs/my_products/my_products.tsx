import React, { useState, useRef } from 'react';
import { IonContent,IonButton, IonItem, IonImg, IonList, IonFab, IonFabButton, IonModal } from "@ionic/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCameraAlt } from '@fortawesome/free-solid-svg-icons';

import tomatoes from '../../../../assets/images/tomatoes.png';

import './my_products.scss';

const MyProducts:React.FC = () => {
    const [productImage, setProductImage] = useState(null);

    const addProductModal = useRef<HTMLIonModalElement>(null);

    const dismissProductModal = () => {
        addProductModal.current?.dismiss();
    }

    return(
        <div className='home__my__products'>
            <h1>Here is the product pages</h1>
            <IonList>

            </IonList>
            <IonFab>
                <IonFabButton id='add-product-btn'>
                    <FontAwesomeIcon icon={faPlus} />
                </IonFabButton>
            </IonFab>

            <IonModal id='add-product-modal' ref={addProductModal} trigger='add-product-btn'>
                <div className="add__products__modal">
                    <div className='product-pic-container'>
                        {
                            productImage === ''?<FontAwesomeIcon className='picture-icon' icon={faCameraAlt}/>
                            :<IonImg src={tomatoes}/>

                        } 
                    </div>
                    <h5 className='add-image-text'>Add products picture</h5>
                    <form className='add__products__modal-form'>
                        <label>
                            Name
                            <input type='text' placeholder="enter the products name" />
                        </label>
                        <label>
                            Unit Price
                            <input type='text' placeholder="enter the price of a single unit" />
                        </label>
                        <label>
                            Description 
                            <textarea placeholder='enter a description of the product' />
                        </label>
                    </form>
                    <IonButton id='add-product-btn' shape="round">
                        Add product
                    </IonButton>
                    <IonButton shape='round' fill='outline' id='cancel-addition-btn' onClick={dismissProductModal}>
                        Cancel
                    </IonButton>
                </div>
            </IonModal>
        </div>
    );
}

export default MyProducts;