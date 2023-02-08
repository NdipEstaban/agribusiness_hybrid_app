import { useEffect, useState } from "react"
import {Drivers, Storage} from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { add } from "ionicons/icons";


const PENDING_ORDERS_KEY = "pending-orders";
const USER_DETAILS_KEY = "user-details";
const FEATURED_PRODUCTS_KEY = "featured-products";
const SEARCH_HISTORY_KEY = "search-history";

export interface User{
    userId:string,
    name:string,
    city:string,
    email:string,
    quater:string,
    profilePicture:string | undefined,
    role:string,
    userPref:string | string[],
    description:string | null,
    apiKey:string,
    authed:boolean
}

export interface pendingOrderItem{
    merchantId:string;
    merchantName:string;
    merchantPhoto:string;
    date:string;
    products:{productId:string, name:string, unitPrice:string, quantity:string}[];
}

export const useStorage = () => {
    const [store, setStore] = useState<Storage>();
    const [pendingOrders, setPendingOrders] = useState<pendingOrderItem[]>([]);
    const [userDetails, setUserDetials] = useState<User>();
    const [featuredProducts, setFeaturedProducts] = useState<any>({products:[], page:1});
    const [searchHistory, setSearchHistory] = useState<Array<string>>([]);

    const initStorage = async() => {
            //configuring the store... can specify dbdriver.etc in Storage class
            const newStore = new Storage({
                name:"agribusiness_db",
                driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
            });
            //Define sqlite driver for native apps
            await newStore.defineDriver(CordovaSQLiteDriver);
            //creating the store
            const store = await newStore.create();
            setStore(store);

            //getting todo items from the storage
            const storedPendingOrders = await store.get(PENDING_ORDERS_KEY) || [];
            setPendingOrders(storedPendingOrders);

            //getting user details
            const userDetails = await store.get(USER_DETAILS_KEY) || {};
            setUserDetials(userDetails);

            //getting featured products
            const featured = await store.get(FEATURED_PRODUCTS_KEY) || {products:[], page:1};
            setFeaturedProducts(featured);

            //getting searchHistory
            const searchHis = await store.get(SEARCH_HISTORY_KEY) || [];
            setSearchHistory(searchHis);
        }
    
    
    //Hooks for storage of users info
    const saveUserDetails = async(user:User) => {
        await store?.set(USER_DETAILS_KEY, user);
    }

    const markAuthed = async() => {
        let details = userDetails!;
        console.log(`this is first ${details}`);
        details.authed = true;
        console.log(details);
        await store?.set(USER_DETAILS_KEY, details);
        setUserDetials(details)
    }

    //Hooks for storage of orders information
    const addPendingOrder = async(order:{merchantId:string, merchantName:string, productId:string, productName:string, unitPrice:string, merchantPhoto:string}) => {
        let currentPendingOrders = [...pendingOrders];
        let merchantOrderExist:Boolean = false;
        console.clear();
        console.log(pendingOrders);
        //Check if already have an order with this merchant using merchantId
        currentPendingOrders.map((item:pendingOrderItem) => {
            if(order.merchantId === item.merchantId){
                merchantOrderExist = true;
                console.log("merchant does exist");
            }else console.log("merchant")
            return item;
        });


        //if don't have an order with merchant then add new order to top of array
        
        if(merchantOrderExist === false){
            console.log("operating on merchant doesn't exist");
            let newOrder:pendingOrderItem = {
                merchantId:order.merchantId,
                merchantName:order.merchantName,
                merchantPhoto:order.merchantPhoto,
                products:[{productId:order.productId, name:order.productName, unitPrice:order.unitPrice, quantity:"1"}],
                date:new Date().toLocaleDateString()

            }
            //add new order to order list
            currentPendingOrders.unshift(newOrder);
        }else{
            console.log("operating on merchant exist")
            let orderIndex = currentPendingOrders.findIndex(item => order.merchantId === item.merchantId);
            let productIndex = currentPendingOrders[orderIndex].products.findIndex(prod => prod.productId === order.productId);
            //if product doesn't exist in list of products then add it to the top of list
            if(productIndex === -1){
                currentPendingOrders[orderIndex].products.unshift({
                    productId:order.productId,
                    name:order.productName,
                    unitPrice:order.unitPrice,
                    quantity:"1"
                });
            } 
        }

        setPendingOrders(currentPendingOrders);
        await store?.set(PENDING_ORDERS_KEY, currentPendingOrders);
       
        // let currentPendingOrders = pendingOrders;
        // let merchantExist:Boolean = false;
        // console.clear();
        // console.log(pendingOrders);
        // console.log(order);

        // //map through the pending orders if an order has already been opened with merchant
        // currentPendingOrders.map((item:pendingOrderItem) => {
        //     console.log('order exists')
        //     if(item.merchantId === order.merchantId){
        //         merchantExist = true;
        //         console.log(merchantExist);
        //         return item;
        //     }
        //     return item;
        // });


        // //if order has already been opened then just append new product to list of products
        // if(merchantExist === true){
        //     let updatedOrders = currentPendingOrders.map((item:pendingOrderItem) => {
        //         if(item.merchantId !== order.merchantId){
        //             //if product already exist then do not add it
        //             let prodIndex = item.products.findIndex(prod => prod.productId === order.productId);
        //             if(prodIndex !== -1){
        //                 let product = {
        //                     productId:order.productId,
        //                     name:order.productName,
        //                     unitPrice:order.unitPrice,
        //                     quantity:"01"
        //                 }
        //                 item.products.unshift(product);
        //             }
        //         }
        //         return item;
        //     });

        //     currentPendingOrders = [...updatedOrders];
        // }else{
        //     let product = {
        //         productId:order.productId,
        //         name:order.productName,
        //         unitPrice:order.unitPrice,
        //         quantity:"01"
        //     }

        //     let newPendingOrder:pendingOrderItem = {
        //         merchantId:order.merchantId,
        //         merchantName:order.merchantName,
        //         merchantPhoto:order.merchantPhoto,
        //         products:[product],
        //         date:new Date().toLocaleDateString()
        //     }

        //     currentPendingOrders.unshift(newPendingOrder);
        // }   

        // setPendingOrders(currentPendingOrders);
        // await store?.set(PENDING_ORDERS_KEY, currentPendingOrders);
    }

    //TODO:impliment update and delete function
    const updatePendingOrdersProduct = async(product:{productId:string, quantity:string, merchantId:string}) => {
        //Add a new product under a new merchant if merchant is not in order's list
        let updatedPendingOrders = pendingOrders.map((order:pendingOrderItem) => {
            if(order.merchantId === product.merchantId){
                let prodIndex = order.products.findIndex((prod:any) => prod.productId === product.productId);
                order.products[prodIndex].quantity = product.quantity;
            }
            return order;
        });

        setPendingOrders(updatedPendingOrders);
        await store?.set(PENDING_ORDERS_KEY, updatedPendingOrders);
    }

    const deletePendingOrder = async(merchantId:string) => {
        let newPendingOrder = [...pendingOrders].filter((item:pendingOrderItem) => item.merchantId !== merchantId);
        console.log(newPendingOrder);
        setPendingOrders(newPendingOrder);
        await store?.set(PENDING_ORDERS_KEY, newPendingOrder);
    }

    const saveFeaturedProducts = async(products:any[], page:number) => {
        let featured = {products, page};
        setFeaturedProducts(featured);
        await store?.set(FEATURED_PRODUCTS_KEY,featured);
    }

    const saveSearchHistory = async(history:string) => {
        let newSearchHistory:string[];
        if(searchHistory.includes(history)){
            newSearchHistory = searchHistory.filter((item:string) => item !== history);
        }
        newSearchHistory = [history,...searchHistory ];

        setSearchHistory(newSearchHistory);
        await store?.set(SEARCH_HISTORY_KEY, newSearchHistory);
    }

    const deleteSearchHIstory = async(history:string) => {
        let newSearchHistory:string[];
        
        if(searchHistory.includes(history)){
            newSearchHistory = searchHistory.filter((item:string) => item !== history);
        }else{
            newSearchHistory = [...searchHistory];
        }
        setSearchHistory(newSearchHistory);
        await store?.set(SEARCH_HISTORY_KEY, newSearchHistory);
    }

    useEffect(() => {
        initStorage();
        console.log("useEffect is running")
    }, []);

    return{
        pendingOrders,
        addPendingOrder,
        updatePendingOrdersProduct,
        deletePendingOrder,

        userDetails,
        saveUserDetails,
        markAuthed,
        
        featuredProducts,
        saveFeaturedProducts,

        searchHistory,
        saveSearchHistory,
        deleteSearchHIstory
    }
}