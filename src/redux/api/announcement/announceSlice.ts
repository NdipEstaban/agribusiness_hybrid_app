import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { hostAddress } from '../../../assets/constants/backend';

const announceSlice = createApi({
    reducerPath:"announceApi",
    tagTypes:["Announce"],
    baseQuery:fetchBaseQuery({baseUrl:`${hostAddress}/announcements`}),
    endpoints:(builder) => ({
        getAnnouncements:builder.mutation({
            query:(page) => ({
                url:`get-announce?page=${page}`,
                method:"GET"
            }),
        }),
    })
});

export const {
    useGetAnnouncementsMutation
} = announceSlice;

export default announceSlice;
