import { useEffect, useState } from "react"
import {Drivers, Storage} from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const NOTIFICATIONS_KEY = 'notifications';

export interface notificationItem{
    id:string;
    source:string;
    message:string;
    timeDate:string;
}


export const useNotificationStorage = () => {
    const [store, setStore] = useState<Storage>();
    const [notifications, setNotificatons] = useState<Array<notificationItem>>([]);

    const initStorage = async() => {
        //configuring the store... can specify dbdriver.etc in Storage class
        const newStore = new Storage({
            name:"chats_db",
            driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
        });
        //Define sqlite driver for native apps
        await newStore.defineDriver(CordovaSQLiteDriver);
        //creating the store
        const store = await newStore.create();
        setStore(store);
        //getting chats
        const storedNotificatons = await store.get(NOTIFICATIONS_KEY) || [];
        console.log(storedNotificatons);
        setNotificatons(storedNotificatons);
    }

    useEffect(() => {
        initStorage();
    }, []);

    const addNotification = async(newNotification:notificationItem) => {
        let updatedNotifications = [newNotification, ...notifications];
        setNotificatons(updatedNotifications);
        store?.set(NOTIFICATIONS_KEY, updatedNotifications);
    }

    const deleteNotification = async(notificationId:string) => {
        let updatedNotifications = [...notifications].filter(notif => notif.id !== notificationId);
        setNotificatons(updatedNotifications);
        store?.set(NOTIFICATIONS_KEY, updatedNotifications);
    }

    return{
        notifications,
        addNotification,
        deleteNotification
    }
}


