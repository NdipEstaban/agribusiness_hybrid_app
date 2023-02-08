import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./api/user/userSlice";
import orderSlice from "./api/order/orderSlice";
import productSlice from "./api/product/productSlice";
import announceSlice from "./api/announcement/announceSlice";
import authSlice from "./api/auth/authSlice";
import user from "./features/user/userSlice";
import searchSlice from "./features/search/searchSlice";
import cartSlice from "./features/cart/cartSlice";

const store = configureStore({
    reducer:{
        user:user,
        search:searchSlice,
        cart:cartSlice,
        [orderSlice.reducerPath]:orderSlice.reducer,
        [userSlice.reducerPath]:userSlice.reducer,
        [productSlice.reducerPath]:productSlice.reducer,
        [authSlice.reducerPath]:authSlice.reducer,
        [announceSlice.reducerPath]:announceSlice.reducer
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(
        orderSlice.middleware,
        announceSlice.middleware,
        authSlice.middleware,
        productSlice.middleware,
        userSlice.middleware
    )
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;