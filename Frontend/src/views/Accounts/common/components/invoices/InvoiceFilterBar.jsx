import React from 'react';
import { SlidersHorizontal, ChevronDown, CheckCircle, Plus, Search, X } from 'lucide-react';

const InvoiceFilterBar = ({
    statusFilter,
    setStatusFilter,
    showFilterDropdown,
    setShowFilterDropdown,
    setShowCreateModal,
    searchTerm,
    setSearchTerm
}) => {
    return (
        <div className="invoice-filter-bar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '12px',
            flexWrap: 'wrap',
            margin: '16px 0 12px 0'
        }}>
            {/* Left: Filter Dropdown & Search Input Bar side by side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '280px' }}>
                {/* Status Filter Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowFilterDropdown(p => !p)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            height: '38px',
                            padding: '0 14px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: statusFilter === 'All' ? '#ffffff' : '#eff6ff',
                            color: statusFilter === 'All' ? '#475569' : '#2563eb',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}
                    >
                        <SlidersHorizontal size={15} />
                        <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                        <ChevronDown size={14} style={{ opacity: 0.6, transform: showFilterDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {showFilterDropdown && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowFilterDropdown(false)} />
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
                                <p style={{ padding: '6px 10px 4px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Filter by status</p>
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '7px',
                                            border: 'none',
                                            background: statusFilter === opt.value ? '#eff6ff' : 'transparent',
                                            color: statusFilter === opt.value ? '#2563eb' : '#334155',
                                            fontWeight: statusFilter === opt.value ? 700 : 500,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'background 0.1s'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0, display: 'inline-block' }} />
                                        <span>{opt.label}</span>
                                        {statusFilter === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#2563eb' }} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Search Input Bar right next to filter */}
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    flex: '1',
                    maxWidth: '340px',
                    minWidth: '200px'
                }}>
                    <Search size={15} style={{
                        position: 'absolute',
                        left: '12px',
                        color: '#94a3b8',
                        pointerEvents: 'none'
                    }} />
                    <input
                        type="text"
                        placeholder="Search by client or invoice number..."
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            height: '38px',
                            padding: '0 32px 0 34px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            fontSize: '0.825rem',
                            color: '#0f172a',
                            outline: 'none',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.12)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                        }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Create Invoice button */}
            {setShowCreateModal && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '38px',
                        padding: '0 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                        transition: 'background 0.15s ease'
                    }}
                >
                    <Plus size={16} /> Create Invoice
                </button>
            )}
        </div>
    );
};

export default InvoiceFilterBar;
