import React from 'react';
import { Image as ImageIcon, Package } from 'lucide-react';

const ApprovalTabs = ({ activeTab, setActiveTab, counts }) => {
    return (
        <div className="approval-tabs-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
            <button 
                style={{ 
                    padding: '12px 24px', background: 'none', border: 'none', 
                    borderBottom: activeTab === 'design' ? '3px solid #6366f1' : '3px solid transparent', 
                    color: activeTab === 'design' ? '#4f46e5' : '#64748b', 
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', 
                    display: 'flex', alignItems: 'center', gap: '8px' 
                }}
                onClick={() => setActiveTab('design')}
            >
                <ImageIcon size={18} /> Design Pipeline ({counts.design})
            </button>
            <button 
                style={{ 
                    padding: '12px 24px', background: 'none', border: 'none', 
                    borderBottom: activeTab === 'procurement' ? '3px solid #6366f1' : '3px solid transparent', 
                    color: activeTab === 'procurement' ? '#4f46e5' : '#64748b', 
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', 
                    display: 'flex', alignItems: 'center', gap: '8px' 
                }}
                onClick={() => setActiveTab('procurement')}
            >
                <Package size={18} /> Procurement Pipeline ({counts.procurement})
            </button>
        </div>
    );
};

export default ApprovalTabs;
