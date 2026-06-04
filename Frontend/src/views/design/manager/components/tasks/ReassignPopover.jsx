import React from 'react';
import { ArrowRight, Users, X } from 'lucide-react';

const ReassignPopover = ({ task, teamStats, onClose, onSubmit }) => {
    const available = teamStats.filter(
        s => !task.assignedTo?.some(a => (a._id || a).toString() === s._id.toString()) &&
             !s.role?.toLowerCase().includes('manager')
    );

    return (
        <div className="reassign-popover" style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.15)',
            zIndex: 4000,
            width: '300px',
            padding: '1rem',
            animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px' }}>Reassign Task</span>
                <button
                    onClick={onClose}
                    style={{ background: '#f8fafc', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
                >
                    <X size={14} />
                </button>
            </div>
            <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                {available.map(staff => (
                    <div
                        key={staff._id}
                        className="staff-select-item"
                        onClick={() => onSubmit(task._id, staff)}
                        style={{ padding: '12px', borderRadius: '14px', cursor: 'pointer', fontSize: '0.9rem', color: '#1e293b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', border: '1px solid transparent' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f3ff'; e.currentTarget.style.borderColor = '#ddd6fe'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, border: '1px solid #ddd6fe' }}>
                            {(staff.name || staff.fullName || 'S').charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, color: '#1e293b' }}>{staff.name || staff.fullName || 'Staff Member'}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{staff.role}</div>
                        </div>
                        <ArrowRight size={14} color="#6366f1" style={{ opacity: 0.5 }} />
                    </div>
                ))}
                {available.length === 0 && (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                        <div style={{ background: '#f8fafc', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <Users size={20} color="#cbd5e1" />
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 }}>No other designers available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReassignPopover;
