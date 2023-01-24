import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const orderSlice = createApi({
    reducerPath:"Order",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/orders"}),
    tagTypes:['Order'],
    endpoints:(builder) => ({
        getConsumerOrders:builder.query({
            query:() => `get-consumer-orders`,
        }),
        getMerchantOrders:builder.query({
            query:() => 'get-merchant-orders'
        }),
        getDeliveryOrders:builder.query({
            query:() => 'get-delivery-orders'
        }),
        
        confirmDelivery:builder.query({
            query:(id) => `consumer-confirm-delivery?${id}`
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
                body:{
                    ...info
                }
            })
        })
    })
});


export const {
    useGetConsumerOrdersQuery,
    useGetDeliveryOrdersQuery,
    useGetMerchantOrdersQuery,
    useDeleteOrderMutation,
    useCancelOrderMutation,
    useUpdateOrderMutation,
    useCreateOrderMutation,
} = orderSlice

export default orderSlice