import React from 'react';
import { CheckCircle } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';

const SubmissionsTab = ({ tasks }) => {
    const finalizedStatuses = ['Approved', 'Completed', 'Pushed to Procurement', 'Pending Sales Review', 'Sales Approved', 'Pending Admin Review', 'Admin Rejected'];
    
    const getStatusStyle = (status) => {
        const map = {
            'Pending Sales Review': { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' },
            'Sales Approved': { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
            'Pending Admin Review': { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
            'Admin Rejected': { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
            'Pushed to Procurement': { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' },
            'Approved': { background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' },
        };
        return map[status] || { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
    };
    
    const getStatusLabel = (status) => ({
        'Pushed to Procurement': 'Procurement Ready',
        'Pending Sales Review': 'Sales Review',
        'Pending Admin Review': 'With Superadmin',
    }[status] || status);

    const filteredTasks = tasks.filter(t => finalizedStatuses.includes(t.status));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#ecfdf5', color: '#10b981', padding: '8px', borderRadius: '10px' }}>
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', fontWeight: 800 }}>Finalized Designs & Approvals</strong>
                            <span style={{ display: 'block', marginTop: '2px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Track your designs through Manager, Sales, and Superadmin review stages.</span>
                        </div>
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0, textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Details</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approved Date</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Designs</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                                        No designs in pipeline yet.
                                    </td>
                                </tr>
                            )}
                            {filteredTasks.map(task => (
                                <tr key={task._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <strong style={{ color: '#1e293b', fontSize: '0.95rem', display: 'block', fontWeight: 700 }}>{task.title}</strong>
                                        {(task.quotation?.projectName || task.project?.projectName) && (
                                            <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600, marginTop: '4px' }}>
                                                {task.quotation?.projectName || task.project?.projectName}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.88rem', color: '#475569', fontWeight: 500 }}>
                                        {new Date(task.submissions?.[task.submissions.length - 1]?.submittedAt || task.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            ...getStatusStyle(task.status)
                                        }}>
                                            {getStatusLabel(task.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '180px', padding: '4px 0' }}>
                                            {task.submissions?.[task.submissions.length - 1]?.files?.map((f, idx) => (
                                                <a key={idx} href={f.url?.startsWith('http') ? f.url : `${BASE_IMAGE_URL}${f.url}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', flexShrink: 0 }}>
                                                    <img 
                                                        src={f.url?.startsWith('http') ? f.url : `${BASE_IMAGE_URL}${f.url}`} 
                                                        alt="Design" 
                                                        style={{ 
                                                            width: '44px', 
                                                            height: '44px', 
                                                            borderRadius: '8px', 
                                                            objectFit: 'cover', 
                                                            border: '1px solid #e2e8f0',
                                                            transition: 'transform 0.2s'
                                                        }}
                                                        onError={e => { e.target.src = 'https://via.placeholder.com/44?text=File'; }} 
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                                        {task.submissions?.[task.submissions.length - 1]?.managerFeedback || 'No remarks.'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubmissionsTab;
