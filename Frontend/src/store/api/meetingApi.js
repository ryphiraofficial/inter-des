import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/constants';

export const meetingApi = createApi({
    reducerPath: 'meetingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                headers.set('Authorization', `Bearer ${token}`);
            }
            if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Meetings'],
    endpoints: (builder) => ({
        getUsersForMeetings: builder.query({
            query: () => '/meetings/users',
            providesTags: ['Meetings'],
        }),
        getMeetings: builder.query({
            query: () => '/meetings',
            providesTags: ['Meetings'],
        }),
        getMeetingById: builder.query({
            query: (id) => `/meetings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Meetings', id }],
        }),
        createMeeting: builder.mutation({
            query: (body) => ({ url: '/meetings', method: 'POST', body }),
            invalidatesTags: ['Meetings'],
        }),
        updateMeeting: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/meetings/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Meetings'],
        }),
        cancelMeeting: builder.mutation({
            query: (id) => ({ url: `/meetings/${id}/cancel`, method: 'PATCH' }),
            invalidatesTags: ['Meetings'],
        }),
        markMeetingRead: builder.mutation({
            query: (id) => ({ url: `/meetings/${id}/read`, method: 'PATCH' }),
            invalidatesTags: ['Meetings'],
        }),
    }),
});

export const {
    useGetUsersForMeetingsQuery,
    useGetMeetingsQuery,
    useGetMeetingByIdQuery,
    useCreateMeetingMutation,
    useUpdateMeetingMutation,
    useCancelMeetingMutation,
    useMarkMeetingReadMutation,
} = meetingApi;
