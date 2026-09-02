import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

const QuotationTabs = ({ quotations = [], activeTab, setActiveTab, isStaff }) => {
    const location = useLocation();
    const tabs = ['All', 'Under Review', 'Approved'];
    const isStaffMode = isStaff || location.pathname.startsWith('/staff');
    const createUrl = isStaffMode ? '/staff/quotations/new' : '/quotations/new';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '1.25rem'
        }}>
            {/* Pill-Style Tabs */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '6px',
                display: 'inline-flex',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}>
                {tabs.map(tab => {
                    const isActive = activeTab === tab;
                    const count = tab === 'All' ? quotations.length : quotations.filter(q => q.status === tab).length;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                                background: isActive ? '#eff6ff' : 'transparent',
                                color: isActive ? '#2563eb' : '#64748b',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.84rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <span>{tab}</span>
                            <span style={{
                                background: isActive ? '#2563eb' : count > 0 ? '#f1f5f9' : '#f8fafc',
                                color: isActive ? '#ffffff' : count > 0 ? '#0f172a' : '#94a3b8',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '1px 7px',
                                borderRadius: '10px'
                            }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Create Quotation Button */}
            <Link
                to={createUrl}
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
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                    transition: 'all 0.15s ease'
                }}
            >
                <Plus size={16} /> Create Quotation
            </Link>
        </div>
    );
};

export default QuotationTabs;
