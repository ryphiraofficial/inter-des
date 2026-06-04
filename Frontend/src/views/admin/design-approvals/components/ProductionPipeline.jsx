import React, { useState } from 'react';
import { 
    CheckCircle, XCircle, Wrench, User, Calendar, 
    FileText, AlertCircle, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { ApproveDialog, RejectDialog } from './ProductionDialogs';

// ── Main Component ────────────────────────────────────────────────────────────
const ProductionPipeline = ({ productionProjects, onApprove, onReject, approving }) => {
    const [expandedId, setExpandedId] = useState(null);

    // Dialog state
    const [dialog, setDialog] = useState({ open: false, type: null, projectId: null, projectName: '' });
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [approveRemarks, setApproveRemarks] = useState('');

    const openApproveDialog = (project) => {
        setApproveRemarks('');
        setDialog({ open: true, type: 'approve', projectId: project._id, projectName: project.projectName });
    };

    const openRejectDialog = (project) => {
        setRejectRemarks('');
        setDialog({ open: true, type: 'reject', projectId: project._id, projectName: project.projectName });
    };

    const closeDialog = () => setDialog({ open: false, type: null, projectId: null, projectName: '' });

    const confirmApprove = () => {
        onApprove(dialog.projectId, approveRemarks);
        closeDialog();
    };

    const confirmReject = () => {
        if (!rejectRemarks.trim()) return;
        onReject(dialog.projectId, rejectRemarks);
        closeDialog();
    };

    if (productionProjects.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                <div style={{ width: '72px', height: '72px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#22c55e' }}>
                    <CheckCircle size={36} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem' }}>All Caught Up!</h3>
                <p style={{ fontSize: '0.95rem' }}>No production projects are currently awaiting your review.</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {productionProjects.map(project => {
                    const isExpanded = expandedId === project._id;
                    const isApproving = approving[project._id];
                    const cd = project.completionDetails || {};

                    return (
                        <div key={project._id} style={{
                            background: '#fff', borderRadius: '18px',
                            border: '1.5px solid #e2e8f0', overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}>
                            {/* Header */}
                            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Wrench size={24} color="white" />
                                </div>

                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{project.projectName}</h3>
                                        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', border: '1px solid #fde68a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Awaiting Approval
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#64748b' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <User size={13} /> {project.projectManager?.fullName || 'N/A'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Calendar size={13} /> {cd.completionDate ? new Date(cd.completionDate).toLocaleDateString() : new Date(project.updatedAt).toLocaleDateString()}
                                        </span>
                                        {cd.finalCost && <span style={{ color: '#059669', fontWeight: 600 }}>Final Cost: ₹{Number(cd.finalCost).toLocaleString()}</span>}
                                        {cd.clientRating && <span>⭐ {cd.clientRating}/5</span>}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                                    <button
                                        onClick={() => setExpandedId(prev => prev === project._id ? null : project._id)}
                                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: '#475569', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Review
                                    </button>
                                    <button
                                        onClick={() => openRejectDialog(project)}
                                        disabled={isApproving}
                                        style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: '#ef4444', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', opacity: isApproving ? 0.6 : 1 }}
                                    >
                                        <XCircle size={15} /> Reject
                                    </button>
                                    <button
                                        onClick={() => openApproveDialog(project)}
                                        disabled={isApproving}
                                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', padding: '8px 18px', cursor: 'pointer', color: '#fff', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(16,185,129,0.3)', opacity: isApproving ? 0.6 : 1 }}
                                    >
                                        {isApproving ? <Clock size={15} /> : <CheckCircle size={15} />} {isApproving ? 'Processing...' : 'Approve'}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Detail Panel */}
                            {isExpanded && (
                                <div style={{ borderTop: '1px solid #f1f5f9', padding: '1.5rem', background: '#f8fafc' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
                                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FileText size={13} /> Project Details
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#475569' }}>
                                                <div><span style={{ color: '#94a3b8' }}>Progress:</span> <strong>{project.progress}%</strong></div>
                                                <div><span style={{ color: '#94a3b8' }}>Budget:</span> <strong>₹{Number(project.budget || 0).toLocaleString()}</strong></div>
                                                <div><span style={{ color: '#94a3b8' }}>Final Cost:</span> <strong style={{ color: '#059669' }}>₹{Number(cd.finalCost || project.spent || 0).toLocaleString()}</strong></div>
                                            </div>
                                        </div>
                                        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <CheckCircle size={13} /> Completion Summary
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#475569' }}>
                                                <div><span style={{ color: '#94a3b8' }}>Date:</span> <strong>{cd.completionDate ? new Date(cd.completionDate).toLocaleDateString() : 'N/A'}</strong></div>
                                                <div><span style={{ color: '#94a3b8' }}>Client Rating:</span> <strong>{cd.clientRating ? `${cd.clientRating}/5 ⭐` : 'N/A'}</strong></div>
                                                <div><span style={{ color: '#94a3b8' }}>Manager:</span> <strong>{project.projectManager?.fullName || 'N/A'}</strong></div>
                                            </div>
                                        </div>
                                        {cd.finalRemarks && (
                                            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <AlertCircle size={13} /> PM Remarks
                                                </h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.6' }}>"{cd.finalRemarks}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <ApproveDialog 
                open={dialog.open && dialog.type === 'approve'} 
                onClose={closeDialog}
                onConfirm={confirmApprove}
                projectName={dialog.projectName}
                approveRemarks={approveRemarks}
                setApproveRemarks={setApproveRemarks}
            />

            <RejectDialog 
                open={dialog.open && dialog.type === 'reject'} 
                onClose={closeDialog}
                onConfirm={confirmReject}
                projectName={dialog.projectName}
                rejectRemarks={rejectRemarks}
                setRejectRemarks={setRejectRemarks}
            />
        </>
    );
};

export default ProductionPipeline;
