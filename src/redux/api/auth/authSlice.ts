import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { useSelector } from 'react-redux';

const authSlice = createApi({
    reducerPath: 'auth',
    baseQuery:fetchBaseQuery({baseUrl: "http://localhost:7000/auth"}),
    tagTypes:['Auth'],
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: userInfo => ({
                url:'sign-in',
                method:'POST',
                body:{
                    ...userInfo
                }
            }),
        }),
        logIn: builder.mutation({
            query: phoneNumber => ({
                url:'log-in',
                method:"POST",
                body:{
                    phoneNumber
                }
            }),
        }),
        sendOtp:builder.mutation({
            query: phoneNumber => ({
                url:"send-otp-code",
                method:"POST",
                body:{
                    phoneNumber
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