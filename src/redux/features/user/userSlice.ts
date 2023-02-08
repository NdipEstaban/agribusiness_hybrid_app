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

const initialState:User = {
    userId:"46a7ac12-ab22-4803-be9c-5bc9d895cff1",
    name:"Ndip Estaban",
    email:"estabannd@gmail.com",
    quater:"lycee deido",
    city:"Douala",
    profilePicture:"",
    role:"consumer",
    userPref:[],
    description:"a very good and talented person",
    apiKey:"45333"
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
            state.userId = payload.user_id;
            state.name = payload.name;
            state.email = payload.email;
            state.quater = payload.quater
            state.city = payload.city;
            state.profilePicture = payload.profile_picture;
            state.role = payload.role;
            state.apiKey = payload.api_key;
            state.description = payload.description;
        },
        updateUserId:(state, {payload}) => {
            state.userId = payload.userId
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
    }
});

export const {
    updateUser,
    updateUserId,
    updateUserPref,
    updateDescription,
    updatePhoneNumber
} = user.actions;

export default user.reducer;