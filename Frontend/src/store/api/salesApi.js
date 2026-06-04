import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://inter-des-backend.onrender.com/api';

function newSearchParams(params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) sp.append(key, val);
    });
    return sp;
}

export const salesApi = createApi({
    reducerPath: 'salesApi',
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
    tagTypes: ['SalesTasks', 'SalesClients', 'SalesQuotations', 'SalesNotifications', 'SiteVisits'],
    keepUnusedDataFor: 30,

    endpoints: (builder) => ({
        // ── Tasks ─────────────────────────────────────────────────────────────
        getSalesTasks: builder.query({
            query: (params = {}) => `/tasks?${newSearchParams(params)}`,
            providesTags: ['SalesTasks'],
        }),
        createSalesTask: builder.mutation({
            query: (body) => ({ url: '/tasks', method: 'POST', body }),
            invalidatesTags: ['SalesTasks'],
        }),
        updateSalesTask: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/tasks/${id}`, method: 'PUT', body }),
            invalidatesTags: ['SalesTasks'],
        }),
        approveSalesTask: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/tasks/${id}/sales-approve`, method: 'PUT', body }),
            invalidatesTags: ['SalesTasks'],
        }),

        // ── Clients ───────────────────────────────────────────────────────────
        getSalesClients: builder.query({
            query: (params = {}) => `/clients?${newSearchParams(params)}`,
            providesTags: ['SalesClients'],
        }),
        createSalesClient: builder.mutation({
            query: (body) => ({ url: '/clients', method: 'POST', body }),
            invalidatesTags: ['SalesClients'],
        }),
        updateSalesClient: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/clients/${id}`, method: 'PUT', body }),
            invalidatesTags: ['SalesClients'],
        }),

        // ── Quotations ────────────────────────────────────────────────────────
        getSalesQuotations: builder.query({
            query: (params = {}) => `/quotations?${newSearchParams(params)}`,
            providesTags: ['SalesQuotations'],
        }),
        getSalesQuotationById: builder.query({
            query: (id) => `/quotations/${id}`,
            providesTags: (result, error, id) => [{ type: 'SalesQuotations', id }],
        }),
        createSalesQuotation: builder.mutation({
            query: (body) => ({ url: '/quotations', method: 'POST', body }),
            invalidatesTags: ['SalesQuotations'],
        }),
        updateSalesQuotation: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/quotations/${id}`, method: 'PUT', body }),
            invalidatesTags: ['SalesQuotations'],
        }),
        deleteSalesQuotation: builder.mutation({
            query: (id) => ({ url: `/quotations/${id}`, method: 'DELETE' }),
            invalidatesTags: ['SalesQuotations'],
        }),

        // ── Notifications ─────────────────────────────────────────────────────
        getSalesNotifications: builder.query({
            query: (params = {}) => `/notifications?${newSearchParams(params)}`,
            providesTags: ['SalesNotifications'],
        }),
        markSalesNotificationRead: builder.mutation({
            query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
            invalidatesTags: ['SalesNotifications'],
        }),
        markAllSalesNotificationsRead: builder.mutation({
            query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
            invalidatesTags: ['SalesNotifications'],
        }),
        deleteSalesNotification: builder.mutation({
            query: (id) => ({ url: `/notifications/${id}`, method: 'DELETE' }),
            invalidatesTags: ['SalesNotifications'],
        }),

        // ── Site Visits ───────────────────────────────────────────────────────
        getSiteVisits: builder.query({
            query: (params = {}) => `/site-visits?${newSearchParams(params)}`,
            providesTags: ['SiteVisits'],
        }),
        createSiteVisit: builder.mutation({
            query: (body) => ({ url: '/site-visits', method: 'POST', body }),
            invalidatesTags: ['SiteVisits', 'SalesTasks'],
        }),
        updateSiteVisit: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/site-visits/${id}`, method: 'PUT', body }),
            invalidatesTags: ['SiteVisits', 'SalesTasks'],
        }),

        // ── Inventory ─────────────────────────────────────────────────────────
        getSalesInventory: builder.query({
            query: (params = {}) => `/inventory?${newSearchParams(params)}`,
            providesTags: ['SalesInventory'],
        }),
    }),
});

export const {
    useGetSalesTasksQuery,
    useCreateSalesTaskMutation,
    useUpdateSalesTaskMutation,
    useApproveSalesTaskMutation,
    useGetSalesClientsQuery,
    useCreateSalesClientMutation,
    useUpdateSalesClientMutation,
    useGetSalesQuotationsQuery,
    useGetSalesQuotationByIdQuery,
    useCreateSalesQuotationMutation,
    useUpdateSalesQuotationMutation,
    useDeleteSalesQuotationMutation,
    useGetSalesNotificationsQuery,
    useMarkSalesNotificationReadMutation,
    useMarkAllSalesNotificationsReadMutation,
    useDeleteSalesNotificationMutation,
    useGetSiteVisitsQuery,
    useCreateSiteVisitMutation,
    useUpdateSiteVisitMutation,
    useGetSalesInventoryQuery
} = salesApi;
