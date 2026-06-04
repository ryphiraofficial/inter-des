import React from 'react';

const CompletionDetails = ({ project }) => {
    if (!project) return null;

    return (
        <div style={{ marginBottom: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Project Details</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{project.projectName}</div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#475569' }}>
                <div><strong>Client:</strong> {project.clientId?.name || 'N/A'}</div>
                <div><strong>Type:</strong> {project.projectType}</div>
                <div><strong>ID:</strong> {project._id.substring(0,8)}</div>
            </div>
        </div>
    );
};

export default CompletionDetails;
