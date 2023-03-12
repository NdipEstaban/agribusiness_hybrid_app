import {createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { decryptRequest, encryptResponse } from "../../../utils/crypto_utility";


const BackupSlice = createApi({
    reducerPath:"chatsBackupApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/backup"}),
    tagTypes:['OrdersPerMonth'],
    endpoints:(builder) => ({
        getUserData:builder.query({
            query:(data:any) => `retrieve-user-data?userId=${data.userId}`,
            transformResponse:response => decryptRequest(response)
        }),
        backupUserData:builder.mutation({
            query:(data) => ({
                url:"backup-user-data",
                method:"POST",
                body:{
                    userData:encryptResponse(data.userData),
                    userId:data.userId
                }
            }),
            transformResponse: response => decryptRequest(response)
        })
    })
});

export const {
    useLazyGetUserDataQuery,
    useBackupUserDataMutation,
} = BackupSlice;

export default BackupSlice;