import React from 'react';
import { SlidersHorizontal, ChevronDown, CheckCircle, Plus } from 'lucide-react';

const InvoiceFilterBar = ({ statusFilter, setStatusFilter, showFilterDropdown, setShowFilterDropdown, setShowCreateModal }) => {
    return (
        <div className="invoice-filter-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowFilterDropdown(p => !p)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 14px', borderRadius: '8px',
                        border: '1px solid #e2e8f0', background: statusFilter === 'All' ? '#fff' : '#eef2ff',
                        color: statusFilter === 'All' ? '#64748b' : '#4f46e5',
                        fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                        transition: 'all 0.15s', whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                >
                    <SlidersHorizontal size={15} />
                    {statusFilter === 'All' ? 'All Status' : statusFilter}
                    <ChevronDown size={14} style={{ opacity: 0.6, transform: showFilterDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {showFilterDropdown && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowFilterDropdown(false)} />
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                            background: '#fff', borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                            zIndex: 50, minWidth: '160px', padding: '4px', overflow: 'hidden'
                        }}>
                            <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Filter by status</p>
                            {[
                                { value: 'All',    label: 'All Status',  dot: '#94a3b8' },
                                { value: 'Draft',  label: 'Draft',       dot: '#94a3b8' },
                                { value: 'Sent',   label: 'Sent',        dot: '#3b82f6' },
                                { value: 'Unpaid', label: 'Unpaid',      dot: '#f59e0b' },
                                { value: 'Paid',   label: 'Paid',        dot: '#10b981' },
                                { value: 'Overdue',label: 'Overdue',     dot: '#ef4444' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        width: '100%', padding: '8px 10px', borderRadius: '7px',
                                        border: 'none', background: statusFilter === opt.value ? '#f1f5f9' : 'transparent',
                                        color: statusFilter === opt.value ? '#0f172a' : '#475569',
                                        fontWeight: statusFilter === opt.value ? 700 : 500,
                                        fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
                                        transition: 'background 0.1s'
                                    }}
                                >
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0, display: 'inline-block' }} />
                                    {opt.label}
                                    {statusFilter === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {setShowCreateModal && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '9px 16px', borderRadius: '8px',
                        border: 'none', background: '#2563eb', color: '#ffffff',
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                >
                    <Plus size={16} /> Create Invoice
                </button>
            )}
        </div>
    );
};

export default InvoiceFilterBar;
