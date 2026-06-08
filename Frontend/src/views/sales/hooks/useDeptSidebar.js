import { useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Users, CheckSquare, Package, Target,
    ShoppingCart, Building2, Box, ClipboardCheck, Clock, Plus, CheckCircle,
    FolderOpen, CalendarOff, Video, ClipboardList, MapPin
} from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../config/constants';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const NAV_CONFIG = {
    'Design Manager': {
        brandTitle:    'STUDIO DESIGN',
        brandSubtitle: 'CREATIVE MANAGEMENT',
        sidebarClass:  'design',
        basePath:      '/',
        items: [
            { name: 'Dashboard',         icon: LayoutDashboard, path: '/?tab=dashboard',              tab: 'dashboard' },
            { name: 'Quotations',        icon: FileText,        path: '/quotations',                  tab: null },
            { name: 'Project Status',    icon: Clock,           path: '/?tab=pipeline',               tab: 'pipeline' },
            { name: 'Project Details',   icon: FileText,        path: '/?tab=project_details',        tab: 'project_details' },
            { name: 'Task Assignment',   icon: CheckSquare,     path: '/?tab=tasks',                   tab: 'tasks' },
            { name: 'Staff Overview',    icon: Users,           path: '/?tab=staff_overview',          tab: 'staff_overview' },
            { name: 'Material Hub',      icon: Package,         path: '/material-review',              tab: null },
            { name: 'Meetings',          icon: Video,           path: '/meetings' },
        ],
    },
    'Design Staff': {
        brandTitle:   'Design Staff',
        sidebarClass: 'design',
        basePath:     '/staff/dashboard',
        items: [
            { name: 'My Dashboard',    icon: LayoutDashboard, path: '/staff/dashboard?tab=overview',    tab: 'overview' },
            { name: 'My Tasks',        icon: CheckSquare,     path: '/staff/dashboard?tab=tasks',        tab: 'tasks' },
            { name: 'Revisions',       icon: Target,          path: '/staff/dashboard?tab=revisions',    tab: 'revisions' },
            { name: 'Submitted Tasks', icon: CheckSquare,     path: '/staff/dashboard?tab=submissions',  tab: 'submissions' },
            { name: 'Meetings',        icon: Video,           path: '/meetings' },
        ],
    },
    'Procurement Manager': {
        brandTitle:   'Procurement Manager',
        sidebarClass: 'procurement',
        basePath:     '/',
        items: [
            { name: 'Dashboard',         icon: LayoutDashboard, path: '/?tab=overview',    tab: 'overview' },
            { name: 'Design Handoffs',   icon: Plus,            path: '/?tab=handoffs',    tab: 'handoffs' },
            { name: 'Material Requests', icon: Package,         path: '/?tab=requests',    tab: 'requests' },
            { name: 'Assignments',       icon: CheckSquare,     path: '/?tab=assignments', tab: 'assignments' },
            { name: 'Vendors',           icon: Building2,       path: '/?tab=vendors',     tab: 'vendors' },
            { name: 'Completed & Handoff', icon: CheckCircle,   path: '/?tab=completed',   tab: 'completed' },
            { name: 'Meetings',          icon: Video,           path: '/meetings' },
        ],
    },
    'Procurement Staff': {
        brandTitle:   'Procurement Staff',
        sidebarClass: 'procurement',
        basePath:     '/staff/dashboard',
        items: [
            { name: 'My Dashboard',     icon: LayoutDashboard, path: '/staff/dashboard?tab=overview', tab: 'overview' },
            { name: 'Sourcing Hub',     icon: ShoppingCart,    path: '/staff/dashboard?tab=sourcing',  tab: 'sourcing' },
            { name: 'My Tasks',         icon: CheckSquare,     path: '/staff/dashboard?tab=tasks',     tab: 'tasks' },
            { name: 'Purchase History', icon: Package,         path: '/staff/dashboard?tab=history',   tab: 'history' },
            { name: 'Vendors',          icon: Box,             path: '/staff/dashboard?tab=vendors',   tab: 'vendors' },
            { name: 'Meetings',         icon: Video,           path: '/meetings' },
        ],
    },
    'Project Manager': {
        brandTitle:   'Project Manager',
        sidebarClass: 'production',
        basePath:     '/production-management/dashboard',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/production-management/dashboard' },
            { name: 'Project Handoff', icon: Target,    path: '/production-management/handoff' },
            { name: 'Projects',  icon: Box,             path: '/production-management/projects' },
            { name: 'Tasks',     icon: CheckSquare,     path: '/production-management/tasks' },
            { name: 'Team',      icon: Users,           path: '/production-management/team' },
            { name: 'Approvals', icon: ClipboardCheck,  path: '/production-management/approvals' },
            { name: 'Reports',   icon: FileText,        path: '/production-management/reports' },
            { name: 'Meetings',  icon: Video,           path: '/meetings' },
        ],
    },
    'Project Engineer': {
        brandTitle:   'Engineer Portal',
        sidebarClass: 'production',
        basePath:     '/engineer/dashboard',
        items: [
            { name: 'Dashboard',     icon: LayoutDashboard, path: '/engineer/dashboard' },
            { name: 'Projects',      icon: FolderOpen,      path: '/engineer/projects' },
            { name: 'My Tasks',      icon: CheckSquare,     path: '/engineer/tasks' },
            { name: 'Transferred Tasks', icon: Users,       path: '/engineer/transferred-tasks' },
            { name: 'Site Reports',  icon: FileText,        path: '/engineer/reports' },
            { name: 'Approvals',     icon: ClipboardCheck,  path: '/engineer/approvals' },
            { name: 'Leave Request', icon: CalendarOff,     path: '/engineer/leave' },
            { name: 'Meetings',      icon: Video,           path: '/meetings' },
        ],
    },
    'Site Engineer': {
        brandTitle:   'Site Portal',
        sidebarClass: 'production',
        basePath:     '/site/dashboard',
        items: [
            { name: 'Dashboard',     icon: LayoutDashboard, path: '/site/dashboard' },
            { name: 'Projects',      icon: FolderOpen,      path: '/site/projects' },
            { name: 'Tasks',         icon: CheckSquare,     path: '/site/tasks' },
            { name: 'Reports',       icon: FileText,        path: '/site/reports' },
            { name: 'Leave Request', icon: CalendarOff,     path: '/site/leave' },
            { name: 'Meetings',      icon: Video,           path: '/meetings' },
        ],
    },
    'Site Supervisor': {
        brandTitle:   'Site Portal',
        sidebarClass: 'production',
        basePath:     '/site/dashboard',
        items: [
            { name: 'Dashboard',     icon: LayoutDashboard, path: '/site/dashboard' },
            { name: 'Projects',      icon: FolderOpen,      path: '/site/projects' },
            { name: 'Tasks',         icon: CheckSquare,     path: '/site/tasks' },
            { name: 'Reports',       icon: FileText,        path: '/site/reports' },
            { name: 'Leave Request', icon: CalendarOff,     path: '/site/leave' },
            { name: 'Meetings',      icon: Video,           path: '/meetings' },
        ],
    },
    'Production Staff': {
        brandTitle:   'Production Staff',
        sidebarClass: 'production',
        basePath:     '/staff/dashboard',
        items: [
            { name: 'My Dashboard',  icon: LayoutDashboard, path: '/staff/dashboard' },
            { name: 'Task Tracker',  icon: CheckSquare,     path: '/staff/tasks' },
            { name: 'Site Inventory', icon: Box,            path: '/inventory' },
            { name: 'Checklists',    icon: ClipboardCheck,  path: '/checklists' },
            { name: 'Meetings',      icon: Video,           path: '/meetings' },
        ],
    },
    'Sales Staff': {
        brandTitle:   'Sales Portal',
        sidebarClass: 'procurement', // Using procurement theme (blue)
        basePath:     '/staff/dashboard',
        items: [
            { name: 'Dashboard',        icon: LayoutDashboard, path: '/staff/dashboard' },
            { name: 'My Tasks',         icon: ClipboardList,   path: '/staff/tasks' },
            { name: 'Completed Tasks',  icon: CheckCircle,     path: '/staff/completed-tasks', isSub: true },
            { name: 'Client Approvals', icon: ClipboardCheck,  path: '/staff/approvals' },
            { name: 'Site Visits',      icon: MapPin,          path: '/staff/site-visits' },
            { name: 'Clients',          icon: Users,           path: '/staff/clients' },
            { name: 'Quotations',       icon: FileText,        path: '/staff/quotations' },
            { name: 'Meetings',         icon: Video,           path: '/staff/meetings' },
        ],
    },
    'Sales Manager': {
        brandTitle:   'Sales Portal',
        sidebarClass: 'procurement', // Using procurement theme (blue)
        basePath:     '/staff/dashboard',
        items: [
            { name: 'Dashboard',        icon: LayoutDashboard, path: '/staff/dashboard' },
            { name: 'My Tasks',         icon: ClipboardList,   path: '/staff/tasks' },
            { name: 'Completed Tasks',  icon: CheckCircle,     path: '/staff/completed-tasks', isSub: true },
            { name: 'Client Approvals', icon: ClipboardCheck,  path: '/staff/approvals' },
            { name: 'Site Visits',      icon: MapPin,          path: '/staff/site-visits' },
            { name: 'Clients',          icon: Users,           path: '/staff/clients' },
            { name: 'Quotations',       icon: FileText,        path: '/staff/quotations' },
            { name: 'Meetings',         icon: Video,           path: '/staff/meetings' },
        ],
    },
};

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const useDeptSidebar = (role) => {
    const user = useAppSelector(selectUser);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get('tab') || 'overview';

    let config = NAV_CONFIG[role];
    if (!config && role && role.toLowerCase().includes('sales')) {
        config = NAV_CONFIG['Sales Staff'];
    }

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    const avatarUrl = getImageUrl(user?.avatar);

    const isActiveTab = (item) => {
        if (!config) return false;
        if (item.tab) {
            return currentTab === item.tab && location.pathname === config.basePath;
        }
        return location.pathname === item.path;
    };

    return {
        config,
        userInitials,
        avatarUrl,
        isActiveTab
    };
};
