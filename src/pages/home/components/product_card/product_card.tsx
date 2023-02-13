import React, {useState, useEffect} from 'react';
import { useRef } from 'react';
import { useIonActionSheet, IonContent,IonText, IonModal,IonCard, IonCardTitle, IonCardSubtitle, IonHeader, IonImg, IonItem, IonTitle, IonButton, IonToolbar, IonButtons, useIonViewWillEnter, useIonViewDidEnter } from '@ionic/react';

import {IonRouterOutlet} from "@ionic/react";
import {Route, useHistory} from 'react-router-dom';

import {faTrash, faCartShopping, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import profileimg from '../../../../assets/images/delivery_man.jpg';
import tomatoes from '../../../../assets/images/tomatoes.png';
import './product_card.scss';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { useGetUserByIdMutation} from '../../../../redux/api/user/userSlice';
import { useStorage } from '../../../../hooks/useStorage';
import { useDeleteProductMutation } from '../../../../redux/api/product/productSlice';
import { useAppDispatch} from '../../../../hooks/redux_hooks';
import { updatePendingOrders } from '../../../../redux/features/cart/cartSlice';

interface ProductCardProps{
    name:string,
    price:string,
    description:string,
    merchantId:string,
    image:string,
    tab:string,
    productId:string,
    cardAction:(param:any) => void,
}


const ProductCard:React.FC<ProductCardProps> = ({price, name, description, merchantId, image, tab, productId, cardAction}):JSX.Element => {
    const userRole = useAppSelector((state:any) => state.user.role);
    const [deleteProduct] = useDeleteProductMutation();
    const [present] = useIonActionSheet();
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();
    const [getMerchant, {data:merchant}] = useGetUserByIdMutation();

    const closeModal = () => {
        setIsOpen(false);
    }

    const goToAuthorProfile = () => {
        closeModal();
        history.push(`/main/account-details/${merchantId}`, {from:window.location.pathname});
    }

    const handleDeleteProduct = () => {
        deleteProduct(productId);
    }

    const handleAddtoCart = async() => {
        getMerchant(merchantId).unwrap()
        .then((data) => {
            let order:{merchantId:string, merchantName:string, productId:string, productName:string, unitPrice:string, merchantPhoto:string} = {
                merchantId,
                merchantName:data?.name,
                productId,
                unitPrice:price,
                merchantPhoto:data?.profile_picture,
                productName:name
            }

            cardAction(order);
        });
    }

    return(
        <div className='product__card' onClick={() => getMerchant(merchantId)}>
            <img className='product__card-image' id={productId} src={image} alt="product" onClick={() => setIsOpen(true)}/> 
            <div className='details'>
                <div className='name-price'>
                    <p className='name'>{name}</p>
                    <p className='price'>{price}CFA/kg</p>
                </div>
                    {
                    /*Only the producer can delete products he added from his account*/
                    /*Only the merchant can add products to his cart*/
                    /*The livreur can't do anything to the products*/
                    }
                    {(userRole === 'merchant' && tab === 'myproduct')?
                    <button className='product__card-btn' onClick={
                        () => {
                            present({
                                header:'Are you sure you want to delete this item?',
                                cssClass:'my-custom-class',
                                buttons:[
                                    {
                                        text: 'Yes',
                                        role: 'confirm',
                                        handler:() => handleDeleteProduct()
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
                    </button>
                    :(userRole === "consumer"?
                    <button className='product__card-btn' onClick={() => handleAddtoCart()}>
                        <FontAwesomeIcon icon={faCartShopping}/>
                    </button>
                        :
                        ''
                    )
                    }

                <IonModal isOpen={isOpen}>
                    <IonHeader>
                        <IonToolbar>
                        <IonTitle>Details</IonTitle>
                        <IonButtons slot="start">
                            <IonButton onClick={() => closeModal()} className='back-button'>
                                <FontAwesomeIcon icon={faArrowLeftLong}/>
                            </IonButton>
                        </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div className="product__card-details">
                            <img className='product-image' alt='product' src={image} />
                            <section className='product__card-body'>
                                <div className='merchant-details'>
                                    <h3>Provided by</h3>
                                    <section>
                                        <img src={merchant?.profile_picture} className='merchant-image' alt='merchant' />
                                        <p className='merchant-name' onClick={() => goToAuthorProfile()}>{merchant?.name}</p>
                                    </section> 
                                </div>
                                <div className='product-description'>
                                    <h3>Description</h3>
                                    <p className='product-description'>
                                       {description}
                                    </p>
                                </div>
                                <div className='product-details'>
                                    <span>
                                        <p className='product-name'>{name}</p>
                                        <p className='product-price'>{price}CFA/Kg</p>
                                    </span>
                                    {
                                        userRole === 'consumer' &&
                                        <button className='cart-btn'>
                                            Add to Cart
                                        </button>
                                    }
                                    
                                </div>
                            </section>
                        </div> 
                    </IonContent>
                </IonModal>

            </div>
        </div>
    );
}

export default ProductCard;
