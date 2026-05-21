import { apiCall } from '../core/apiClient';

// Engineer Portal APIs (PE / SE / SS)
export const engineerAPI = {
    getDashboard:   () => apiCall('/production-management/engineer/dashboard'),
    getMyProjects:  () => apiCall('/production-management/engineer/projects'),
    getMyTasks:     (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiCall(`/production-management/engineer/tasks?${query}`);
    },
    getTransferredTasks: (params = {}) => {
        const query = new URLSearchParams({ ...params, transferred: 'true' }).toString();
        return apiCall(`/production-management/engineer/tasks?${query}`);
    },
    getTaskById:    (id) => apiCall(`/production-management/tasks/${id}`),
    updateStatus:   (id, status, note, images) => apiCall(`/production-management/tasks/${id}/update-status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note, images })
    }),
    addComment:     (id, text) => apiCall(`/production-management/tasks/${id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ text })
    }),
    createSubtask:  (data) => apiCall('/production-management/engineer/subtask', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    createTask:     (data) => apiCall('/production-management/tasks/create', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    assignTask:     (taskId, assignedTo) => apiCall(`/production-management/tasks/${taskId}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ assignedTo })
    }),
    getProjectById:  (id) => apiCall(`/production-management/projects/${id}`),
    getProjectTasks: (id) => apiCall(`/production-management/tasks/project/${id}`),
    getActivity:     (id) => apiCall(`/production-management/projects/${id}/activity`),
    getSiteTeam:     () => apiCall('/production-management/team/site'),
    getSupervisors:  () => apiCall('/production-management/team/supervisors'),
    requestReplacement: (projectId, data) => apiCall(`/production-management/projects/${projectId}/replacement-request`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
