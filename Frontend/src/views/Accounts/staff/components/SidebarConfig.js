import {
    LayoutDashboard, CheckSquare, Users, FileText, DollarSign,
    CreditCard, Building2, BarChart2, Calendar, FolderOpen,
    Bell, MessageSquare, Award, Clock, Settings, Shield,
    HelpCircle, Activity
} from 'lucide-react';

export const primaryNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/staff/dashboard' },
    { name: 'My Tasks', icon: CheckSquare, path: '/staff/tasks', badge: '3', badgeColor: 'warning' },
    { name: 'Clients', icon: Users, path: '/staff/clients' },
    { 
        name: 'Invoices', 
        icon: FileText, 
        path: '/staff/dashboard?tab=invoices',
        badge: '2',
        badgeColor: 'danger',
        subItems: [
            { name: 'Pending', path: '/staff/dashboard?tab=invoices-pending', badge: '2', badgeColor: 'danger' },
            { name: 'Processing', path: '/staff/dashboard?tab=invoices-processing' },
            { name: 'Drafts', path: '/staff/dashboard?tab=invoices-drafts' },
        ]
    },
    { 
        name: 'Expenses', 
        icon: DollarSign, 
        path: '/staff/dashboard?tab=expenses',
        subItems: [
            { name: 'Submissions', path: '/staff/dashboard?tab=expenses-submissions' },
            { name: 'Approvals', path: '/staff/dashboard?tab=expenses-approvals' },
        ]
    },
    { name: 'Payments', icon: CreditCard, path: '/staff/dashboard?tab=payments' },
    { name: 'Vendors', icon: Building2, path: '/staff/dashboard?tab=vendors' },
    { name: 'Reports', icon: BarChart2, path: '/staff/dashboard?tab=reports' },
    { name: 'Calendar', icon: Calendar, path: '/staff/dashboard?tab=calendar' },
    { name: 'Documents', icon: FolderOpen, path: '/staff/dashboard?tab=documents' },
];

export const secondaryNav = [
    { name: 'Notifications', icon: Bell, path: '/staff/notifications', badge: 'New', badgeColor: 'primary' },
    { name: 'Internal Notes', icon: MessageSquare, path: '/staff/notes' },
    { name: 'Performance', icon: Award, path: '/staff/performance' },
    { name: 'Attendance', icon: Clock, path: '/staff/attendance' },
];

export const systemNav = [
    { name: 'Settings', icon: Settings, path: '/staff/settings' },
    { name: 'Security', icon: Shield, path: '/staff/security' },
    { name: 'Help Center', icon: HelpCircle, path: '/staff/help' },
    { name: 'Audit Logs', icon: Activity, path: '/staff/audit' },
];
