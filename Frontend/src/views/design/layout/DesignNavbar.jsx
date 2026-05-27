import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    RefreshCw, Palette, LayoutDashboard, GitMerge, FileSpreadsheet, 
    Briefcase, CheckSquare, Users, Eye, AlertCircle, CheckCircle, Plus, Menu, Video
} from 'lucide-react';

const DesignNavbar = ({ user, onRefresh, isLoading, toggleSidebar }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const isManager = user?.role?.toLowerCase().replace(/_/g, ' ').includes('design manager') || user?.role?.toLowerCase().includes('admin');

    const tabMeta = isManager ? {
        overview: { title: 'Overview', description: 'High-level studio performance and metrics' },
        pipeline: { title: 'Project Pipeline', description: 'Track all active design projects and statuses' },
        project_details: { title: 'Project Details', description: 'View approved specifications and details' },
        project_management: { title: 'Projects', description: 'Manage overall project timelines and resources' },
        tasks: { title: 'Task Management', description: 'Assign and track design tasks' },
        staff_overview: { title: 'Staff Overview', description: 'Monitor team workload and capacity' },
        material_review: { title: 'Material Review', description: 'Review and approve material selections' },
        meetings: { title: 'Meetings', description: 'Schedule and manage team meetings' }
    } : {
        overview: { title: 'My Overview', description: 'Your personal design dashboard and metrics' },
        tasks: { title: 'My Tasks', description: 'Manage your active design assignments' },
        revisions: { title: 'Revisions', description: 'Handle requested design modifications' },
        submissions: { title: 'Submissions', description: 'View your finalized and approved designs' },
        materials: { title: 'Material Requests', description: 'Submit and track your material selections' },
        meetings: { title: 'Meetings', description: 'View your scheduled meetings' }
    };

    const { title, description } = tabMeta[activeTab] || { title: 'Design Studio', description: 'Design management portal' };

    const handleAssignClick = () => {
        window.dispatchEvent(new CustomEvent('open-assign-modal'));
    };

    return (
        <header className="design-navbar">
            <div className="design-navbar-brand">
                <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
                    <Menu size={20} />
                </button>
                <div>
                    <span className="design-navbar-title">{title}</span>
                    <span className="design-navbar-subtitle">
                        {description}
                    </span>
                </div>
            </div>

            <div className="design-navbar-right">
                {isManager && ['tasks', 'pipeline'].includes(activeTab) && (
                    <button 
                        className="design-navbar-action-btn" 
                        onClick={handleAssignClick}
                        title="Assign New Design"
                    >
                        <Plus size={16} />
                        <span>Assign New Design</span>
                    </button>
                )}
                {onRefresh && (
                    <button className="design-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default DesignNavbar;
