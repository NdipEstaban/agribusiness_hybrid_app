import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const announceSlice = createApi({
    reducerPath:"announceApi",
    tagTypes:["Announce"],
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:7000/announcements"}),
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
