import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, GitBranch, FileText, Briefcase,
    CheckSquare, Users, Package
} from 'lucide-react';

const NAV_ITEMS = [
    { tab: 'overview',           label: 'Overview',          icon: LayoutDashboard },
    { tab: 'pipeline',           label: 'Project Pipeline',  icon: GitBranch },
    { tab: 'project_details',    label: 'Project Details',   icon: FileText },
    { tab: 'project_management', label: 'Projects',          icon: Briefcase },
    { tab: 'tasks',              label: 'Task Management',   icon: CheckSquare },
    { tab: 'staff_overview',     label: 'Staff Overview',    icon: Users },
    { tab: 'material_review',    label: 'Material Review',   icon: Package },
];

const DesignManagerSidebar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <aside className="design-sidebar">
            <nav className="design-sidebar-nav">
                <div className="design-sidebar-section-label">MANAGEMENT</div>
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

export default DesignManagerSidebar;
