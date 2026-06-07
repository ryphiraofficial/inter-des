import React, { useState } from 'react';
import { CreditCard, UserPlus, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import CustomSelect from '../../../common/CustomSelect';

const AccountsPipeline = ({ projects, procurementManagers, handleClearPayment, approving }) => {
    const [selectedPM, setSelectedPM] = useState({});

    if (!projects || projects.length === 0) {
        return (
            <div style={{ background: 'white', borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>There are no projects currently waiting for advance payment collection.</p>
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

        if (isFullyPaid) {
            if (window.confirm(`Are you sure you want to clear payment for "${project.name}" and send it to Procurement?`)) {
                handleClearPayment(project, pmId, false);
            }
        } else {
            const reason = window.prompt(`Warning: Only ₹${collected.toLocaleString('en-IN')} of ₹${required.toLocaleString('en-IN')} collected. To force override, enter a reason:`);
            if (reason) {
                handleClearPayment(project, pmId, true, reason);
            }
        }
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
        </div>
    );
};

export default AccountsPipeline;
