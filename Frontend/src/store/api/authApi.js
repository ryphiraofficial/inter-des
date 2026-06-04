import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/constants';

export const authApi = createApi({
    reducerPath: 'authApi',
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
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (body) => ({ url: '/auth/updatedetails', method: 'PUT', body }),
            invalidatesTags: ['User'],
        }),
        updatePassword: builder.mutation({
            query: (body) => ({ url: '/auth/updatepassword', method: 'PUT', body }),
        }),
        login: builder.mutation({
            query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
    useLoginMutation,
} = authApi;
