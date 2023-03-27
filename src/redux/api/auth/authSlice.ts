import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { useSelector } from 'react-redux';
import { encryptResponse, decryptRequest } from '../../../utils/crypto_utility';
import { hostAddress } from '../../../assets/constants/backend';


const authSlice = createApi({
    reducerPath: 'authApi',
    baseQuery:fetchBaseQuery({baseUrl: `${hostAddress}/auth`}),
    tagTypes:['Auth'],
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: userInfo => ({
                url:'sign-in',
                method:'POST',
                body:{
                    user:encryptResponse(userInfo)
                }
            }),
        }),
        logIn: builder.mutation({
            query: email => ({
                url:'log-in',
                method:"POST",
                body:{
                    email:encryptResponse(email)
                }
            }),
        }),
        sendOtp:builder.mutation({
            query: (email:any) => ({
                url:"send-otp-code",
                method:"POST",
                body:{
                    email:encryptResponse(email)
                }
            }),
        }),
    })
});

export const {
    useSignInMutation,
    useLogInMutation,
    useSendOtpMutation
} = authSlice;

export default authSlice;