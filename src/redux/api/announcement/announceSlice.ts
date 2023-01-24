import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const announceSlice = createApi({
    reducerPath:"Announce",
    tagTypes:["Announce"],
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/announcements"}),
    endpoints:(builder) => ({
        getOrders:builder.query({
            query:() => 'get-announce',
        }),
    })
});

export const {useGetOrdersQuery} = announceSlice;

export default announceSlice;
