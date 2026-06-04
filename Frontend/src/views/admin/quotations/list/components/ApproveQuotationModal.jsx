import React, { useState } from 'react';
import { X, CheckCircle, Award } from 'lucide-react';
import QuotationSummaryBox from './QuotationSummaryBox';
import ManagerSelectField from './ManagerSelectField';

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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={22} style={{ color: '#4f46e5' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Approve Quotation</h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    <QuotationSummaryBox quotation={quotation} />

                    <ManagerSelectField
                        designManagers={designManagers}
                        selectedManagerId={selectedManagerId}
                        setSelectedManagerId={setSelectedManagerId}
                    />

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedManagerId}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: !selectedManagerId ? '#94a3b8' : '#10b981', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: !selectedManagerId ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.2)', transition: 'background-color 0.2s' }}
                            onMouseEnter={(e) => { if (selectedManagerId) e.currentTarget.style.backgroundColor = '#059669'; }}
                            onMouseLeave={(e) => { if (selectedManagerId) e.currentTarget.style.backgroundColor = '#10b981'; }}
                        >
                            <CheckCircle size={16} /> {submitting ? 'Approving...' : 'Approve & Release'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default ApproveQuotationModal;
