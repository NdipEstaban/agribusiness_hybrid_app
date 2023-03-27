import {createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { decryptRequest } from "../../../utils/crypto_utility";
import { hostAddress } from "../../../assets/constants/backend";


const StatsSlice = createApi({
    reducerPath:"statsApi",
    baseQuery:fetchBaseQuery({baseUrl:`${hostAddress}/stats`}),
    tagTypes:['OrdersPerMonth'],
    endpoints:(builder) => ({
        getOrdersPerMonth:builder.query({
            query:(data:any) => `orders-per-month?userId=${data.userId}&year=${data.year}`,
            transformResponse:response => decryptRequest(response)
        }),
        getMostOrderedProducts:builder.query({
            query:(userId:string) => `most-ordered-products?userId=${userId}`,
            transformResponse: response => decryptRequest(response)
        })
    })
});

export const {
    useLazyGetOrdersPerMonthQuery,
    useLazyGetMostOrderedProductsQuery
} = StatsSlice;

export default StatsSlice;