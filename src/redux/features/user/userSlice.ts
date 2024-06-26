import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { stat } from 'fs';

interface User {
    userId:string;
    email:string;
    name:string;
    city:string;
    quater:string;
    profilePicture:string;
    role:string;
    userPref:string | string[];
    description:string | null;
    apiKey:string;
}

// const initialState:User = {
//     userId:"536b0537-9240-4a9c-97a9-7d39505ab5a4",
//     name:"new user",
//     email:"newuser@gmail.com",
//     quater:"Makepe, Carrefour express",
//     city:"baffoussam",
//     profilePicture:"",
//     role:"delivery",
//     userPref:[],
//     description:"a very good and talented person",
//     apiKey:"45333"
// }

// const initialState:User = {
//     userId:"46a7ac12-ab22-4803-be9c-5bc9d895cff1",
//     name:"Ndip Estaban Tabe",
//     email:"estabannd@gmail.com",
//     quater:"Makepe, Carrefour express",
//     city:"Douala",
//     profilePicture:"",
//     role:"merchant",
//     userPref:[],
//     description:"a very good and talented person",
//     apiKey:"45333"
// }

// const initialState:User = {
//     userId:"dd19f290-a326-44a0-9659-24e04d685948",
//     name:"james cameron",
//     email:"wordleplus@gmail.com",
//     quater:"socada",
//     city:"baffoussam",
//     profilePicture:"",
//     role:"consumer",
//     userPref:[],
//     description:"a very good consumer",
//     apiKey:"45333"
// }


const initialState:User = {
    userId:"",
    name:"",
    email:"",
    quater:"",
    city:"",
    profilePicture:"",
    role:"",
    userPref:[],
    description:"",
    apiKey:"",
}

/*api_key
: 
"ab03c508-98b2-4d34-af7b-945ae7c64352"
city
: 
"Douala"
createdAt
: 
"2023-02-01T08:17:41.000Z"
description
: 
null
email
: 
"estabannd@gmail.com"
name
: 
"Ndip Estaban"
profile_picture
: 
{type: 'Buffer', data: Array(9451)}
quater
: 
"pk12 entree laique"
role
: 
"merchant"
updatedAt
: 
"2023-02-01T08:17:41.000Z"
user_id
: 
"5f799989-ae4c-4b26-8be8-f5c451e72064" */
const user = createSlice({
    name:"user",
    initialState,
    reducers:{
        updateUser:(state, {payload}) => {
            state.userId = payload.userId;
            state.name = payload.name;
            state.email = payload.email;
            state.quater = payload.quater
            state.city = payload.city;
            state.profilePicture = payload.profilePicture            ;
            state.role = payload.role;
            state.apiKey = payload.apiKey;
            state.description = payload.description;

            console.log(payload);
        },
        updateUserId:(state, {payload}) => {
            state.userId = payload.userId
        },
        updateEmail:(state, {payload}) => {
            state.email = payload.email
        },
        updateUserPref:(state, {payload}) => {
            state.userPref = payload.userPref;
        },
        updateDescription:(state, {payload}) => {
            state.description = payload.description;
        },
        updatePhoneNumber:(state, {payload}) => {
            state.email = payload.email;
        },
        clearUser:(state) => {
            state = initialState
        }
    }
});

export const {
    updateUser,
    updateUserId,
    updateUserPref,
    updateDescription,
    updatePhoneNumber,
    clearUser,
    updateEmail
} = user.actions;

export default user.reducer;