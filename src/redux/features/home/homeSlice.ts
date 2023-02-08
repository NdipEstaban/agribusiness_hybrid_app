import { createSlice } from "@reduxjs/toolkit";


const initialState:any = {
    featuredPage:0
}


const home = createSlice({
    name:"home",
    initialState,
    reducers:{
        addFeaturedPage:(initialState) => initialState += 1
    }
});

