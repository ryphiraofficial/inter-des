import { apiCall } from '../core/apiClient';

// Accounts APIs
export const accountsAPI = {
    getExpenses: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/accounts/expenses?${query}`);
    },

    createExpense: (data) => apiCall('/accounts/expenses', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    updateExpense: (id, data) => apiCall(`/accounts/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    deleteExpense: (id) => apiCall(`/accounts/expenses/${id}`, {
        method: 'DELETE'
    }),

    getPayments: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/accounts/payments?${query}`);
    },

    createPayment: (data) => apiCall('/accounts/payments', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getProjectFinancials: (projectId) => apiCall(`/accounts/project/${projectId}/financials`),

    getStats: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/accounts/stats?${query}`);
    },

    // Payment Collection Queue
    getPendingCollections: () => apiCall('/accounts/projects/pending'),

    assignStaff: (data) => apiCall('/accounts/projects/assign', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    verifyPayment: (data) => apiCall('/accounts/projects/verify-payment', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    generateAdvanceInvoice: (data) => apiCall('/accounts/projects/invoice/advance', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
