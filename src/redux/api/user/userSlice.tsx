import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const userSlice = createApi({
    reducerPath:"userApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/users"}),
    tagTypes:['User'],
    endpoints:(builder) => ({
        searchUser:builder.query({
            query:(user) => `search-user?search=${user}`
        }),
        getUserById:builder.query({
            query:(user) => `get-user?userId=${user}`
        }),
        updateUser:builder.mutation({
            query: (user) => ({
                url:"update-user",
                method:"PUT",
                body:{
                    ...user
                }
            }),
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
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useUpdateDeliveryMutation,
    useUpdateConsumerMutation,
    useUpdateMerchantMutation
} = userSlice;

export default userSlice