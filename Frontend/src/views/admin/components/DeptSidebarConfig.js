import {
    LayoutDashboard, FileText, Users, CheckSquare, Package, Send,
    ShoppingCart, Building2, Box, ClipboardCheck, Target,
    Wrench, Clock, Image, LogOut, Menu, Plus, CheckCircle,
    FolderOpen, CalendarOff, X, CreditCard, DollarSign, TrendingUp, BarChart2, Video, ClipboardList
} from 'lucide-react';

export const NAV_CONFIG = {
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
        basePath:     '/',
        items: [
            { name: 'My Dashboard',    icon: LayoutDashboard, path: '/?tab=overview',    tab: 'overview' },
            { name: 'My Tasks',        icon: CheckSquare,     path: '/?tab=tasks',        tab: 'tasks' },
            { name: 'Revisions',       icon: Target,          path: '/?tab=revisions',    tab: 'revisions' },
            { name: 'Submitted Tasks', icon: CheckSquare,     path: '/?tab=submissions',  tab: 'submissions' },
            { name: 'Meetings',        icon: Video,           path: '/meetings' },
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
            { name: 'Completed Projects', icon: CheckCircle, path: '/production-management/completed' },
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
            { name: 'Dashboard',         icon: LayoutDashboard, path: '/site/dashboard' },
            { name: 'Projects',          icon: FolderOpen,      path: '/site/projects' },
            { name: 'Tasks',             icon: CheckSquare,     path: '/site/tasks' },
            { name: 'Transferred Tasks', icon: Users,           path: '/site/transferred-tasks' },
            { name: 'Reports',           icon: FileText,        path: '/site/reports' },
            { name: 'Staff Reports',     icon: ClipboardList,   path: '/site/staff-reports' },
            { name: 'Leave Request',     icon: CalendarOff,     path: '/site/leave' },
            { name: 'Meetings',          icon: Video,           path: '/meetings' },
        ],
    },

    'Site Supervisor': {
        brandTitle:   'Site Supervisor',
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

    'Accounts Manager': {
        brandTitle:    'Accounts Hub',
        brandSubtitle: 'FINANCIAL MANAGEMENT',
        sidebarClass:  'accounts',
        basePath:      '/',
        items: [
            { name: 'Dashboard',      icon: LayoutDashboard, path: '/?tab=overview',      tab: 'overview' },
            { name: 'Projects',       icon: FolderOpen,      path: '/?tab=projects',      tab: 'projects' },
            { name: 'Invoices',       icon: FileText,        path: '/?tab=invoices',      tab: 'invoices' },
            { name: 'Payments',       icon: CreditCard,      path: '/?tab=payments',      tab: 'payments' },
            { name: 'Expenses',       icon: DollarSign,      path: '/?tab=expenses',      tab: 'expenses' },
            { name: 'Clients',        icon: Users,           path: '/?tab=clients',       tab: 'clients' },
            { name: 'Vendors',        icon: Building2,       path: '/?tab=vendors',       tab: 'vendors' },
            { name: 'Reports',        icon: BarChart2,       path: '/?tab=reports',       tab: 'reports' },
            { name: 'Meetings',       icon: Video,           path: '/meetings' },
        ],
    },

    'Accounts Staff': {
        brandTitle:    'Accounts Portal',
        brandSubtitle: 'STAFF WORKSPACE',
        sidebarClass:  'accounts',
        basePath:      '/',
        items: [
            { name: 'Overview',       icon: LayoutDashboard, path: '/?tab=overview',      tab: 'overview' },
            { name: 'Invoices',       icon: FileText,        path: '/?tab=invoices',      tab: 'invoices' },
            { name: 'Payments',       icon: CreditCard,      path: '/?tab=payments',      tab: 'payments' },
            { name: 'Expenses',       icon: DollarSign,      path: '/?tab=expenses',      tab: 'expenses' },
            { name: 'Vendors',        icon: Building2,       path: '/?tab=vendors',       tab: 'vendors' },
            { name: 'Meetings',       icon: Video,           path: '/meetings' },
        ],
    },
};
