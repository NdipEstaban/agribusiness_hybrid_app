import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { idCardSharp } from 'ionicons/icons';
import { decryptRequest, encryptResponse } from '../../../utils/crypto_utility';

const orderSlice = createApi({
    reducerPath:"orderApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/orders"}),
    tagTypes:['Order'],
    endpoints:(builder) => ({
        getConsumerOrders:builder.query({
            query:(id:string) => `get-consumer-orders?consumerId=${id}`,
            transformResponse: responseData => {
                return decryptRequest(responseData);
            }
        }),
        getMerchantOrders:builder.query({
            query:(id:string) => `get-merchant-orders?merchantId=${id}`
        }),
        getDeliveryOrders:builder.query({
            query:(id:string) => `get-delivery-orders?deliveryId=${id}`
        }),
        confirmDelivery:builder.query({
            query:(id:string) => `consumer-confirm-delivery?${id}`
        }),
        createOrder: builder.mutation({
            query:(info) => ({
                url:"new-order",
                method:"POST",
                body:{
                    ...info
                }
            }),
        }),
        updateOrder:builder.mutation({
            query:(info) => ({
                url:"update-order",
                method:"PUT",
                body:{
                    ...info
                }
            }),
        }),
        deleteOrder:builder.mutation({
            query:(info) => ({
                url:"delete-order",
                method:"DELETE",
                body:{
                    ...info
                }
            })
        }),
        cancelOrder:builder.mutation({
            query:(info) => ({
                url:"cancel-order",
                method:"POST",
                body:info
            })
        })
    })
});


export const {
    useLazyGetConsumerOrdersQuery,
    useLazyGetDeliveryOrdersQuery,
    useLazyGetMerchantOrdersQuery,
    useGetConsumerOrdersQuery,
    useGetDeliveryOrdersQuery,
    useGetMerchantOrdersQuery,
    useDeleteOrderMutation,
    useCancelOrderMutation,
    useUpdateOrderMutation,
    useCreateOrderMutation,
} = orderSlice

export default orderSlice