import { API_BASE_URL } from '../../../../config/constants';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

const handle = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

export const getBrands = () =>
    fetch(`${API_BASE_URL}/design/edge-bands/brands`, { headers: authHeaders() }).then(handle);

export const getProjects = () =>
    fetch(`${API_BASE_URL}/projects`, { headers: authHeaders() }).then(handle);

export const getTasks = () =>
    fetch(`${API_BASE_URL}/tasks`, { headers: authHeaders() }).then(handle);

export const searchEdgeBands = (brand, code) => {
    const params = new URLSearchParams({ brand, code });
    return fetch(`${API_BASE_URL}/design/edge-bands/search?${params}`, { headers: authHeaders() }).then(handle);
};

export const getEdgeBandById = (id) =>
    fetch(`${API_BASE_URL}/design/edge-bands/${id}`, { headers: authHeaders() }).then(handle);

export const saveSelections = (projectId, taskId, items) =>
    fetch(`${API_BASE_URL}/design/edge-bands/selections`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ projectId, taskId, items })
    }).then(handle);

export const getProjectSelections = (projectId) =>
    fetch(`${API_BASE_URL}/design/edge-bands/selections/${projectId}`, { headers: authHeaders() }).then(handle);

export const deleteSelection = (id) =>
    fetch(`${API_BASE_URL}/design/edge-bands/selections/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    }).then(handle);

export const submitRequest = (projectId, taskId, items) =>
    fetch(`${API_BASE_URL}/design/edge-bands/requests`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ projectId, taskId, items })
    }).then(handle);

export const getRequests = (params = {}) => {
    const qp = new URLSearchParams(params);
    return fetch(`${API_BASE_URL}/design/edge-bands/requests?${qp}`, { headers: authHeaders() }).then(handle);
};

export const managerReviewRequest = (id, payload) =>
    fetch(`${API_BASE_URL}/design/edge-bands/requests/${id}/manager-review`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload)
    }).then(handle);

export const adminReviewRequest = (id, payload) =>
    fetch(`${API_BASE_URL}/design/edge-bands/requests/${id}/admin-review`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload)
    }).then(handle);

// ── Procurement Queue ──────────────────────────────────────────
export const sendToProcurementQueue = (edgeBandRequestId) =>
    fetch(`${API_BASE_URL}/design/edge-bands/procurement-queue`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ edgeBandRequestId })
    }).then(handle);

export const getProcurementQueue = (params = {}) => {
    const qp = new URLSearchParams(params);
    return fetch(`${API_BASE_URL}/design/edge-bands/procurement-queue?${qp}`, { headers: authHeaders() }).then(handle);
};

export const selectProcurementCandidate = (groupId, selectedEdgeBandId) =>
    fetch(`${API_BASE_URL}/design/edge-bands/procurement-queue/${groupId}/select`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ selectedEdgeBandId })
    }).then(handle);

export const markGroupNeedsPurchase = (groupId) =>
    fetch(`${API_BASE_URL}/design/edge-bands/procurement-queue/${groupId}/needs-purchase`, {
        method: 'PATCH',
        headers: authHeaders()
    }).then(handle);

export const assignProcurementStaff = (id, assignedTo) =>
    fetch(`${API_BASE_URL}/design/edge-bands/procurement-queue/${id}/assign`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ assignedTo })
    }).then(handle);

export const getProcurementStaff = () =>
    fetch(`${API_BASE_URL}/users?role=Procurement%20Staff`, { headers: authHeaders() }).then(handle);

