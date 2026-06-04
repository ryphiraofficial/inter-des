export const STATUS_CONFIG = {
    upcoming:  { label: 'Upcoming',  color: '#3b82f6', bg: '#eff6ff' },
    ongoing:   { label: 'Live Now',  color: '#10b981', bg: '#d1fae5' },
    completed: { label: 'Completed', color: '#64748b', bg: '#f1f5f9' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' }
};

export const formatDateTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

export const toInputDateTime = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const computeStatus = (m) => {
    if (m.status === 'cancelled') return 'cancelled';
    const now = Date.now();
    const start = new Date(m.scheduledAt).getTime();
    const end = start + m.duration * 60000;
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
};

export const DEPARTMENTS = [
    { label: 'All', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Sales', value: 'sales' },
    { label: 'Design', value: 'design' },
    { label: 'Procurement', value: 'procurement' },
    { label: 'Production & Site', value: 'production|engineer|site|supervisor|manager' },
    { label: 'Accounts', value: 'accounts' }
];
