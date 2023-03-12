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
    merchantId:string,
    merchantName:string,
    merchantPhoto:string,
    date:string,
    products:{productId:string, name:string, unitPrice:string, quantity:string}[];
}

// export interface chatItem{
//     userId:string,
//     name:string,
//     image:string,
//     messages:messageItem[]
// }

// export interface messageItem{
//     id:string,
//     text:string,
//     time:string,
//     date:string,
//     recieved:Boolean,
//     source:string,
//     image:string | null
// }

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
        setUserDetials(user);
        await store?.set(USER_DETAILS_KEY, user);
    }

    const clearUserDetails = async() => {
        await store?.clear();
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
        //Check if already have an order with this merchant using merchantId
        currentPendingOrders.map((item:pendingOrderItem) => {
            if(order.merchantId === item.merchantId){
                merchantOrderExist = true;
            }
            return item;
        });

        //if don't have an order with merchant then add new order to top of array
        if(merchantOrderExist === false){
            let newOrder:pendingOrderItem = {
                merchantId:order.merchantId,
                merchantName:order.merchantName,
                merchantPhoto:order.merchantPhoto,
                products:[{productId:order.productId, name:order.productName, unitPrice:order.unitPrice, quantity:"1"}],
                date:new Date().toLocaleDateString()
            }
            //add new order to order list
            currentPendingOrders = [newOrder, ...currentPendingOrders];
            console.log("added new order", currentPendingOrders);
            
        }else{
            let orderIndex = currentPendingOrders.findIndex(item => order.merchantId === item.merchantId);
            let currentOrder = currentPendingOrders[orderIndex];
            let productIndex = currentPendingOrders[orderIndex].products.findIndex(prod => prod.productId === order.productId);
            console.log(currentPendingOrders[orderIndex].products);
            console.log(productIndex);
            //if product doesn't exist in list of products then add it to the top of list
            if(productIndex === -1){
                console.log(currentOrder.products);
                let newProducts = [{
                    productId:order.productId,
                    name:order.productName,
                    unitPrice:order.unitPrice,
                    quantity:"1"
                }, ...currentOrder.products];

                let updatedOrder:pendingOrderItem = {
                    merchantId:currentOrder.merchantId,
                    merchantName:currentOrder.merchantName,
                    merchantPhoto:currentOrder.merchantPhoto,
                    products:[...newProducts],
                    date:new Date().toLocaleDateString()
                }

                currentPendingOrders.splice(orderIndex, 1, updatedOrder);
            }
        }

        setPendingOrders(currentPendingOrders);
        await store?.set(PENDING_ORDERS_KEY, currentPendingOrders);
    }

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
        setPendingOrders(newPendingOrder);
        await store?.set(PENDING_ORDERS_KEY, newPendingOrder);
        console.log('pendingorders', newPendingOrder);
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

    const retrievePendingOrders = async() => {
        let pendingOrders = await store?.get(PENDING_ORDERS_KEY);
        return pendingOrders;
    }

    const restorePendingOrders = async(newPendingOrders:pendingOrderItem[]) => {
        await store?.set(PENDING_ORDERS_KEY,newPendingOrders);
    }

    const updateUserEmail = async(newEmail:string) => {
        let userDetails = await store?.get(USER_DETAILS_KEY);
        userDetails.email = newEmail;
        await store?.set(USER_DETAILS_KEY,userDetails);
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
        restorePendingOrders,

        userDetails,
        saveUserDetails,
        markAuthed,
        updateUserEmail,
        clearUserDetails,
        
        featuredProducts,
        saveFeaturedProducts,

        searchHistory,
        saveSearchHistory,
        deleteSearchHIstory,

        retrievePendingOrders,
    }
}