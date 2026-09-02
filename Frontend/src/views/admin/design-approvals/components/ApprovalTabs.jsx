import React from 'react';
import { Image as ImageIcon, Package, Wrench, LockOpen, CreditCard, Layers } from 'lucide-react';

const ApprovalTabs = ({ activeTab, setActiveTab, counts }) => {
    const tabs = [
        { key: 'design',      label: 'Design Pipeline',      icon: ImageIcon, color: '#6366f1', count: counts.design },
        { key: 'accounts',    label: 'Accounts Pipeline',    icon: CreditCard, color: '#10b981', count: counts.accounts },
        { key: 'procurement', label: 'Procurement Pipeline',  icon: Package,   color: '#0ea5e9', count: counts.procurement },
        { key: 'production',  label: 'Production Pipeline',   icon: Wrench,    color: '#f59e0b', count: counts.production },
        { key: 'edge_bands',  label: 'Edge Band Approvals',  icon: Layers,    color: '#8b5cf6', count: counts.edge_bands || 0 },
        { key: 'unlocks',     label: 'Unlock Requests',       icon: LockOpen,  color: '#dc2626', count: counts.unlocks },
    ];

    return (
        <div className="approval-tabs-container" style={{ 
            display: 'flex', 
            gap: '0.35rem', 
            marginBottom: '1.5rem', 
            borderBottom: '2px solid #e2e8f0',
            overflowX: 'auto',
            flexWrap: 'wrap',
            scrollbarWidth: 'none'
        }}>
            {tabs.map(({ key, label, icon: Icon, color, count }) => {
                const isActive = activeTab === key;
                return (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            padding: '10px 14px',
                            background: 'none',
                            border: 'none',
                            borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                            color: isActive ? color : '#64748b',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        <Icon size={16} />
                        {label}
                        <span style={{
                            background: isActive ? color : '#f1f5f9',
                            color: isActive ? '#fff' : '#64748b',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '10px',
                            minWidth: '20px',
                            textAlign: 'center'
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
