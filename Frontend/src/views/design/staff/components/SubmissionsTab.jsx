import React from 'react';
import { CheckCircle } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const SubmissionsTab = ({ tasks }) => {
    const finalizedStatuses = ['Approved', 'Completed', 'Pushed to Procurement', 'Pending Sales Review', 'Sales Approved', 'Pending Admin Review', 'Admin Rejected'];
    
    const getStatusStyle = (status) => {
        const map = {
            'Pending Sales Review': { background: '#dbeafe', color: '#1e40af' },
            'Sales Approved': { background: '#f0fdf4', color: '#15803d' },
            'Pending Admin Review': { background: '#fef3c7', color: '#92400e' },
            'Admin Rejected': { background: '#fee2e2', color: '#b91c1c' },
            'Pushed to Procurement': { background: '#dcfce7', color: '#15803d' },
            'Approved': { background: '#f0f9ff', color: '#0369a1' },
        };
        return map[status] || { background: '#f1f5f9', color: '#475569' };
    };
    
    const getStatusLabel = (status) => ({
        'Pushed to Procurement': 'Procurement Ready',
        'Pending Sales Review': 'Sales Review',
        'Pending Admin Review': 'With Superadmin',
    }[status] || status);

    const filteredTasks = tasks.filter(t => finalizedStatuses.includes(t.status));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="project-detail-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="pd-header" style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="pd-title">
                        <strong style={{ color: '#15803d' }}><CheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Finalized Designs & Approvals</strong>
                        <span style={{ display: 'block', marginTop: '4px' }}>Track your designs through Manager, Sales, and Superadmin review.</span>
                    </div>
                </div>
                <table className="tag-table" style={{ margin: 0 }}>
                    <thead><tr><th>Task Title</th><th>Approved Date</th><th>Status</th><th>Designs</th><th>Notes</th></tr></thead>
                    <tbody>
                        {filteredTasks.length === 0 && <tr><td colSpan="5" className="empty-mini">No designs in pipeline yet.</td></tr>}
                        {filteredTasks.map(task => (
                            <tr key={task._id}>
                                <td><strong>{task.title}</strong>{task.quotation && <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600 }}>{task.quotation.projectName}</div>}</td>
                                <td>{new Date(task.submissions?.[task.submissions.length - 1]?.submittedAt || task.updatedAt).toLocaleDateString()}</td>
                                <td><span className="status-pill" style={getStatusStyle(task.status)}>{getStatusLabel(task.status)}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', maxWidth: '150px', padding: '5px 0' }}>
                                        {task.submissions?.[task.submissions.length - 1]?.files?.map((f, idx) => (
                                            <a key={idx} href={f.url?.startsWith('http') ? f.url : `${BASE_IMAGE_URL}${f.url}`} target="_blank" rel="noreferrer">
                                                <img src={f.url?.startsWith('http') ? f.url : `${BASE_IMAGE_URL}${f.url}`} alt="Design" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                                    onError={e => { e.target.src = 'https://via.placeholder.com/40?text=File'; }} />
                                            </a>
                                        ))}
                                    </div>
                                </td>
                                <td>{task.submissions?.[task.submissions.length - 1]?.managerFeedback || 'Great work!'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubmissionsTab;
