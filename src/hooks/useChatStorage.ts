import { useEffect, useState } from "react"
import {Drivers, Storage} from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

const CHATS_KEY = "chats-data";

const defaultChats = [{
    userId:'admin',
    name:"ABIC Customer service",
    image:'',
    messages:[
        {
            id:"welcome-message",
            text:"Welcome to ABIC agribusiness platform, from this chat you can contact our customer service",
            time:"",
            date:"",
            recieved:true,
            source:"reciever",
            sent:"true",
            image:null
        }
    ]
}]

export interface chatItem{
    userId:string,
    name:string,
    image:string,
    messages:messageItem[]
}

export interface messageItem{
    id:string,
    text:string,
    time:string,
    date:string,
    recieved:Boolean,
    source:string,
    sent:Boolean,
    image:string | null
}

export const useChatsStorage = () => {
    const [store, setStore] = useState<Storage>();
    const [chats, setChats] = useState<Array<chatItem>>([]);

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
        let storedChats = await store.get(CHATS_KEY) || [];

        //go through the chats and add the welcome chat if not already there
        if(storedChats.filter((chat:chatItem) => chat.userId === 'admin').length <= 0){
            storedChats = [...defaultChats,...storedChats];
            setChats(storedChats);
            store?.set(CHATS_KEY, storedChats)
        }else{
            // setChats([...defaultChats,...storedChats]);
        }
    }

    useEffect(() => {
        initStorage();
    }, []);

    
    const createChat = async(userId:string, name:string, image:string) => {
        let oldChats = await store?.get(CHATS_KEY);
        let chatList = [...chats];
        let chatIndex = chatList.findIndex((item:chatItem) => item.userId === userId);
        
        if(chatIndex === -1){
            let newChat:chatItem = {
                userId:userId,
                name,
                image,
                messages:[]
            };
            let updatedChats = [...chatList, newChat];
            console.log('created chat')
            setChats(updatedChats);
            await store?.set(CHATS_KEY, updatedChats);
        }else{
            console.log("didn't create chat");
        }
    }

    const deleteChat = async(userId:string) => {
        let chatList = [...chats];
        chatList = chatList.filter((item:chatItem) => item.userId !== userId);
        console.log('deleting chat');
        console.log(chatList);

        setChats(chatList);
        await store?.set(CHATS_KEY, chatList);
    }

    const addMessage = async(userId:string, newMessage:messageItem, user?:any) => {
        let chatList = await store?.get(CHATS_KEY) || [];
        //check if the user already has a chat with this sender, else create one
        let chatIndex = (chatList != null)?chatList.findIndex((item:chatItem) => item.userId === userId):-1;
        if(chatIndex === -1){
            let newChat:chatItem = {
                userId:userId,
                name:user.name,
                image:user.image,
                messages:[]
            };
            chatList = [...chatList, newChat];
            console.log('created chat')
        }
    
        //add message to chat with matching userId
        chatList.map((item:chatItem) => {
            if(item.userId === userId){
                console.log('added message');
                //add new message only if the message is not already there
                let updatedMessages = item.messages.filter((message:messageItem) => newMessage.id !== message.id);
                updatedMessages.push(newMessage);
                item.messages = updatedMessages;
                return item;
            }
            return item;
        });

        await store?.set(CHATS_KEY, chatList);
        setChats(chatList);
    }

    const deleteMessage = async(userId:string, messageId:string) => {
        let chatList = [...chats];

        chatList.map((chat:chatItem) => {
            if(chat.userId === userId){
                chat.messages = chat.messages.filter((item:messageItem) => item.id !== messageId);
                return chat;
            }
            return chat;
        })

        await store?.set(CHATS_KEY, chatList);
        setChats(chatList);
    }

    const setChatToRead = async(userId:string) => {
        console.log('notifying chats to read', userId);
        let chatList = await store?.get(CHATS_KEY) || [];
        console.log('read chat', chatList);
        chatList.map((chat:chatItem) => {
            if(chat.userId === userId){
                console.log('this are the messages', chat.messages);
                chat.messages.map((message:messageItem) => {
                    message.recieved = true;
                    return message;
                });
            }
            return chat;
        });
        console.log(chatList);
        console.log('chats after notif', chatList);
        await store?.set(CHATS_KEY, chatList);
        setChats(chatList);
    }

    const markMessageAsSent = async (userId:string, messageId:string) => {
        let chatList = await store?.get(CHATS_KEY);
        chatList.map((chat:chatItem) => {
            if(chat.userId === userId){
                chat.messages.map((message:messageItem) => {
                    if(message.id === messageId){
                        message.sent = true;
                        return message;
                    }return message;
                })
                return chat;
            }
            return chat;
        });

        await store?.set(CHATS_KEY, chatList);
        setChats(chatList);
    }

    const getUnsentMessages = async() => {
        let chatList = await store?.get(CHATS_KEY);
        let unsentMessagesInfo:any[] = [];

        chatList.map((chat:chatItem) => {
            chat.messages.map((message:messageItem) => {
                if(message.sent === false){
                    let unsentMessageInfo = {
                        userId:chat.userId,
                        messageData:message
                    }
                    unsentMessagesInfo.push(unsentMessageInfo);
                }
                return message
            });
            return chat;
        });
        
        return unsentMessagesInfo;
    }

    const retrieveChatData = async() => {
       let chatData = await store?.get(CHATS_KEY);
       return chatData;
    }

    const restoreChatData = async(newChatData:chatItem[]) => {
        await store?.set(CHATS_KEY, newChatData);
    }

    return{
        chats,
        createChat,
        deleteChat,
        deleteMessage,
        addMessage,
        retrieveChatData,
        setChatToRead,
        markMessageAsSent,
        getUnsentMessages,
        restoreChatData,
        initStorage
    }
}