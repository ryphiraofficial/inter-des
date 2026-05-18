import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, RefreshCw,
    CheckCircle, Package
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',     label: 'My Overview',    icon: LayoutDashboard },
    { tab: 'tasks',        label: 'My Tasks',       icon: CheckSquare },
    { tab: 'revisions',    label: 'Revisions',      icon: RefreshCw },
    { tab: 'submissions',  label: 'Submissions',    icon: CheckCircle },
    { tab: 'materials',    label: 'Material Requests', icon: Package },
];

const DesignStaffSidebar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <aside className="design-sidebar">
            <nav className="design-sidebar-nav">
                <div className="design-sidebar-section-label">WORKSPACE</div>
                {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
                    <button
                        key={tab}
                        className={`design-sidebar-item ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => navigate(`?tab=${tab}`)}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default DesignStaffSidebar;
