import { apiCall } from '../core/apiClient';

export const meetingAPI = {
    // Admin — get all users for invitee picker
    getUsers: () => apiCall('/meetings/users'),

    // Get meetings (Admin → all, Staff → own)
    getAll: () => apiCall('/meetings'),

    // Get single meeting
    getById: (id) => apiCall(`/meetings/${id}`),

    // Admin — create meeting
    create: (data) => apiCall('/meetings', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // Admin — update meeting
    update: (id, data) => apiCall(`/meetings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // Admin — cancel meeting
    cancel: (id) => apiCall(`/meetings/${id}/cancel`, {
        method: 'PATCH'
    }),

    // Staff — mark meeting as read
    markRead: (id) => apiCall(`/meetings/${id}/read`, {
        method: 'PATCH'
    })
};
