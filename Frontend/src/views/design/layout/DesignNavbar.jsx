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
        overview: { title: 'Studio Overview', icon: LayoutDashboard },
        pipeline: { title: 'Design Pipeline', icon: GitMerge },
        project_details: { title: 'Approved Specifications', icon: FileSpreadsheet },
        project_management: { title: 'Project Management', icon: Briefcase },
        tasks: { title: 'Tasks Management', icon: CheckSquare },
        staff_overview: { title: 'Team Workload', icon: Users },
        material_review: { title: 'Material Review Hub', icon: Eye },
        meetings: { title: 'Meetings', icon: Video }
    } : {
        overview: { title: 'Designer Workspace', icon: LayoutDashboard },
        tasks: { title: 'My Active Tasks', icon: CheckSquare },
        revisions: { title: 'Revision Requests', icon: AlertCircle },
        submissions: { title: 'Finalized Submissions', icon: CheckCircle },
        meetings: { title: 'Meetings', icon: Video }
    };

    const { title, icon: Icon } = tabMeta[activeTab] || { title: 'Design Studio', icon: Palette };

    const handleAssignClick = () => {
        window.dispatchEvent(new CustomEvent('open-assign-modal'));
    };

    return (
        <header className="design-navbar">
            <div className="design-navbar-brand">
                <button className="mobile-menu-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
                    <Menu size={20} />
                </button>
                <div className="design-navbar-icon">
                    <Icon size={20} />
                </div>
                <div>
                    <span className="design-navbar-title">{title}</span>
                    <span className="design-navbar-subtitle">
                        {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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
