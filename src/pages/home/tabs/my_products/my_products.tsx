import React, { useState, useRef, useEffect } from 'react';
import {UUID} from 'uuid-generator-ts';
import { IonContent,IonButton, IonItem, IonImg, IonList, IonFab, IonFabButton, IonModal, IonSelect, IonSelectOption, useIonAlert, useIonLoading } from "@ionic/react";
import { Camera, CameraResultType } from '@capacitor/camera';
import ProductCard from '../../components/product_card/product_card';
import productNames from '../../../../assets/constants/products';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCameraAlt } from '@fortawesome/free-solid-svg-icons';

import tomatoes from '../../../../assets/images/tomatoes.png';

import './my_products.scss';
import { useCreateNewProductMutation, useGetMerchantProductsQuery } from '../../../../redux/api/product/productSlice';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import ImageCropper from '../../../../components/imageCropper/imageCropper';

interface productProps{
    style:any;
}

const MyProducts:React.FC<productProps> = (props):JSX.Element => {
    const [createNewProduct, {isLoading:creatingProduct, isError:productNotCreated, isSuccess:productCreated}] = useCreateNewProductMutation();
    const [presentAlert] = useIonAlert();
    const [presentLoader, dismissLoader] = useIonLoading();

    const imageCropperRef = useRef<HTMLDivElement>(null);

    const merchantId = useAppSelector((state:any) => state.user.userId);
    const [productName, setProductName] = useState<string | undefined>(undefined);
    const [productPrice, setProductPrice] = useState<string | undefined>(undefined);
    const [productDescription, setProductDescription] = useState<string | undefined>(undefined);
    const [productPhoto, setProductPhoto] = useState<string | undefined>(undefined);

    const {data:products, isSuccess:productsFetched} = useGetMerchantProductsQuery(merchantId);

    const handlePhoto = async() => {
        const image = await Camera.getPhoto({
            height:120,
            width:176,
            quality: 80,
            allowEditing: true,
            resultType: CameraResultType.DataUrl,
            promptLabelHeader:"Square images are preffered"
        });
        setProductPhoto(image.dataUrl);
        imageCropperRef.current!.style.display = 'flex';
    }

    const handleCroppedImage = (image:string) => {
        imageCropperRef.current!.style.display = 'none';
        setProductPhoto(image);
    }

    const addProductModal = useRef<HTMLIonModalElement>(null);

    const dismissProductModal = () => {
        addProductModal.current?.dismiss();
        //remove productPhoto
        setProductPhoto(undefined);
    }

    const handleAddProduct = async() => {
        const uuid = new UUID();
        let id = uuid.getDashFreeUUID();
        console.log(id);

        let product = {
            id,
            name:productName,
            description:productDescription,
            image:productPhoto,
            price:productPrice,
            merchant_id:merchantId
        }

        if(product.name === undefined){
            presentAlert({
                subHeader: 'No product selected',
                message: "please select a product",
            });
        }else if(product.description === undefined){
            presentAlert({
                subHeader:"Product does not have a description",
                message: "please enter a description of your product"
            })
        }else if(product.description.length < 20){
            presentAlert({
                subHeader:"Product description is short",
                message:"Please enter a product description of atleast 20 characters"
            })
        }else if(product.price === undefined || Number(product.price) <= 0){
            presentAlert({
                subHeader:"product does not have a price",
                message:"please enter the product's unit price"
            })
        }else if(product.image === undefined){
            presentAlert({
                subHeader:"product does not have an image", 
                message:"please enter an image"
            });
        }else{
            await createNewProduct(product);
            if(productNotCreated === true){
                presentAlert({
                    subHeader:"Product could not be uploaded",
                    message:"Please check your internet connection then retry",
                });
            }else if(productNotCreated === false && productCreated === true){
                dismissProductModal();
                //display the toast
            }else{/*intentionally left empty*/}
        }
    }
    
    if(creatingProduct === true){
        presentLoader({
            message:"Uploading new product",
            spinner:"bubbles"
        });
    }else{
        dismissLoader();
    }


    return(
        <IonContent className='home__my__products' style={props.style}>
            <IonList>
            <IonList className='myproducts-list'>
                 {
                    (products !== undefined || products?.length > 0)?
                    products.map((prod: any) => 
                    <ProductCard 
                        key={"myproduct" + prod.product_id}
                        productId={prod.product_id}
                        name={prod.name} 
                        price={prod.unit_price} 
                        description={prod.description}
                        image={prod.image}
                        merchantId={prod.merchant_id} 
                        tab="myproduct" 
                        cardAction={() => {}} 
                    />)
                    :(productsFetched === false)?
                    <h3>Oops, no internet connection products could not be fetched</h3>
                    :
                    <h3>No products, you can add new ones with the + button</h3>
                }
            </IonList>
            </IonList>
            <IonFab>
                <IonFabButton id='add-product-btn'>
                    <FontAwesomeIcon icon={faPlus} />
                </IonFabButton>
            </IonFab>

            <IonModal id='add-product-modal' ref={addProductModal} trigger='add-product-btn'>
                <div className="add__products__modal">
                    <div className='product-pic-wrapper'>
                        <div className='product-pic-container'>
                            {
                                (productPhoto === '' || productPhoto === null || productPhoto === undefined)?
                                <FontAwesomeIcon className='picture-icon' icon={faCameraAlt}/>
                                    :
                                <img src={productPhoto} alt="product"/>

                            } 
                        </div>
                        <h5 className='add-image-text' onClick={() => handlePhoto()}>Add products picture</h5>
                    </div>
                    <div className='image-cropper-product-util' ref={imageCropperRef}>
                        <ImageCropper aspect={1} submitImage={handleCroppedImage} image={productPhoto} />
                    </div>
                    <form className='add__products__modal-form'>
                        <label>
                            Product*
                            <IonSelect className='selection' interface="popover" placeholder="Orange" onIonChange={(e) => setProductName(e.detail.value)}>
                                {productNames.map((i:string) => <IonSelectOption key={i} value={i}>{i}</IonSelectOption>)}
                            </IonSelect>
                        </label>
                        <label className='unit-price-label'>
                            Unit price*
                            <div>
                                <input type="number" max="20000" placeholder="3000" onChange={(e) => setProductPrice(e.target.value)}/>
                                <p>CFA/Kg</p>
                            </div>
                        </label>
                        <label>
                            Description*
                            <textarea placeholder='Sweet fruits grown naturally...' onChange={(e) => setProductDescription(e.target.value)}/>
                        </label>
                        <IonButton id='add-product-btn' shape="round" onClick={() => handleAddProduct()}>
                            Add product
                        </IonButton>
                        <IonButton shape='round' fill='outline' id='cancel-addition-btn' onClick={dismissProductModal}>
                            Cancel
                        </IonButton>
                    </form>
                    
                </div>
            </IonModal>
        </IonContent>
    );
}

export default MyProducts;