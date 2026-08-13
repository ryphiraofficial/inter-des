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
