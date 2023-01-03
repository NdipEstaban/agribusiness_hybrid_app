import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { nanoid } from "@reduxjs/toolkit";

type Occupation = "farmer"|"merchant"|"delivery"|"";

export interface User{
    name:string,
    userName:string,
    phoneNumber:string,
    password:string,
    occupation:Occupation,
    image:string,
}

const initialState:User = {
    name:"",
    userName:"",
    phoneNumber:"",
    password:"",
    occupation:"",
    image:"",
}

export const userSignInSlice = createSlice({
    name:'signIn',
    initialState,
    reducers:{
        insert:(state, action:PayloadAction<User>) => {
                const {payload} = action;
                state = payload;
        }
    }
});

//TODO:Dispatch userinfo from signin form and verify that redux is working

export const {insert} = userSignInSlice.actions;
export default userSignInSlice.reducer;