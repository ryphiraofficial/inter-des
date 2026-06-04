import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

// ── Shadcn-style Alert Dialog ────────────────────────────────────────────────
export const AlertDialog = ({ open, onClose, children }) => {
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

export const ApproveDialog = ({ open, onClose, onConfirm, projectName, approveRemarks, setApproveRemarks }) => (
    <AlertDialog open={open} onClose={onClose}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={28} color="#16a34a" strokeWidth={2.5} />
            </div>
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
            Approve Project?
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
            You are about to approve <strong style={{ color: '#0f172a' }}>"{projectName}"</strong>. This will mark the project as <strong>Admin Approved</strong> and finalise the production completion.
        </p>
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
        <div style={{ display: 'flex', gap: '10px' }}>
            <button
                onClick={onClose}
                style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 2px 10px rgba(16,185,129,0.35)' }}
            >
                <Check size={17} strokeWidth={2.5} /> Approve Project
            </button>
        </div>
    </AlertDialog>
);

export const RejectDialog = ({ open, onClose, onConfirm, projectName, rejectRemarks, setRejectRemarks }) => (
    <AlertDialog open={open} onClose={onClose}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', border: '2px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={26} color="#dc2626" strokeWidth={2.5} />
            </div>
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
            Reject & Send Back?
        </h2>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.88rem', color: '#64748b', textAlign: 'center', lineHeight: '1.6' }}>
            Rejecting <strong style={{ color: '#0f172a' }}>"{projectName}"</strong> will return it to <strong>Active</strong> status for the Project Manager to address.
        </p>
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
        <div style={{ display: 'flex', gap: '10px' }}>
            <button
                onClick={onClose}
                style={{ flex: 1, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                disabled={!rejectRemarks.trim()}
                style={{ flex: 1, background: rejectRemarks.trim() ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#fca5a5', border: 'none', borderRadius: '10px', padding: '10px', cursor: rejectRemarks.trim() ? 'pointer' : 'not-allowed', color: '#fff', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: rejectRemarks.trim() ? '0 2px 10px rgba(239,68,68,0.35)' : 'none', transition: 'all 0.2s' }}
            >
                <X size={17} strokeWidth={2.5} /> Reject Project
            </button>
        </div>
    </AlertDialog>
);
