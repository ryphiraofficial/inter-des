import React from 'react';
import { Menu } from 'lucide-react';
import { useCompanySettings } from '../../../../hooks/useCompanySettings';

const SidebarHeader = ({ department, toggleSidebar }) => {
    const { companyName } = useCompanySettings();
    return (
        <div className="sidebar-header">
            <div className="brand-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 className="brand-title" style={{ fontSize: '20px', color: '#000000', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2', margin: 0 }}>{companyName}</h1>
                <p className="brand-subtitle" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '2px 0 0 0' }}>
                    {department} Dashboard
                </p>
            </div>
            <button className="btn-toggle-sidebar" onClick={toggleSidebar} title="Toggle Sidebar">
                <Menu size={20} />
            </button>
        </div>
    );
};

export default SidebarHeader;
