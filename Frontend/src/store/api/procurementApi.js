import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://inter-des-backend.onrender.com/api';

// ──────────────────────────────────────────────────────────────────────────────
// Procurement RTK Query API Service
// ──────────────────────────────────────────────────────────────────────────────
export const procurementApi = createApi({
    reducerPath: 'procurementApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['MaterialRequests', 'Vendors', 'VendorPurchases', 'ProcurementStats', 'Tasks', 'Projects'],
    keepUnusedDataFor: 30, // Default cache time

    endpoints: (builder) => ({
        // ── Material Requests ─────────────────────────────────────────────────
        getMaterialRequests: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/procurement/material-requests?${query}`;
            },
            providesTags: ['MaterialRequests'],
            keepUnusedDataFor: 30,
        }),

        createMaterialRequest: builder.mutation({
            query: (body) => ({
                url: '/procurement/material-requests',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MaterialRequests', 'ProcurementStats'],
        }),

        updateMaterialRequest: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/procurement/material-requests/${id}`,
                method: 'PUT',
                body,
            }),
            async onQueryStarted({ id, status, ...body }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    procurementApi.util.updateQueryData('getMaterialRequests', { limit: 500, sort: '-createdAt' }, (draft) => {
                        if (draft?.data) {
                            const req = draft.data.find(r => r._id === id);
                            if (req) {
                                if (status) req.status = status;
                                Object.assign(req, body);
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['MaterialRequests', 'ProcurementStats'],
        }),

        assignStaffToRequest: builder.mutation({
            query: ({ id, staffId }) => ({
                url: `/procurement/material-requests/${id}/assign`,
                method: 'PUT',
                body: { staffId },
            }),
            invalidatesTags: ['MaterialRequests'],
        }),

        // ── Tasks ─────────────────────────────────────────────────────────────
        getTasks: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/tasks?${query}`;
            },
            providesTags: ['Tasks'],
            keepUnusedDataFor: 30,
        }),
        
        getStaffTasks: builder.query({
            query: () => '/procurement/staff-tasks',
            providesTags: ['Tasks'],
            keepUnusedDataFor: 30,
        }),

        updateTask: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body,
            }),
            async onQueryStarted({ id, status, ...body }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    procurementApi.util.updateQueryData('getTasks', { status: 'Pushed to Procurement,Assigned to Procurement,Pending Manager Review,Pending Procurement Admin Review,Procurement Approved', limit: 500 }, (draft) => {
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
                }
            },
            invalidatesTags: ['Tasks', 'ProcurementStats'],
        }),

        // ── Vendors ───────────────────────────────────────────────────────────
        getVendors: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/vendors?${query}`;
            },
            providesTags: ['Vendors'],
            keepUnusedDataFor: 600, // Vendors list changes rarely
        }),

        createVendor: builder.mutation({
            query: (body) => ({
                url: '/vendors',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Vendors'],
        }),

        getVendorPurchaseHistory: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams(params).toString();
                return `/procurement/vendor-purchases?${query}`;
            },
            providesTags: ['VendorPurchases'],
            keepUnusedDataFor: 60,
        }),

        createVendorPurchase: builder.mutation({
            query: (body) => ({
                url: '/procurement/vendor-purchases',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['VendorPurchases', 'MaterialRequests', 'ProcurementStats'],
        }),
        
        compareVendorPrices: builder.mutation({
            query: (items) => ({
                url: '/procurement/vendor-purchases/compare',
                method: 'POST',
                body: { items }
            }),
        }),

        // ── Stats & Staff ─────────────────────────────────────────────────────
        getProcurementStats: builder.query({
            query: () => '/procurement/stats',
            providesTags: ['ProcurementStats'],
            keepUnusedDataFor: 120,
        }),

        getProcurementStaff: builder.query({
            query: () => '/procurement/staff',
            keepUnusedDataFor: 600,
        }),

        getProjectsByStage: builder.query({
            query: (stage = 'Procurement') => `/projects/stage/${stage}`,
            providesTags: ['Projects'],
            keepUnusedDataFor: 60,
        }),

        // ── Extensions ────────────────────────────────────────────────────────
        requestTimeExtension: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/procurement/material-requests/${id}/time-extension`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MaterialRequests', 'Tasks'],
        }),

        respondTimeExtension: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/procurement/material-requests/${id}/time-extension`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['MaterialRequests', 'Tasks'],
        }),
    }),
});

export const {
    useGetMaterialRequestsQuery,
    useCreateMaterialRequestMutation,
    useUpdateMaterialRequestMutation,
    useAssignStaffToRequestMutation,
    useGetTasksQuery,
    useGetStaffTasksQuery,
    useUpdateTaskMutation,
    useGetVendorsQuery,
    useCreateVendorMutation,
    useGetVendorPurchaseHistoryQuery,
    useLazyGetVendorPurchaseHistoryQuery,
    useCreateVendorPurchaseMutation,
    useCompareVendorPricesMutation,
    useGetProcurementStatsQuery,
    useGetProcurementStaffQuery,
    useGetProjectsByStageQuery,
    useRequestTimeExtensionMutation,
    useRespondTimeExtensionMutation,
} = procurementApi;
