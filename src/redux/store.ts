import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./api/user/userSlice";
import orderSlice from "./api/order/orderSlice";
import productSlice from "./api/product/productSlice";
import announceSlice from "./api/announcement/announceSlice";
import authSlice from "./api/auth/authSlice";
import user from "./features/user/userSlice";


const store = configureStore({
    reducer:{
        user:user,
        [orderSlice.reducerPath]:orderSlice.reducer,
        [userSlice.reducerPath]:orderSlice.reducer,
        [productSlice.reducerPath]:orderSlice.reducer,
        [authSlice.reducerPath]:authSlice.reducer,
        [announceSlice.reducerPath]:announceSlice.reducer
    },
    // middleware:[orderSlice.middleware, announceSlice.middleware,authSlice.middleware, userSlice.middleware, productSlice.middleware]
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(
        orderSlice.middleware, 
        announceSlice.middleware,
        authSlice.middleware
    )
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;