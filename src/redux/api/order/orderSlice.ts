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
        getRecentOrders:builder.query({
            query:(data:any) => `get-recent-orders?userId=${data.userId}&role=${data.role}`,
            transformResponse:responseData => {
                return decryptRequest(responseData);
            }
        }),
        getMerchantPendingOrders:builder.query({
            query:(id:string) => `get-merchant-pending-orders?merchantId=${id}`,
        }),
        getMerchantOngoingOrders:builder.query({
            query:(id:string) => `get-merchant-ongoing-orders?merchantId=${id}`,
            transformResponse: responseData => {
                return decryptRequest(responseData)
            }
        }),
        deliveryDeclineOrder:builder.mutation({
            query:(details:any) => ({
                url:"delivery-decline-order",
                method:"PUT",
                body:{
                    deliveryId:details.deliveryId,
                    orderId:details.orderId
                }
            }),
        }),
        deliveryAceptOrder:builder.mutation({
            query:(details:any) => ({
                url:"delivery-accept-order",
                method:"PUT",
                body:{
                    deliveryId:details.deliveryId,
                    orderId:details.orderId
                }
            }),
        }),
        getDeliveryPendingOrders:builder.query({
            query:(id:string) => `get-delivery-pending-orders?deliveryId=${id}`,
            transformResponse: responseData => {
                return decryptRequest(responseData)
            }
        }),
        getDeliveryOngoingOrders:builder.query({
            query:(id:string) => `get-delivery-ongoing-orders?deliveryId=${id}`,
            transformResponse: responseData => {
                return decryptRequest(responseData)
            }
        }),
        confirmDelivery:builder.query({
            query:(id:string) => `consumer-confirm-delivery?${id}`
        }),
        merchantSelfDelivery:builder.mutation({
            query:(orderId:string) => ({
                url:"merchant-self-delivery",
                method:"PUT",
                body:{
                    orderId:encryptResponse(orderId)
                }
            })
        }),
        addDeliveryPayment: builder.mutation({
            query:(info:any) => ({
                url:"add-delivery-payment",
                method:"PUT",
                body:{
                    deliveryId:encryptResponse(info.deliveryId),
                    amount:encryptResponse(info.amount),
                    orderId:encryptResponse(info.orderId),
                    merchantPhoneNumber:encryptResponse(info.merchantPhoneNumber)
                }
            }),
        }),
        merchantDeclineOrder:builder.mutation({
            query:(orderId:string) => ({
                url:"merchant-decline-order",
                method:"DELETE",
                body:{
                    orderId:encryptResponse(orderId)
                }
            })
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
    useMerchantSelfDeliveryMutation,
    useLazyGetMerchantPendingOrdersQuery,
    useAddDeliveryPaymentMutation,
    useGetConsumerOrdersQuery,
    useLazyGetDeliveryPendingOrdersQuery,
    useDeleteOrderMutation,
    useCancelOrderMutation,
    useUpdateOrderMutation,
    useCreateOrderMutation,
    useMerchantDeclineOrderMutation,
    useLazyGetMerchantOngoingOrdersQuery,
    useDeliveryAceptOrderMutation,
    useDeliveryDeclineOrderMutation,
    useLazyGetDeliveryOngoingOrdersQuery,
    useGetRecentOrdersQuery,
    useLazyGetRecentOrdersQuery
} = orderSlice

export default orderSlice