import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://inter-des-backend.onrender.com/api';

// Helper to serialize params
function newSearchParams(params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) sp.append(key, val);
    });
    return sp;
}

// ──────────────────────────────────────────────────────────────────────────────
// Admin RTK Query API Service
// ──────────────────────────────────────────────────────────────────────────────
export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                headers.set('Authorization', `Bearer ${token}`);
            }
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
            return headers;
        },
    }),
    tagTypes: [
        'Dashboard', 'Quotations', 'Invoices', 'Projects', 'Tasks', 
        'PurchaseOrders', 'Inventory', 'POInventory', 'Clients', 
        'Users', 'Staff', 'Settings', 'Notifications', 'Approvals'
    ],
    keepUnusedDataFor: 30,

    endpoints: (builder) => ({
        // ── Dashboard & Reports ───────────────────────────────────────────────
        getDashboardStats: builder.query({
            query: () => '/reports/dashboard',
            providesTags: ['Dashboard'],
            keepUnusedDataFor: 120,
        }),
        getRevenueData: builder.query({
            query: (params = {}) => `/reports/revenue?${newSearchParams(params)}`,
            providesTags: ['Dashboard'],
            keepUnusedDataFor: 120,
        }),

        // ── Quotations ────────────────────────────────────────────────────────
        getQuotations: builder.query({
            query: (params = {}) => `/quotations?${newSearchParams(params)}`,
            providesTags: ['Quotations'],
        }),
        getQuotationById: builder.query({
            query: (id) => `/quotations/${id}`,
            providesTags: (result, error, id) => [{ type: 'Quotations', id }],
        }),
        createQuotation: builder.mutation({
            query: (body) => ({ url: `/quotations`, method: 'POST', body }),
            invalidatesTags: ['Quotations', 'Dashboard'],
        }),
        updateQuotation: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/quotations/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Quotations', 'Dashboard'],
        }),
        approveQuotation: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/quotations/${id}/approve`, method: 'PUT', body }),
            invalidatesTags: ['Quotations', 'Projects', 'Dashboard'],
        }),
        deleteQuotation: builder.mutation({
            query: (id) => ({ url: `/quotations/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Quotations', 'Dashboard'],
        }),

        // ── Invoices ──────────────────────────────────────────────────────────
        getInvoices: builder.query({
            query: (params = {}) => `/invoices?${newSearchParams(params)}`,
            providesTags: ['Invoices'],
        }),
        createInvoice: builder.mutation({
            query: (body) => ({ url: '/invoices', method: 'POST', body }),
            invalidatesTags: ['Invoices', 'Dashboard'],
        }),
        updateInvoice: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/invoices/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Invoices', 'Dashboard'],
        }),
        deleteInvoice: builder.mutation({
            query: (id) => ({ url: `/invoices/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Invoices', 'Dashboard'],
        }),
        recordInvoicePayment: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/invoices/${id}/payment`, method: 'PUT', body }),
            invalidatesTags: ['Invoices', 'Dashboard'],
        }),

        // ── Projects ──────────────────────────────────────────────────────────
        getProjects: builder.query({
            query: (params = {}) => `/projects?${newSearchParams(params)}`,
            providesTags: ['Projects'],
        }),
        getProjectById: builder.query({
            query: (id) => `/projects/${id}`,
            providesTags: (result, error, id) => [{ type: 'Projects', id }],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/projects/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Projects', 'Dashboard'],
        }),
        deleteProject: builder.mutation({
            query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Projects', 'Dashboard'],
        }),

        // ── Tasks ─────────────────────────────────────────────────────────────
        getTasks: builder.query({
            query: (params = {}) => `/tasks?${newSearchParams(params)}`,
            providesTags: ['Tasks'],
        }),
        getTaskById: builder.query({
            query: (id) => `/tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Tasks', id }],
        }),
        createTask: builder.mutation({
            query: (body) => ({ url: `/tasks`, method: 'POST', body }),
            invalidatesTags: ['Tasks'],
        }),
        updateTask: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/tasks/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Tasks'],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Tasks'],
        }),
        salesApproveTask: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/tasks/${id}/sales-approve`, method: 'PUT', body }),
            invalidatesTags: ['Tasks'],
        }),
        adminReviewTask: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/tasks/${id}/admin-review`, method: 'PUT', body }),
            invalidatesTags: ['Tasks'],
        }),
        getSiteVisitsByTask: builder.query({
            query: (taskId) => `/site-visits/task/${taskId}`,
            providesTags: ['Tasks'],
        }),
        getTaskComments: builder.query({
            query: (id) => `/tasks/${id}/comments`,
            providesTags: (result, error, id) => [{ type: 'Tasks', id: `COMMENTS_${id}` }],
        }),
        addTaskComment: builder.mutation({
            query: ({ id, content }) => ({ url: `/tasks/${id}/comments`, method: 'POST', body: { content } }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id: `COMMENTS_${id}` }],
        }),
        addTaskDailyUpdate: builder.mutation({
            query: ({ id, payload }) => ({ url: `/tasks/${id}/daily-updates`, method: 'POST', body: payload }),
            invalidatesTags: ['Tasks'],
        }),

        // ── Purchase Orders ───────────────────────────────────────────────────
        getPurchaseOrders: builder.query({
            query: (params = {}) => `/purchase-orders?${newSearchParams(params)}`,
            providesTags: ['PurchaseOrders'],
        }),
        getPurchaseOrderStats: builder.query({
            query: () => '/purchase-orders/stats',
            providesTags: ['PurchaseOrders'],
            keepUnusedDataFor: 120,
        }),
        createPurchaseOrder: builder.mutation({
            query: (body) => ({ url: `/purchase-orders`, method: 'POST', body }),
            invalidatesTags: ['PurchaseOrders'],
        }),
        updatePurchaseOrder: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/purchase-orders/${id}`, method: 'PUT', body }),
            invalidatesTags: ['PurchaseOrders'],
        }),
        deletePurchaseOrder: builder.mutation({
            query: (id) => ({ url: `/purchase-orders/${id}`, method: 'DELETE' }),
            invalidatesTags: ['PurchaseOrders'],
        }),
        updatePOStatus: builder.mutation({
            query: ({ id, status }) => ({ url: `/purchase-orders/${id}/status`, method: 'PUT', body: { status } }),
            invalidatesTags: ['PurchaseOrders', 'POInventory'],
        }),
        markPOReceived: builder.mutation({
            query: (id) => ({ url: `/purchase-orders/${id}/receive`, method: 'PUT' }),
            invalidatesTags: ['PurchaseOrders', 'POInventory', 'Inventory'],
        }),

        // ── PO Inventory ──────────────────────────────────────────────────────
        getPOInventory: builder.query({
            query: (params = {}) => `/po-inventory?${newSearchParams(params)}`,
            providesTags: ['POInventory'],
        }),
        createPOInventory: builder.mutation({
            query: (body) => ({ url: `/po-inventory`, method: 'POST', body }),
            invalidatesTags: ['POInventory'],
        }),

        // ── Inventory ─────────────────────────────────────────────────────────
        getInventory: builder.query({
            query: (params = {}) => `/inventory?${newSearchParams(params)}`,
            providesTags: ['Inventory'],
        }),
        createInventory: builder.mutation({
            query: (body) => ({ url: `/inventory`, method: 'POST', body }),
            invalidatesTags: ['Inventory'],
        }),
        updateInventory: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/inventory/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Inventory'],
        }),
        deleteInventory: builder.mutation({
            query: (id) => ({ url: `/inventory/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Inventory'],
        }),

        // ── Clients ───────────────────────────────────────────────────────────
        getClients: builder.query({
            query: (params = {}) => `/clients?${newSearchParams(params)}`,
            providesTags: ['Clients'],
        }),
        createClient: builder.mutation({
            query: (body) => ({ url: `/clients`, method: 'POST', body }),
            invalidatesTags: ['Clients'],
        }),
        updateClient: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/clients/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Clients'],
        }),
        deleteClient: builder.mutation({
            query: (id) => ({ url: `/clients/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Clients'],
        }),

        // ── Users & Staff ─────────────────────────────────────────────────────
        getUsers: builder.query({
            query: (params = {}) => `/users?${newSearchParams(params)}`,
            providesTags: ['Users'],
        }),
        createUser: builder.mutation({
            query: (body) => ({ url: `/users`, method: 'POST', body }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Users'],
        }),
        getStaff: builder.query({
            query: (params = {}) => `/staff?${newSearchParams(params)}`,
            providesTags: ['Staff'],
        }),
        getStaffAnalyticsOverview: builder.query({
            query: () => '/staff/analytics/overview',
            providesTags: ['Staff'],
            keepUnusedDataFor: 120,
        }),
        createStaff: builder.mutation({
            query: (body) => ({ url: `/staff`, method: 'POST', body }),
            invalidatesTags: ['Staff'],
        }),
        updateStaff: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/staff/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Staff'],
        }),
        deleteStaff: builder.mutation({
            query: (id) => ({ url: `/staff/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Staff'],
        }),
        getStaffSalary: builder.query({
            query: (id) => `/staff/${id}/salary`,
            providesTags: (result, error, id) => [{ type: 'Staff', id }],
        }),
        updateStaffSalary: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/staff/${id}/salary`, method: 'PUT', body }),
            invalidatesTags: ['Staff'],
        }),
        getStaffAnalytics: builder.query({
            query: (id) => `/staff/${id}/analytics`,
            providesTags: (result, error, id) => [{ type: 'Staff', id }],
        }),

        // ── Settings ──────────────────────────────────────────────────────────
        getSettings: builder.query({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),
        updateSettings: builder.mutation({
            query: (body) => ({ url: '/settings', method: 'PUT', body }),
            invalidatesTags: ['Settings'],
        }),

        // ── Approvals (Design/Production/Procurement) ─────────────────────────
        getDesignApprovals: builder.query({
            query: () => '/tasks?status=Pending Admin Review,Pending Procurement Admin Review',
            providesTags: ['Approvals'],
        }),
        getCompletedProductionProjects: builder.query({
            query: () => '/production-management/admin/completed-projects',
            providesTags: ['Approvals', 'Projects'],
        }),
        getProductionApprovals: builder.query({
            query: () => '/production-management/admin/completed-projects',
            providesTags: ['Approvals'],
        }),
        approveProduction: builder.mutation({
            query: ({ id, status, adminRemarks }) => ({ 
                url: `/production-management/projects/${id}/admin-approve`, 
                method: 'PUT', 
                body: { status, adminRemarks } 
            }),
            invalidatesTags: ['Approvals', 'Projects'],
        }),
        getProcurementApprovals: builder.query({
            query: () => '/tasks/procurement-approvals',
            providesTags: ['Approvals'],
        }),
        adminApproveProcurement: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/procurement/admin-approve/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Approvals'],
        }),
        // ── Notifications ─────────────────────────────────────────────────────
        getNotifications: builder.query({
            query: (params = {}) => `/notifications?${newSearchParams(params)}`,
            providesTags: ['Notifications'],
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
            invalidatesTags: ['Notifications'],
        }),
        markAllNotificationsRead: builder.mutation({
            query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
            invalidatesTags: ['Notifications'],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({ url: `/notifications/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Notifications'],
        }),

        // ── Misc ──────────────────────────────────────────────────────────────
        getProductionManagers: builder.query({
            query: () => '/procurement/production-managers',
            providesTags: ['Staff'],
        }),
        getProcurementManagers: builder.query({
            query: () => '/procurement/managers',
            providesTags: ['Staff'],
        }),
        getMaterialRequests: builder.query({
            query: (params = {}) => `/procurement/material-requests?${newSearchParams(params)}`,
            providesTags: ['Approvals'], // Reusing approvals tag for admin
        }),
        accountsCollectPayment: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/projects/${id}/accounts-collect`, method: 'PUT', body }),
            invalidatesTags: ['Projects', 'Approvals'],
        }),
        adminClearPaymentToProcurement: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/projects/${id}/admin-clear-payment`, method: 'PUT', body }),
            invalidatesTags: ['Projects', 'Approvals', 'Tasks'],
        }),
        getMilestones: builder.query({
            query: () => '/admin/milestones',
            providesTags: ['Dashboard', 'Projects', 'Tasks', 'Staff'],
        })
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetRevenueDataQuery,
    useGetQuotationsQuery,
    useGetQuotationByIdQuery,
    useCreateQuotationMutation,
    useUpdateQuotationMutation,
    useApproveQuotationMutation,
    useDeleteQuotationMutation,
    useGetInvoicesQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
    useRecordInvoicePaymentMutation,
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetTasksQuery,
    useGetTaskByIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useGetTaskCommentsQuery,
    useAddTaskCommentMutation,
    useAddTaskDailyUpdateMutation,
    useSalesApproveTaskMutation,
    useAdminReviewTaskMutation,
    useGetSiteVisitsByTaskQuery,
    useGetPurchaseOrdersQuery,
    useGetPurchaseOrderStatsQuery,
    useCreatePurchaseOrderMutation,
    useUpdatePurchaseOrderMutation,
    useDeletePurchaseOrderMutation,
    useUpdatePOStatusMutation,
    useMarkPOReceivedMutation,
    useGetPOInventoryQuery,
    useCreatePOInventoryMutation,
    useGetInventoryQuery,
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
    useGetClientsQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetStaffQuery,
    useGetStaffAnalyticsOverviewQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
    useGetStaffSalaryQuery,
    useUpdateStaffSalaryMutation,
    useGetStaffAnalyticsQuery,
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useGetDesignApprovalsQuery,
    useGetCompletedProductionProjectsQuery,
    useGetProductionApprovalsQuery,
    useApproveProductionMutation,
    useGetProcurementApprovalsQuery,
    useAdminApproveProcurementMutation,
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation,
    useGetProductionManagersQuery,
    useGetProcurementManagersQuery,
    useGetMaterialRequestsQuery,
    useAccountsCollectPaymentMutation,
    useAdminClearPaymentToProcurementMutation,
    useGetMilestonesQuery
} = adminApi;
