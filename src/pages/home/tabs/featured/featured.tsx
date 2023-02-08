import React, {useEffect, useState} from 'react';
import { IonContent, IonGrid, IonInfiniteScroll, IonItemGroup, IonList, IonInfiniteScrollContent, useIonViewDidEnter } from "@ionic/react";
import './featured.scss';

import tomatoes from '../../../../assets/images/tomatoes.png';

import ProductCard from '../../components/product_card/product_card';
import NewsCard from '../../components/news_card/news_card';
import { Interface } from 'readline';
import { useGetAnnouncementsMutation,} from '../../../../redux/api/announcement/announceSlice';
import { useGetConsumerProductsMutation, useGetProductsMutation} from '../../../../redux/api/product/productSlice';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { useStorage } from '../../../../hooks/useStorage';

interface featuredProps{
    style:any;
    cardAction:(param:string) => void
}

/*mix the announcements and products so announcements appear after
every 10 products */
const mixFeaturedItems = (announce:any[], products:any[]) => {
    let mixedItems:any[] = [];
    let nextAnnounceIndex = 0;
    products.map((item, index) => {
        mixedItems.push(item);
        if(index !== 0 && index % 1 === 0 && nextAnnounceIndex < announce.length){// default should be modulo 4 to display news after each fetching
            console.log(nextAnnounceIndex);
            console.log(announce[nextAnnounceIndex]);
            mixedItems.push(announce[nextAnnounceIndex]);
            nextAnnounceIndex ++;
        }
        return products;
    });
    return mixedItems;
}

const Featured:React.FC<featuredProps> = (props):JSX.Element => {
    const [currentPage, setcurrentPage] = useState<number>(1);
    const userRole:any = useAppSelector(state => state.user.role);
    const {featuredProducts, saveFeaturedProducts} = useStorage();

    const [getAnnouncements, announcements] = useGetAnnouncementsMutation();
    const [getConsumerProducts, {data:consumerProducts}] = useGetConsumerProductsMutation();
    const [getProducts, productResult] = useGetProductsMutation();

    const [featured, setFeatured] = useState<Array<any>>([]);

    const fetchNewItems = async() => {
        let getProductItems = userRole === 'consumer'?getConsumerProducts:getProducts;
        let fetchedAnnouncements:any;
        let fetchedProducts:any;
        
        fetchedProducts = await getProductItems(currentPage);
        fetchedAnnouncements = await getAnnouncements(currentPage);

        let nextFeatured = mixFeaturedItems(fetchedAnnouncements.data, fetchedProducts.data);

        setFeatured(current => current.concat(nextFeatured));
        setcurrentPage(state => state+1);

        if(featuredProducts.products.length !== featured.length){
            saveFeaturedProducts(featured, currentPage);
        }
        
    }

    useEffect(() => {
        setFeatured(featuredProducts.products);
        setcurrentPage(featuredProducts.page);
        fetchNewItems();
    }, []);


    useEffect(() => {
        console.log("useEffect", featuredProducts);
        fetchNewItems();//TODO:fIX useEffect so it fetches at each render
    }, []);
    
    return(
            <IonContent className='featured' style={props.style}>
                {
                    featured.length > 0?
                        <IonList className='featured-list'>
                            {
                                featured.map((item:any, index) =>{
                                    if("product_id" in item){
                                        return (
                                            <ProductCard 
                                                productId={item.product_id}
                                                key={"featured" + item.product_id}
                                                name={item.name} 
                                                price={item.unit_price} 
                                                description={item.description} 
                                                image={item.image} 
                                                merchantId={item.merchant_id}
                                                tab="featured" 
                                                cardAction={() => {}} 
                                            />
                                        )
                                    }else{
                                        return (<NewsCard key={item.announcement_id}/>)
                                    }
                                })
                            }                
                    </IonList>
                    :
                    <h3>Oops, no internet connection</h3>
                }
                
                <IonInfiniteScroll
                    onIonInfinite={(ev) => {
                        fetchNewItems();
                        setTimeout(() => ev.target.complete(), 500);
                    }}
                >
                    <IonInfiniteScrollContent loadingSpinner={"dots"}></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        );
}

export default Featured;