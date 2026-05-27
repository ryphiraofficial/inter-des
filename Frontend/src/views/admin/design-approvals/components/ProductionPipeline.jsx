import React, { useState } from 'react';
import { 
    CheckCircle, XCircle, Wrench, User, Calendar, 
    FileText, AlertCircle, ChevronDown, ChevronUp, Clock,
    AlertTriangle, Check, X
} from 'lucide-react';

// ── Shadcn-style Alert Dialog ────────────────────────────────────────────────
const AlertDialog = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem'
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.15s ease'
            }} />
            {/* Dialog */}
            <div style={{
                position: 'relative',
                background: '#fff',
                borderRadius: '16px',
                padding: '1.75rem',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                animation: 'slideUp 0.2s ease',
                border: '1px solid #f1f5f9'
            }}>
                {children}
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
        </div>
    );
};

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

            {/* ── Approve Dialog ── */}
            <AlertDialog open={dialog.open && dialog.type === 'approve'} onClose={closeDialog}>
                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={28} color="#16a34a" strokeWidth={2.5} />
                    </div>
                </div>
                {/* Title */}
                <h2 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
                    Approve Project?
                </h2>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
                    You are about to approve <strong style={{ color: '#0f172a' }}>"{dialog.projectName}"</strong>. This will mark the project as <strong>Admin Approved</strong> and finalise the production completion.
                </p>
                {/* Remarks input */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Remarks <span style={{ fontWeight: 400, color: '#94a3b8', textTransform: 'none' }}>(optional)</span>
                    </label>
                    <textarea
                        rows={3}
                        value={approveRemarks}
                        onChange={e => setApproveRemarks(e.target.value)}
                        placeholder="Add any notes for the project manager..."
                        style={{ width: '100%', borderRadius: '10px', border: '1.5px solid #e2e8f0', padding: '10px 14px', fontSize: '0.88rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1e293b', transition: 'border 0.15s' }}
                        onFocus={e => e.target.style.borderColor = '#10b981'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={closeDialog}
                        style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmApprove}
                        style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 2px 10px rgba(16,185,129,0.35)' }}
                    >
                        <Check size={17} strokeWidth={2.5} /> Approve Project
                    </button>
                </div>
            </AlertDialog>

            {/* ── Reject Dialog ── */}
            <AlertDialog open={dialog.open && dialog.type === 'reject'} onClose={closeDialog}>
                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', border: '2px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={26} color="#dc2626" strokeWidth={2.5} />
                    </div>
                </div>
                {/* Title */}
                <h2 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
                    Reject & Send Back?
                </h2>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
                    Rejecting <strong style={{ color: '#0f172a' }}>"{dialog.projectName}"</strong> will return it to <strong>Active</strong> status for the Project Manager to address.
                </p>
                {/* Remarks input (required) */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Reason for Rejection <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        rows={3}
                        value={rejectRemarks}
                        onChange={e => setRejectRemarks(e.target.value)}
                        placeholder="Describe what needs to be addressed before approval..."
                        style={{ width: '100%', borderRadius: '10px', border: `1.5px solid ${rejectRemarks.trim() ? '#e2e8f0' : '#fca5a5'}`, padding: '10px 14px', fontSize: '0.88rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1e293b', transition: 'border 0.15s' }}
                        onFocus={e => e.target.style.borderColor = '#ef4444'}
                        onBlur={e => e.target.style.borderColor = rejectRemarks.trim() ? '#e2e8f0' : '#fca5a5'}
                    />
                    {!rejectRemarks.trim() && (
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#ef4444' }}>A reason is required to reject the project.</p>
                    )}
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={closeDialog}
                        style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmReject}
                        disabled={!rejectRemarks.trim()}
                        style={{ flex: 1, background: rejectRemarks.trim() ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#fca5a5', border: 'none', borderRadius: '10px', padding: '10px', cursor: rejectRemarks.trim() ? 'pointer' : 'not-allowed', color: '#fff', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: rejectRemarks.trim() ? '0 2px 10px rgba(239,68,68,0.35)' : 'none', transition: 'all 0.2s' }}
                    >
                        <X size={17} strokeWidth={2.5} /> Reject Project
                    </button>
                </div>
            </AlertDialog>
        </>
    );
};

export default ProductionPipeline;
