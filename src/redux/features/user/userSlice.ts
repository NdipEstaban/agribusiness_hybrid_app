import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { stat } from 'fs';

interface User {
    userId:string;
    phoneNumber:string;
    name:string;
    city:string;
    profilePicture:string;
    role:string;
    userPref:string | string[];
    description:string;
}

const initialState:User = {
    userId:"",
    name:"Ndip Estaban",
    phoneNumber:"+237681575178",
    city:"Douala",
    profilePicture:"",
    role:"producer",
    userPref:[],
    description:"a very good and talented person"
}


const user = createSlice({
    name:"user",
    initialState,
    reducers:{
        updateUser:(state, {payload}) => {
            state.userId = payload.id;
            state.name = payload.name;
            state.phoneNumber = payload.phoneNumber;
            state.city = payload.city;
            state.profilePicture = payload.profilePicture;
            state.role = payload.role;
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
            state.phoneNumber = payload.phoneNumber;
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