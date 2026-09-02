import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, FileText } from 'lucide-react';

const ClearanceEmptyState = ({ search, setSearch, onRefresh }) => {
    const navigate = useNavigate();
    const isSearching = Boolean(search && search.trim());

    if (isSearching) {
        return (
            <div style={{
                padding: '64px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                borderRadius: '16px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                    color: '#64748b'
                }}>
                    <Search size={28} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                    No matching projects found
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', margin: '0 0 20px', lineHeight: 1.5 }}>
                    We couldn't find any clearance records matching <span style={{ fontWeight: 600, color: '#0f172a' }}>"{search}"</span>. Try searching with a different client name or project number.
                </p>
                {setSearch && (
                    <button
                        onClick={() => setSearch('')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Clear search filter
                    </button>
                )}
            </div>
        );
    }

    return (
        <div style={{
            padding: '48px 32px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
            {/* Header Content */}
            <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 8px',
                letterSpacing: '-0.01em'
            }}>
                All Clear! No Projects Pending Clearance
            </h2>

            <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                maxWidth: '480px',
                margin: '0 0 24px',
                lineHeight: 1.6
            }}>
                All client advances and milestone balances are verified and approved. New clearance requests will automatically appear here as project stages advance.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <button
                    onClick={() => navigate('?tab=overview')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                        transition: 'all 0.18s'
                    }}
                >
                    <span>View Financial Overview</span>
                    <ArrowRight size={15} />
                </button>

                <button
                    onClick={() => navigate('?tab=invoices')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#ffffff',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        padding: '9px 18px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s'
                    }}
                >
                    <FileText size={15} color="#64748b" />
                    <span>Check Invoices</span>
                </button>
            </div>
        </div>
    );
};

export default ClearanceEmptyState;
