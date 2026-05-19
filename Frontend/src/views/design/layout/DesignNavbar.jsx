import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    RefreshCw, Palette, LayoutDashboard, GitMerge, FileSpreadsheet, 
    Briefcase, CheckSquare, Users, Eye, AlertCircle, CheckCircle 
} from 'lucide-react';

const DesignNavbar = ({ user, onRefresh, isLoading }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const isManager = user?.role === 'design_manager';

    const tabMeta = isManager ? {
        overview: { title: 'Studio Overview', icon: LayoutDashboard },
        pipeline: { title: 'Design Pipeline', icon: GitMerge },
        project_details: { title: 'Approved Specifications', icon: FileSpreadsheet },
        project_management: { title: 'Project Management', icon: Briefcase },
        tasks: { title: 'Tasks Management', icon: CheckSquare },
        staff_overview: { title: 'Team Workload', icon: Users },
        material_review: { title: 'Material Review Hub', icon: Eye }
    } : {
        overview: { title: 'Designer Workspace', icon: LayoutDashboard },
        tasks: { title: 'My Active Tasks', icon: CheckSquare },
        revisions: { title: 'Revision Requests', icon: AlertCircle },
        submissions: { title: 'Finalized Submissions', icon: CheckCircle }
    };

    const { title, icon: Icon } = tabMeta[activeTab] || { title: 'Design Studio', icon: Palette };

    return (
        <header className="design-navbar">
            <div className="design-navbar-brand">
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
