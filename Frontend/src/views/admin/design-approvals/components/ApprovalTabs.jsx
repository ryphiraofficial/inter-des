import React from 'react';
import { Image as ImageIcon, Package, Wrench, LockOpen, CreditCard } from 'lucide-react';

const ApprovalTabs = ({ activeTab, setActiveTab, counts }) => {
    const tabs = [
        { key: 'design',      label: 'Design Pipeline',      icon: ImageIcon,  count: counts.design },
        { key: 'accounts',    label: 'Accounts Pipeline',    icon: CreditCard, count: counts.accounts },
        { key: 'procurement', label: 'Procurement Pipeline',  icon: Package,    count: counts.procurement },
        { key: 'production',  label: 'Production Pipeline',   icon: Wrench,     count: counts.production },
        { key: 'unlocks',     label: 'Unlock Requests',       icon: LockOpen,   count: counts.unlocks },
    ];

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '6px',
            display: 'flex',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            flexWrap: 'nowrap'
        }}>
            {tabs.map(({ key, label, icon: Icon, count }) => {
                const isActive = activeTab === key;
                return (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                            background: isActive ? '#eff6ff' : 'transparent',
                            color: isActive ? '#2563eb' : '#64748b',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} />
                        <span>{label}</span>
                        <span style={{
                            background: isActive ? '#2563eb' : count > 0 ? '#f1f5f9' : '#f8fafc',
                            color: isActive ? '#ffffff' : count > 0 ? '#0f172a' : '#94a3b8',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '1px 7px',
                            borderRadius: '10px',
                            minWidth: '20px',
                            textAlign: 'center',
                            lineHeight: '1.4'
                        }}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ApprovalTabs;
