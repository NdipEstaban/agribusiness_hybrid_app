import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { decryptRequest, encryptResponse } from '../../../utils/crypto_utility';

const userSlice = createApi({
    reducerPath:"userApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/users"}),
    tagTypes:['User'],
    endpoints:(builder) => ({
        searchUser:builder.query({
            query:(user) => `search-users?search=${user}`
        }),
        getDeliveryServices: builder.query({
            query:(query) => `get-delivery?query=${query}`,
            transformResponse: response => {
                return decryptRequest(response);
            }
        }),
        getUserById:builder.mutation({
            query: (userId) => ({
                url:"get-user",
                method:"POST",
                body:{
                    userId:encryptResponse(userId)
                }
            }),
        }),
        updateUserEmail:builder.mutation({
            query: (data:any) => ({
                url:"update-user-email",
                method:"PUT",
                body:{
                    userId:data.userId,
                    newEmail:data.email
                }
            })
        }),
        updateUser:builder.mutation({
            query: (user) => ({
                url:"update-user",
                method:"PUT",
                body:{
                    userDetails:encryptResponse(user)
                }
            }),
            transformResponse: response => {
                return decryptRequest(response);
            }
        }),
        updateMerchant:builder.mutation({
            query:(info) => ({
                url:"update-merchant",
                method:"PUT",
                body:{
                    principal_product:info
                }
            }),
        }),
        updateConsumer:builder.mutation({
            query:(info) => ({
                url:"update-consumer",
                method:"PUT",
                body:{
                    favoriteProducts:info
                }
            }),
        }),
        updateDelivery:builder.mutation({
            query:(info) => ({
                url:"update-delivery",
                method:"PUT",
                body:{
                    destinations:info
                }
            }),
        })
    })
});

export const {
    useSearchUserQuery,
    useLazyGetDeliveryServicesQuery,
    useLazySearchUserQuery,
    useGetUserByIdMutation,
    useUpdateUserMutation,
    useUpdateDeliveryMutation,
    useUpdateConsumerMutation,
    useUpdateMerchantMutation,
    useUpdateUserEmailMutation
} = userSlice;

export default userSlice