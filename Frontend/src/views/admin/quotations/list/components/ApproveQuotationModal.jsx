import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Award, UserCheck } from 'lucide-react';

const ApproveQuotationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    quotation, 
    designManagers = [],
    submitting 
}) => {
    const [selectedManagerId, setSelectedManagerId] = useState('');

    if (!isOpen || !quotation) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(quotation._id, selectedManagerId);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={22} style={{ color: '#4f46e5' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                            Approve Quotation
                        </h3>
                    </div>
                    <button 
                         onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '4px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {/* Information summary */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Quotation Number</p>
                            <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                                {quotation.quotationNumber}
                            </p>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Project / Client</p>
                            <p style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                                {quotation.projectName} ({quotation.client?.name || 'Walk-in Client'})
                            </p>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Total Budget (to Design stage)</p>
                            <p style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: '#10b981' }}>
                                ₹{(quotation.totalAmount || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>

                    {/* Design Manager Select */}
                    <div style={{ marginBottom: '24px' }}>
                        <label 
                            htmlFor="designManager"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#334155',
                                marginBottom: '8px'
                            }}
                        >
                            Assign Design Manager <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="designManager"
                                required
                                value={selectedManagerId}
                                onChange={(e) => setSelectedManagerId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#fff',
                                    fontSize: '14px',
                                    color: '#0f172a',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 16px center',
                                    backgroundSize: '16px'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4f46e5';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#cbd5e1';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">-- Choose a Design Manager --</option>
                                {designManagers.map(m => (
                                    <option key={m._id} value={m._id}>
                                        {m.fullName} ({m.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <UserCheck size={14} style={{ color: '#4f46e5' }} /> 
                            This assignment is mandatory to approve the quotation and release to design.
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '20px'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            style={{
                                padding: '10px 18px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#fff',
                                color: '#334155',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedManagerId}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                background: !selectedManagerId ? '#94a3b8' : '#10b981',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: !selectedManagerId ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -1px rgba(16, 185, 129, 0.1)',
                                transition: 'background-color 0.2s, transform 0.1s'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedManagerId) e.currentTarget.style.backgroundColor = '#059669';
                            }}
                            onMouseLeave={(e) => {
                                if (selectedManagerId) e.currentTarget.style.backgroundColor = '#10b981';
                            }}
                        >
                            <CheckCircle size={16} /> {submitting ? 'Approving...' : 'Approve & Release'}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Modal Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ApproveQuotationModal;
