import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "./api/user/userSlice";
import orderSlice from "./api/order/orderSlice";
import productSlice from "./api/product/productSlice";
import announceSlice from "./api/announcement/announceSlice";
import authSlice from "./api/auth/authSlice";
import user from "./features/user/userSlice";
import searchSlice from "./features/search/searchSlice";
import cartSlice from "./features/cart/cartSlice";
import StatsSlice from "./api/statistics/statisticsSlice";
import BackupSlice from "./api/backup/backup";

const store = configureStore({
    reducer:{
        user:user,
        search:searchSlice,
        cart:cartSlice,
        [orderSlice.reducerPath]:orderSlice.reducer,
        [userSlice.reducerPath]:userSlice.reducer,
        [productSlice.reducerPath]:productSlice.reducer,
        [authSlice.reducerPath]:authSlice.reducer,
        [announceSlice.reducerPath]:announceSlice.reducer,
        [StatsSlice.reducerPath]:StatsSlice.reducer,
        [BackupSlice.reducerPath]:BackupSlice.reducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(
        orderSlice.middleware,
        announceSlice.middleware,
        authSlice.middleware,
        productSlice.middleware,
        userSlice.middleware,
        StatsSlice.middleware,
        BackupSlice.middleware,
    )
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;