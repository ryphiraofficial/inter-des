import React from 'react';
import { SlidersHorizontal, ChevronDown, Check, Plus } from 'lucide-react';

const InvoiceFilterBar = ({ statusFilter, setStatusFilter, showFilterDropdown, setShowFilterDropdown, onCreateInvoice }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
        }}>
            {/* Status Filter Dropdown */}
            <div style={{ position: 'relative' }}>
                <button
                    type="button"
                    onClick={() => setShowFilterDropdown(p => !p)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        color: statusFilter === 'All' ? '#0f172a' : '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                >
                    <SlidersHorizontal size={14} color="#64748b" />
                    <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                    <ChevronDown size={13} style={{ color: '#64748b', transform: showFilterDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {showFilterDropdown && (
                    <>
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                            onClick={() => setShowFilterDropdown(false)}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            background: '#ffffff',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                            zIndex: 50,
                            minWidth: '170px',
                            padding: '4px',
                            overflow: 'hidden'
                        }}>
                            <p style={{ padding: '6px 10px 4px', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Filter by status</p>
                            {[
                                { value: 'All',     label: 'All Status',  dot: '#94a3b8' },
                                { value: 'Draft',   label: 'Draft',       dot: '#94a3b8' },
                                { value: 'Sent',    label: 'Sent',        dot: '#3b82f6' },
                                { value: 'Unpaid',  label: 'Unpaid',      dot: '#f59e0b' },
                                { value: 'Paid',    label: 'Paid',        dot: '#10b981' },
                                { value: 'Overdue', label: 'Overdue',     dot: '#ef4444' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: statusFilter === opt.value ? '#eff6ff' : 'transparent',
                                        color: statusFilter === opt.value ? '#2563eb' : '#334155',
                                        fontWeight: statusFilter === opt.value ? 700 : 500,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0, display: 'inline-block' }} />
                                    <span>{opt.label}</span>
                                    {statusFilter === opt.value && (
                                        <Check size={13} style={{ marginLeft: 'auto', color: '#2563eb' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Create Invoice Button */}
            {onCreateInvoice && (
                <button
                    type="button"
                    onClick={onCreateInvoice}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <Plus size={16} /> Create Invoice
                </button>
            )}
        </div>
    );
};

export default InvoiceFilterBar;
