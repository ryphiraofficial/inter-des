import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://inter-des-backend.onrender.com/api';

// ──────────────────────────────────────────────────────────────────────────────
// Design RTK Query API Service
// ──────────────────────────────────────────────────────────────────────────────
export const designApi = createApi({
    reducerPath: 'designApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                headers.set('Authorization', `Bearer ${token}`);
            }
            // For FormData (file uploads), do NOT set Content-Type to application/json
            // We'll let the browser set it automatically for multipart/form-data
            return headers;
        },
    }),
    tagTypes: ['Projects', 'Tasks', 'Quotations', 'Staff', 'Notifications', 'MaterialRequests'],
    keepUnusedDataFor: 30, // Default cache time

    endpoints: (builder) => ({
        // ── Projects ──────────────────────────────────────────────────────────
        getProjects: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/projects?${query}`;
            },
            providesTags: ['Projects'],
        }),
        
        getProjectStats: builder.query({
            query: () => '/projects/stats',
            providesTags: ['Projects'],
            keepUnusedDataFor: 120,
        }),

        performProjectHandoff: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}/handoff`,
                method: 'POST',
            }),
            invalidatesTags: ['Projects'],
        }),

        // ── Tasks ─────────────────────────────────────────────────────────────
        getDesignTasks: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/tasks?${query}`;
            },
            providesTags: ['Tasks'],
        }),

        createDesignTask: builder.mutation({
            query: (body) => ({
                url: '/tasks',
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Tasks'],
        }),

        updateDesignTask: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }),
            async onQueryStarted({ id, status, ...body }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    designApi.util.updateQueryData('getDesignTasks', { limit: 100 }, (draft) => {
                        if (draft?.data) {
                            const task = draft.data.find(t => t._id === id);
                            if (task) {
                                if (status) task.status = status;
                                Object.assign(task, body);
                            }
                        }
                    })
                );
                // Also patch staff dashboard tasks if they exist
                const staffPatchResult = dispatch(
                    designApi.util.updateQueryData('getDesignTasks', {}, (draft) => {
                        if (draft?.data) {
                            const task = draft.data.find(t => t._id === id);
                            if (task) {
                                if (status) task.status = status;
                                Object.assign(task, body);
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                    staffPatchResult.undo();
                }
            },
            invalidatesTags: ['Tasks'],
        }),

        reviewTask: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}/review`,
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Tasks'],
        }),

        sendTaskToAdmin: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}/send-to-admin`,
                method: 'PUT',
            }),
            invalidatesTags: ['Tasks'],
        }),

        reassignTask: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}/reassign`,
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Tasks'],
        }),

        submitTask: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}/submit`,
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Tasks'],
        }),

        // ── Quotations ────────────────────────────────────────────────────────
        getQuotations: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/quotations?${query}`;
            },
            providesTags: ['Quotations'],
        }),

        // ── Staff & Analytics ─────────────────────────────────────────────────
        getStaff: builder.query({
            query: () => '/staff',
            providesTags: ['Staff'],
            keepUnusedDataFor: 600,
        }),

        getStaffAnalyticsOverview: builder.query({
            query: () => '/staff/analytics/overview',
            providesTags: ['Staff'],
            keepUnusedDataFor: 300,
        }),

        // ── Notifications ─────────────────────────────────────────────────────
        getNotifications: builder.query({
            query: (params = {}) => {
                const query = newSearchParams(params).toString();
                return `/notifications?${query}`;
            },
            providesTags: ['Notifications'],
        }),

        markNotificationRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT',
            }),
            // Optimistic update
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    designApi.util.updateQueryData('getNotifications', { limit: 10 }, (draft) => {
                        if (draft?.data) {
                            const notif = draft.data.find(n => n._id === id);
                            if (notif) notif.isRead = true;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // ── Material Requests ─────────────────────────────────────────────────
        approveMaterialRequest: builder.mutation({
            query: (id) => ({
                url: `/procurement/material-requests/${id}/approve-release`,
                method: 'PUT',
            }),
            invalidatesTags: ['MaterialRequests'],
        }),
    }),
});

function newSearchParams(params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => sp.append(key, val));
    return sp;
}

export const {
    useGetProjectsQuery,
    useGetProjectStatsQuery,
    usePerformProjectHandoffMutation,
    useGetDesignTasksQuery,
    useCreateDesignTaskMutation,
    useUpdateDesignTaskMutation,
    useReviewTaskMutation,
    useSendTaskToAdminMutation,
    useReassignTaskMutation,
    useSubmitTaskMutation,
    useGetQuotationsQuery,
    useGetStaffQuery,
    useGetStaffAnalyticsOverviewQuery,
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useApproveMaterialRequestMutation,
} = designApi;
