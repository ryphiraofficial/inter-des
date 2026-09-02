import React, { useState } from 'react';
import { CreditCard, UserPlus, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import CustomSelect from '../../../common/CustomSelect';

const AccountsPipeline = ({ projects, procurementManagers, handleClearPayment, approving }) => {
    const [selectedPM, setSelectedPM] = useState({});
    const [dialog, setDialog] = useState({ isOpen: false, project: null, pmId: null, isForce: false, required: 0, collected: 0 });
    const [overrideReason, setOverrideReason] = useState('');

    if (!projects || projects.length === 0) {
        return (
            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    background: '#f0fdf4',
                    color: '#16a34a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    <CheckCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                    All Caught Up!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto', lineHeight: '1.5' }}>
                    There are no projects currently waiting for advance payment collection.
                </p>
            </div>
        );
    }

    const onClearPaymentClick = (project) => {
        const pmId = selectedPM[project._id];
        if (!pmId) {
            alert('Please assign a Procurement Manager before clearing payment.');
            return;
        }

        const required = project.advanceAmount || 0;
        const collected = project.collectedAmount || 0;
        const isFullyPaid = collected >= required;

        setDialog({
            isOpen: true,
            project,
            pmId,
            isForce: !isFullyPaid,
            required,
            collected
        });
        setOverrideReason('');
    };

    const handleConfirm = () => {
        if (dialog.isForce) {
            if (!overrideReason.trim()) {
                alert("Please enter a reason for force override.");
                return;
            }
            handleClearPayment(dialog.project, dialog.pmId, true, overrideReason);
        } else {
            handleClearPayment(dialog.project, dialog.pmId, false);
        }
        setDialog({ isOpen: false, project: null, pmId: null, isForce: false, required: 0, collected: 0 });
    };

    const handleCancel = () => {
        setDialog({ isOpen: false, project: null, pmId: null, isForce: false, required: 0, collected: 0 });
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 440px), 1fr))', gap: '2rem' }}>
            {projects.map((project) => {
                const isApproving = !!approving[project._id];
                const requiredAmt = project.advanceAmount || 0;
                const collectedAmt = project.collectedAmount || 0;
                const isFullyPaid = collectedAmt >= requiredAmt;
                const pmAssigned = !!selectedPM[project._id];

                return (
                    <div key={project._id} className="approval-card" style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.3s ease', position: 'relative' }}>
                        {/* Card Header */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{project.name}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#64748b', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CreditCard size={14} />
                                            <span>Advance Required: {project.advancePercentage}%</span>
                                        </div>
                                        {project.assignedAccountsStaff && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <UserPlus size={14} />
                                                <span>Manager: <strong style={{ color: '#0f172a' }}>{project.assignedAccountsStaff.fullName}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span style={{ padding: '6px 12px', background: isFullyPaid ? '#dcfce7' : '#fef08a', color: isFullyPaid ? '#166534' : '#a16207', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {isFullyPaid ? 'Ready to Clear' : 'Pending Collection'}
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {/* Payment Status */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: isFullyPaid ? '#f0fdf4' : '#fff5f5', borderRadius: '14px', border: `1px solid ${isFullyPaid ? '#bbf7d0' : '#fecaca'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <DollarSign size={16} color={isFullyPaid ? '#16a34a' : '#dc2626'} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isFullyPaid ? '#16a34a' : '#991b1b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Collection Status
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', lineHeight: '1' }}>
                                            ₹{collectedAmt.toLocaleString('en-IN')}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                                            of ₹{requiredAmt.toLocaleString('en-IN')} required
                                        </div>
                                    </div>
                                    {!isFullyPaid && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontSize: '0.8rem', fontWeight: 600 }}>
                                            <AlertTriangle size={14} />
                                            Shortfall: ₹{(requiredAmt - collectedAmt).toLocaleString('en-IN')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Assign PM */}
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: pmAssigned ? '#f0fdf4' : '#fffbeb', borderRadius: '14px', border: `1px solid ${pmAssigned ? '#bbf7d0' : '#fde68a'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <UserPlus size={16} color={pmAssigned ? '#16a34a' : '#d97706'} />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pmAssigned ? '#16a34a' : '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        {pmAssigned ? '✓ Procurement Manager Assigned' : 'Assign Procurement Manager'}
                                    </span>
                                </div>
                                <CustomSelect
                                    options={procurementManagers.map(pm => ({ label: `${pm.fullName} (${pm.email})`, value: pm._id }))}
                                    value={selectedPM[project._id] || ''}
                                    onChange={(e) => setSelectedPM(prev => ({ ...prev, [project._id]: e.target.value }))}
                                    placeholder="Select Procurement Manager..."
                                    searchable={true}
                                />
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => onClearPaymentClick(project)}
                                    disabled={isApproving}
                                    className="btn-primary"
                                    style={{
                                        flex: 1,
                                        background: isApproving ? '#94a3b8' : (isFullyPaid ? '#10b981' : '#f59e0b'),
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        cursor: isApproving ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isApproving ? 'none' : (isFullyPaid ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(245, 158, 11, 0.2)')
                                    }}
                                >
                                    {isApproving ? 'Processing...' : (isFullyPaid ? 'Clear Payment & Send to Procurement' : 'Force Clear Payment')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {dialog.isOpen && dialog.project && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)', padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', animation: 'fadeIn 0.2s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: dialog.isForce ? '#fef2f2' : '#f0fdf4', color: dialog.isForce ? '#dc2626' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {dialog.isForce ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                {dialog.isForce ? 'Force Clear Payment' : 'Confirm Action'}
                            </h3>
                        </div>
                        
                        <div style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            {dialog.isForce ? (
                                <>
                                    <span style={{ fontWeight: 600, color: '#dc2626' }}>Warning:</span> Only <strong style={{ color: '#0f172a' }}>₹{dialog.collected.toLocaleString('en-IN')}</strong> of <strong style={{ color: '#0f172a' }}>₹{dialog.required.toLocaleString('en-IN')}</strong> collected for "{dialog.project.name}".
                                    <br /><br />
                                    To force override, please enter a valid reason below:
                                </>
                            ) : (
                                <>Are you sure you want to clear payment for <strong style={{ color: '#0f172a' }}>"{dialog.project.name}"</strong> and send it to Procurement?</>
                            )}
                        </div>

                        {dialog.isForce && (
                            <textarea
                                value={overrideReason}
                                onChange={(e) => setOverrideReason(e.target.value)}
                                placeholder="Enter reason for overriding..."
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', fontSize: '0.9rem', minHeight: '100px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        )}

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleCancel}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                                onMouseOut={(e) => e.target.style.background = 'white'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: dialog.isForce ? '#dc2626' : '#16a34a', color: 'white', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: dialog.isForce ? '0 4px 12px rgba(220, 38, 38, 0.2)' : '0 4px 12px rgba(22, 163, 74, 0.2)' }}
                                onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {dialog.isForce ? 'Override & Send' : 'Confirm & Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsPipeline;
