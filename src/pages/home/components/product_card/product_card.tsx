import React from 'react';
import { useRef } from 'react';
import { useIonActionSheet, IonContent,IonText, IonModal,IonCard, IonCardTitle, IonCardSubtitle, IonHeader, IonImg, IonItem, IonTitle, IonButton } from '@ionic/react';

import {IonRouterOutlet} from "@ionic/react";
import {Route, useHistory} from 'react-router-dom';

import {faTrash, faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import img from '../../../../assets/images/abic_logo.png';
import tomatoes from '../../../../assets/images/tomatoes.png';
import './product_card.scss';



interface ProductCardProps{
    name:string,
    price:string,
    cardIcon:string,

    cardAction?:(param:string) => void
}

interface ProductProps{
    name:string,
    price:string,
    action:(param:string) => void
}

const ProductCard:React.FC<ProductCardProps> = (props):JSX.Element => {

    const productModal = useRef<HTMLIonModalElement>(null);

    const [present] = useIonActionSheet();
    const history = useHistory();

    const closeModal = () => {
        productModal.current?.dismiss();
    }

    const goToAuthorProfile = () => {
        history.push("/main/search/account-details", {from:'/main/search'});
    }

    //In order to solve the modal problem, attribute each card a unique id along with the trigger of the modal

    return(
        <div className='card'>
            <IonImg id='card' src={img} /> 
            <div id='details'>
                <div id='name-price'>
                    <IonText id='name'>{props.name}</IonText>
                    <IonText id='price'>{props.price}/kg</IonText>
                </div>
                    {
                    /*Only the producer can delete products he added from his account*/
                    /*Only the merchant can add products to his cart*/
                    /*The livreur can't do anything to the products*/
                    }
                    {props.cardIcon === 'delete'?
                    <IonButton color='white' fill='clear' onClick={
                        () => {
                            present({
                                header:'Are you sure you want to delete this item?',
                                cssClass:'my-custom-class',
                                buttons:[
                                    {
                                        text: 'Yes',
                                        role: 'confirm'
                                    },
                                    {
                                        text:'No',
                                        role:'cancel'
                                    }
                                ],
                
                                onWillDismiss:(ev) => {}
                            });
                        }
                    }>
                        <FontAwesomeIcon icon={faTrash} />
                    </IonButton>
                    :(props.cardIcon === 'addCart'?
                    <IonButton color='white' fill='clear'>
                        <FontAwesomeIcon icon={faTrash} />
                    </IonButton>
                        :
                        ''
                    )
                    }

                <IonModal id="product-card-modal" ref={productModal} trigger='card'>
                    <div className="product__card-modal-body">
                        
                        <div className='modal__header'>
                            <div className='modal__header-images'>
                                <IonImg className='modal__header-author-img' src={img} onClick={goToAuthorProfile}/>
                                <IonImg className='modal__header-product-img' src={tomatoes} />
                            </div>
                            <div className='modal__header-props'>
                                <div className='modal__header-props-text'>
                                    <IonText className='modal__header-name'>Tomatoes</IonText>
                                    <IonText className='modal__header-price'>8000F/kg</IonText>
                                </div>
                                <IonButton color="primary" shape='round' className='modal__header-add-to-cart'>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                </IonButton>
                            </div>
                        </div>
                        <div className='modal__content'>
                            <IonText className='modal__content-description'>
                                lorem ipsum dolor res sure
                                lore id d j jdljldjklj kddd 
                                dddd ddjdkd dkjkdd dkdjd d kdk
                                dkjdkj dkdjd dkjdd djkdj dkdjd
                                d kjdkdj dkjdkjd djdjkj kdjdjd
                                djkdjdkjd kdjdjd kjdkjd dkjdkj
                                djkdkjd dkjdkjd kdjdkjd kjdkdj
                                jdkjdkjd djkdjd jdkjdd kjdkjd 
                            </IonText>
                            <IonButton fill='outline' shape='round' onClick={closeModal}>
                                Close
                            </IonButton>
                        </div>
                    </div>
                </IonModal>

            </div>
        </div>
    );
}

export default ProductCard;
