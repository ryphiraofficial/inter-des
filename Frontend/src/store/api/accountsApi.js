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

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
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
    tagTypes: ['Expenses', 'Payments', 'Stats', 'PendingCollections', 'Projects', 'Vendors', 'Invoices', 'Clients', 'Staff', 'Reports'],
    keepUnusedDataFor: 30,

    endpoints: (builder) => ({
        getExpenses: builder.query({
            query: (params = {}) => `/accounts/expenses?${newSearchParams(params)}`,
            providesTags: ['Expenses'],
        }),
        createExpense: builder.mutation({
            query: (body) => ({ url: '/accounts/expenses', method: 'POST', body }),
            invalidatesTags: ['Expenses', 'Stats'],
        }),
        updateExpense: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/accounts/expenses/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Expenses', 'Stats'],
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({ url: `/accounts/expenses/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Expenses', 'Stats'],
        }),
        getPayments: builder.query({
            query: (params = {}) => `/accounts/payments?${newSearchParams(params)}`,
            providesTags: ['Payments'],
        }),
        createPayment: builder.mutation({
            query: (body) => ({ url: '/accounts/payments', method: 'POST', body }),
            invalidatesTags: ['Payments', 'Stats', 'Invoices'],
        }),
        deletePayment: builder.mutation({
            query: (id) => ({ url: `/accounts/payments/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Payments', 'Stats', 'Invoices'],
        }),
        getAccountsStats: builder.query({
            query: (params = {}) => `/accounts/stats?${newSearchParams(params)}`,
            providesTags: ['Stats'],
            keepUnusedDataFor: 120,
        }),
        getPendingCollections: builder.query({
            query: () => '/accounts/projects/pending',
            providesTags: ['PendingCollections'],
        }),
        assignAccountsStaff: builder.mutation({
            query: (body) => ({ url: '/accounts/projects/assign', method: 'POST', body }),
            invalidatesTags: ['PendingCollections'],
        }),
        verifyPaymentAndRelease: builder.mutation({
            query: (body) => ({ url: '/accounts/projects/verify-payment', method: 'POST', body }),
            invalidatesTags: ['PendingCollections', 'Stats'],
        }),
        generateAdvanceInvoice: builder.mutation({
            query: (body) => ({ url: '/accounts/projects/invoice/advance', method: 'POST', body }),
            invalidatesTags: ['PendingCollections', 'Invoices'],
        }),
        clearProjectPayment: builder.mutation({
            query: (body) => ({ url: '/accounts/projects/clear', method: 'POST', body }),
            invalidatesTags: ['PendingCollections', 'Stats'],
        }),
        submitPaymentCollection: builder.mutation({
            query: (body) => ({ url: '/accounts/projects/collect', method: 'POST', body }),
            invalidatesTags: ['PendingCollections', 'Stats'],
        }),

        // ── Admin-level APIs used by accounts ───────────────────────────────────
        getVendors: builder.query({
            query: (params = {}) => `/vendors?${newSearchParams(params)}`,
            providesTags: ['Vendors'],
        }),
        createVendor: builder.mutation({
            query: (body) => ({ url: '/vendors', method: 'POST', body }),
            invalidatesTags: ['Vendors'],
        }),
        updateVendor: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/vendors/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Vendors'],
        }),
        deleteVendor: builder.mutation({
            query: (id) => ({ url: `/vendors/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Vendors'],
        }),
        
        getAccountsProjects: builder.query({
            query: (params = {}) => `/projects?${newSearchParams(params)}`,
            providesTags: ['Projects'],
        }),
        
        getAccountsInvoices: builder.query({
            query: (params = {}) => `/invoices?${newSearchParams(params)}`,
            providesTags: ['Invoices'],
        }),
        createAccountsInvoice: builder.mutation({
            query: (body) => ({ url: '/invoices', method: 'POST', body }),
            invalidatesTags: ['Invoices', 'Stats'],
        }),
        updateAccountsInvoicePayment: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/invoices/${id}/payment`, method: 'PUT', body }),
            invalidatesTags: ['Invoices', 'Stats'],
        }),
        deleteAccountsInvoice: builder.mutation({
            query: (id) => ({ url: `/invoices/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Invoices', 'Stats'],
        }),
        
        getAccountsClients: builder.query({
            query: (params = {}) => `/clients?${newSearchParams(params)}`,
            providesTags: ['Clients'],
        }),
        createAccountsClient: builder.mutation({
            query: (body) => ({ url: '/clients', method: 'POST', body }),
            invalidatesTags: ['Clients'],
        }),
        updateAccountsClient: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/clients/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Clients'],
        }),
        deleteAccountsClient: builder.mutation({
            query: (id) => ({ url: `/clients/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Clients'],
        }),

        getAccountsStaff: builder.query({
            query: (params = {}) => `/staff?${newSearchParams(params)}`,
            providesTags: ['Staff'],
        }),
        
        getAccountsReports: builder.query({
            query: () => '/reports/dashboard',
            providesTags: ['Reports'],
        }),
        getAccountsQuotations: builder.query({
            query: () => '/quotations',
            providesTags: ['Reports'],
        })
    }),
});

export const {
    useGetExpensesQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
    useGetPaymentsQuery,
    useCreatePaymentMutation,
    useDeletePaymentMutation,
    useGetAccountsStatsQuery,
    useGetPendingCollectionsQuery,
    useAssignAccountsStaffMutation,
    useVerifyPaymentAndReleaseMutation,
    useGenerateAdvanceInvoiceMutation,
    useClearProjectPaymentMutation,
    useSubmitPaymentCollectionMutation,
    useGetVendorsQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation,
    useGetAccountsProjectsQuery,
    useGetAccountsInvoicesQuery,
    useCreateAccountsInvoiceMutation,
    useUpdateAccountsInvoicePaymentMutation,
    useDeleteAccountsInvoiceMutation,
    useGetAccountsClientsQuery,
    useCreateAccountsClientMutation,
    useUpdateAccountsClientMutation,
    useDeleteAccountsClientMutation,
    useGetAccountsStaffQuery,
    useGetAccountsReportsQuery,
    useGetAccountsQuotationsQuery
} = accountsApi;
