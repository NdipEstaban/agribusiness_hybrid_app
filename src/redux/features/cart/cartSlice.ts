import { createSlice } from "@reduxjs/toolkit";
import { pendingOrderItem } from "../../../hooks/useStorage";

const initialState:{pendingOrders:pendingOrderItem[], ongoingOrders:any[]} = {
    pendingOrders:[],
    ongoingOrders:[]
}

const Cart = createSlice({
    name:"cart",
    initialState,
    reducers:{
        updatePendingOrders:(state, {payload}) => {
            state.pendingOrders = [...payload];
            console.log('updated redux pending orders')
        } 
    }
});

export const {updatePendingOrders} = Cart.actions;

export default Cart.reducer