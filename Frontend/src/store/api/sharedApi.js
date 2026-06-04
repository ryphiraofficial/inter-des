import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/constants';

export const sharedApi = createApi({
    reducerPath: 'sharedApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Approvals'],
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: '/upload',
                method: 'POST',
                body: formData,
            }),
        }),
        aiQuery: builder.mutation({
            query: ({ prompt, currentPath, pageState }) => ({
                url: '/ai/query',
                method: 'POST',
                body: { prompt, currentPath, pageState },
            }),
        }),
        aiSuggest: builder.mutation({
            query: ({ type, field, value }) => ({
                url: '/ai/suggest',
                method: 'POST',
                body: { type, field, value },
            }),
        }),
        createNotification: builder.mutation({
            query: (body) => ({
                url: '/notifications',
                method: 'POST',
                body,
            }),
        }),
        subscribePush: builder.mutation({
            query: (subscription) => ({
                url: '/push/subscribe',
                method: 'POST',
                body: subscription,
            }),
        }),
        getApprovals: builder.query({
            query: () => '/approvals',
            providesTags: ['Approvals'],
        }),
        createApproval: builder.mutation({
            query: (body) => ({
                url: '/approvals',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Approvals'],
        }),
        updateApproval: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/approvals/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Approvals'],
        }),
        deleteApproval: builder.mutation({
            query: (id) => ({
                url: `/approvals/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Approvals'],
        }),
    }),
});

export const {
    useUploadImageMutation,
    useAiQueryMutation,
    useAiSuggestMutation,
    useCreateNotificationMutation,
    useGetApprovalsQuery,
    useCreateApprovalMutation,
    useUpdateApprovalMutation,
    useDeleteApprovalMutation,
    useSubscribePushMutation
} = sharedApi;
