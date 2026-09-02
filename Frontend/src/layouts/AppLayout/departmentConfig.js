import {
    LayoutDashboard, Wallet, CreditCard, Receipt, FileText,
    Building2, BookOpen, BarChart3, Clock, Users, ShoppingBag,
    Briefcase, PieChart, Video, CheckCircle, Package, Truck,
    TrendingUp, Calendar, Layers, ShieldCheck, UserCheck,
    Palette, Compass, CheckSquare, FolderGit2, Wrench, Settings,
    Target, Box, Award, MessageSquare
} from 'lucide-react';

/**
 * Department Configurations & Navigations
 * Universal registry for all Woodaura departments.
 */
export const DEPARTMENT_CONFIGS = {
    accounts: {
        id: 'accounts',
        name: 'Accounts Manager',
        subtitle: 'FINANCE CONTROL',
        defaultSection: 'FINANCE CONTROL',
        roles: ['Accounts Manager', 'Accounts Staff', 'Super Admin', 'Admin'],
        menus: [
            {
                section: 'FINANCE CONTROL',
                items: [
                    { tab: 'overview',   label: 'Overview',            icon: LayoutDashboard, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'vouchers',   label: 'Vouchers',            icon: Receipt,         roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'ledgers',    label: 'Ledgers',             icon: BookOpen,        roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'programs',   label: 'Programs',            icon: Building2,       roles: ['Admin', 'Accounts Manager'] },
                    { tab: 'accounts_v2',label: 'Bank & Cash',         icon: Wallet,          roles: ['Admin', 'Accounts Manager'] },
                    { tab: 'clearance',  label: 'Payment Clearance',   icon: CheckCircle,     roles: ['Admin', 'Accounts Manager'] },
                    { tab: 'invoices',   label: 'Invoices',            icon: FileText,        roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'payments',   label: 'Payments',            icon: CreditCard,      roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { 
                        tab: 'expenses',   
                        label: 'Expenses',            
                        icon: TrendingUp,
                        roles: ['Admin', 'Accounts Manager', 'Accounts Staff'],
                        subItems: [
                            { tab: 'company_expenses', label: 'Company Expenses', roles: ['Admin', 'Accounts Manager'] }
                        ]
                    },
                    { tab: 'clients',    label: 'Clients',             icon: Users,           roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'vendors',    label: 'Vendors',             icon: ShoppingBag,     roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'projects',   label: 'Projects',            icon: Briefcase,       roles: ['Admin', 'Accounts Manager'] },
                    { tab: 'reports',    label: 'Financial Reports',   icon: PieChart,        roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'staff_reports', label: 'Staff Reports',    icon: FileText,        roles: ['Admin', 'Accounts Manager'] },
                    { tab: 'performance',label: 'Performance Analytics',icon: BarChart3,      roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                    { tab: 'meetings',   label: 'Meetings',            icon: Video,           roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
                ]
            }
        ]
    },

    hr: {
        id: 'hr',
        name: 'HR Manager',
        subtitle: 'PEOPLE MANAGEMENT',
        defaultSection: 'PEOPLE',
        roles: ['HR Manager', 'HR Staff', 'Super Admin', 'Admin'],
        menus: [
            {
                section: 'PEOPLE',
                items: [
                    { tab: 'overview',    label: 'Overview',    icon: LayoutDashboard, path: '/hr' },
                    { tab: 'employees',   label: 'Employees',   icon: Users,           path: '/hr/employees' },
                    { tab: 'attendance',  label: 'Attendance',  icon: Clock,           path: '/hr/attendance' },
                    { tab: 'leave',       label: 'Leave',       icon: Calendar,        path: '/hr/leave' },
                    { tab: 'payroll',     label: 'Payroll',     icon: Wallet,          path: '/hr/payroll' },
                    { tab: 'performance', label: 'Performance', icon: BarChart3,       path: '/hr/performance' }
                ]
            }
        ]
    },

    sales: {
        id: 'sales',
        name: 'Sales Manager',
        subtitle: 'SALES MANAGEMENT',
        defaultSection: 'SALES CONTROL',
        roles: ['Sales Manager', 'Sales Staff', 'Sales Executive', 'Super Admin', 'Admin'],
        menus: [
            {
                section: 'SALES CONTROL',
                items: [
                    { tab: 'dashboard',       label: 'Overview',         icon: LayoutDashboard, path: '/staff/dashboard' },
                    { tab: 'tasks',           label: 'Tasks',            icon: CheckSquare,     path: '/staff/tasks' },
                    { tab: 'site-visits',     label: 'Site Visits',      icon: Compass,         path: '/staff/site-visits' },
                    { tab: 'clients',         label: 'Clients',          icon: Users,           path: '/staff/clients' },
                    { tab: 'quotations',      label: 'Quotations',       icon: FileText,        path: '/staff/quotations' },
                    { tab: 'approvals',       label: 'Approvals',        icon: UserCheck,       path: '/staff/approvals' },
                    { tab: 'meetings',        label: 'Meetings',         icon: Video,           path: '/staff/meetings' },
                    { tab: 'reports',         label: 'Reports',          icon: PieChart,        path: '/staff/reports' }
                ]
            }
        ]
    },

    procurement: {
        id: 'procurement',
        name: 'Procurement Manager',
        subtitle: 'PROCUREMENT CONTROL',
        defaultSection: 'SUPPLY CHAIN',
        roles: ['Procurement Manager', 'Procurement Staff', 'Super Admin', 'Admin'],
        menus: [
            {
                section: 'SUPPLY CHAIN',
                items: [
                    { tab: 'overview',        label: 'Dashboard',        icon: LayoutDashboard, tab: 'overview' },
                    { tab: 'purchase_orders', label: 'Purchase Orders',  icon: ShoppingBag,     tab: 'purchase_orders' },
                    { tab: 'vendors',         label: 'Vendors',          icon: Truck,           tab: 'vendors' },
                    { tab: 'inventory',       label: 'PO Inventory',     icon: Package,         tab: 'inventory' },
                    { tab: 'approvals',       label: 'Approvals',        icon: ShieldCheck,     tab: 'approvals' },
                    { tab: 'reports',         label: 'Reports',          icon: PieChart,        tab: 'reports' },
                    { tab: 'meetings',        label: 'Meetings',         icon: Video,           tab: 'meetings' }
                ]
            }
        ]
    },

    design: {
        id: 'design',
        name: 'Design Studio',
        subtitle: 'DESIGN MANAGEMENT',
        defaultSection: 'CREATIVE CONTROL',
        roles: ['Design Manager', 'Design Staff', 'Super Admin', 'Admin'],
        menus: [
            {
                section: 'CREATIVE CONTROL',
                items: [
                    { tab: 'overview',        label: 'Dashboard',        icon: LayoutDashboard, tab: 'overview' },
                    { tab: 'material-review', label: 'Material Review',  icon: Palette,         tab: 'material-review' },
                    { tab: 'quotations',      label: 'Quotations',       icon: FileText,        tab: 'quotations' },
                    { tab: 'approvals',       label: 'Approvals',        icon: ShieldCheck,     tab: 'approvals' },
                    { tab: 'meetings',        label: 'Meetings',         icon: Video,           tab: 'meetings' }
                ]
            }
        ]
    },

    production: {
        id: 'production',
        name: 'Production Control',
        subtitle: 'PRODUCTION MANAGEMENT',
        defaultSection: 'OPERATIONS',
        roles: ['Project Manager', 'Project Engineer', 'Site Engineer', 'Site Supervisor', 'Super Admin', 'Admin'],
        menus: [
            {
                section: 'OPERATIONS',
                items: [
                    { tab: 'dashboard',  label: 'Overview',      icon: LayoutDashboard, path: '/production-management/dashboard' },
                    { tab: 'handoff',    label: 'Handoff',       icon: FolderGit2,      path: '/production-management/handoff' },
                    { tab: 'projects',   label: 'Projects',      icon: Briefcase,       path: '/production-management/projects' },
                    { tab: 'tasks',      label: 'Tasks Board',   icon: CheckSquare,     path: '/production-management/tasks' },
                    { tab: 'team',       label: 'Team Overview', icon: Users,           path: '/production-management/team' },
                    { tab: 'approvals',  label: 'Approvals',     icon: ShieldCheck,     path: '/production-management/approvals' },
                    { tab: 'reports',    label: 'Reports',       icon: PieChart,        path: '/production-management/reports' }
                ]
            }
        ]
    },

    admin: {
        id: 'admin',
        name: 'Executive Portal',
        subtitle: 'EXECUTIVE CONTROL',
        defaultSection: 'EXECUTIVE',
        roles: ['Super Admin', 'Admin', 'Superadmin'],
        menus: [
            {
                section: 'EXECUTIVE & OVERVIEW',
                items: [
                    { tab: 'dashboard',           label: 'Dashboard Overview',   icon: LayoutDashboard, path: '/' },
                    { tab: 'financial-analytics', label: 'Financial Analytics',  icon: BarChart3,       path: '/financial-analytics' },
                    { tab: 'reports',             label: 'Reports & Analytics',  icon: PieChart,        path: '/reports' }
                ]
            },
            {
                section: 'SALES & CLIENTS',
                items: [
                    { tab: 'quotations',          label: 'Quotations',           icon: FileText,        path: '/quotations' },
                    { tab: 'clients',             label: 'Clients',              icon: Users,           path: '/clients' },
                    { tab: 'invoice',             label: 'Invoices',             icon: Receipt,         path: '/invoice' }
                ]
            },
            {
                section: 'OPERATIONS & PROJECTS',
                items: [
                    { tab: 'projects',            label: 'Projects',             icon: Briefcase,       path: '/projects' },
                    { tab: 'tasks',               label: 'Tasks',                icon: CheckSquare,     path: '/tasks' },
                    { tab: 'milestones',          label: 'Milestones',           icon: Target,          path: '/milestones' },
                    { tab: 'approvals',           label: 'Approvals',            icon: ShieldCheck,     path: '/approvals' },
                    { tab: 'material-review',     label: 'Material Review',      icon: Palette,         path: '/material-review' }
                ]
            },
            {
                section: 'PROCUREMENT & INVENTORY',
                items: [
                    { tab: 'inventory',           label: 'Inventory',            icon: Package,         path: '/inventory' },
                    { tab: 'purchase-orders',     label: 'Purchase Orders',      icon: ShoppingBag,     path: '/purchase-orders' },
                    { tab: 'po-inventory',        label: 'PO Inventory',         icon: Box,             path: '/po-inventory' }
                ]
            },
            {
                section: 'STAFF & HR',
                items: [
                    { tab: 'staff',               label: 'Staff Directory',      icon: UserCheck,       path: '/staff' },
                    { tab: 'employee-analysis',   label: 'Employee Analysis',    icon: Award,           path: '/employee-analysis' },
                    { tab: 'staff-reports',       label: 'Staff Reports',        icon: MessageSquare,   path: '/staff-reports' },
                    { tab: 'meetings',            label: 'Meetings',             icon: Video,           path: '/meetings' },
                    { tab: 'settings',            label: 'System Settings',      icon: Settings,        path: '/settings' }
                ]
            }
        ]
    }
};

/**
 * Universal Tab & Route Metadata Registry
 */
export const TAB_META = {
    // Accounts
    overview:          { label: 'Overview',               description: 'High-level performance and operational metrics' },
    dashboard:         { label: 'Dashboard Overview',      description: 'System overview and executive KPIs' },
    vouchers:          { label: 'Vouchers',               description: 'Manage Payments, Receipts, Purchases, and Sales' },
    ledgers:           { label: 'Ledgers',                description: 'Vendor and Customer running balances' },
    programs:          { label: 'Project Programs',       description: 'Project financials and procurement clearance' },
    accounts:          { label: 'Bank & Cash',            description: 'Company bank accounts and cash flow' },
    accounts_v2:       { label: 'Bank & Cash',            description: 'Company bank accounts and cash flow' },
    invoices:          { label: 'Invoices',               description: 'Manage billing and customer invoices' },
    payments:          { label: 'Payments',               description: 'Payment transactions and settlement history' },
    expenses:          { label: 'Expenses',               description: 'Track and manage operating expenses' },
    company_expenses:  { label: 'Company Expenses',       description: 'Company-level overhead and operational expenses' },
    clearance:         { label: 'Payment Clearance',      description: 'Vendor and contractor payment approvals' },
    clients:           { label: 'Clients',                description: 'Client account statements and outstanding balances' },
    vendors:           { label: 'Vendors',                description: 'Vendor payment ledgers and purchase invoices' },
    projects:          { label: 'Projects',               description: 'Project-specific financial tracking and budgets' },
    reports:           { label: 'Reports & Analytics',    description: 'Detailed analytics and operational summaries' },
    staff_reports:     { label: 'Staff Reports',          description: 'Departmental staff activity and submission reports' },
    performance:       { label: 'Performance Analytics',  description: 'Monitor staff and manager KPIs and performance scores' },
    meetings:          { label: 'Meetings',               description: 'Scheduled reviews and team conferences' },
    // Sales / Procurement / Admin
    tasks:             { label: 'Tasks',                  description: 'Active departmental tasks and milestones' },
    'site-visits':     { label: 'Site Visits',            description: 'Scheduled site inspections and measurements' },
    opportunities:     { label: 'Opportunities',          description: 'Active lead pipeline and customer deals' },
    quotations:        { label: 'Quotations',             description: 'Client quotation drafts and approvals' },
    'material-review': { label: 'Material Review',        description: 'Specification hub and material approvals' },
    approvals:         { label: 'Approvals',              description: 'Pending workflow validations and signs-off' },
    purchase_orders:   { label: 'Purchase Orders',        description: 'Vendor orders and procurement logs' },
    inventory:         { label: 'Inventory',              description: 'Stock levels and procurement warehouse tracking' },
    handoff:           { label: 'Project Handoff',        description: 'Design to production project transitions' },
    team:              { label: 'Team Overview',          description: 'Workforce allocation and project team members' },
    staff:             { label: 'Staff Directory',        description: 'Manage employees, compensation, and access' },
    'financial-analytics': { label: 'Financial Analytics', description: 'Company cash flow, receivables, payables, and transaction stream' },
    invoice:           { label: 'Invoices',               description: 'Manage billing and customer invoices' },
    'employee-analysis':{ label: 'Employee Analysis',     description: 'Staff performance tracking and evaluation' },
    'po-inventory':    { label: 'PO Inventory',           description: 'Purchase order receipts and inventory logs' },
    milestones:        { label: 'Milestones',             description: 'Track key company and project milestones' },
    'staff-reports':   { label: 'Staff Reports',          description: 'Departmental staff submissions and reports' },
    settings:          { label: 'System Settings',        description: 'System configurations and master controls' }
};

/**
 * Search Placeholder Configurations
 */
export const SEARCH_CONFIGS = {
    vouchers:         { placeholder: 'Search vouchers by ref or number...' },
    ledgers:          { placeholder: 'Search ledgers by name...' },
    programs:         { placeholder: 'Search projects or clients...' },
    accounts:         { placeholder: 'Search bank & cash accounts...' },
    accounts_v2:      { placeholder: 'Search bank & cash accounts...' },
    payments:         { placeholder: 'Search payments...' },
    expenses:         { placeholder: 'Search expenses...' },
    company_expenses: { placeholder: 'Search company expenses...' },
    clients:          { placeholder: 'Search clients...' },
    vendors:          { placeholder: 'Search vendors...' },
    tasks:            { placeholder: 'Search tasks by title or assignee...' },
    projects:         { placeholder: 'Search projects...' },
    quotations:       { placeholder: 'Search quotations...' },
    purchase_orders:  { placeholder: 'Search purchase orders...' },
    staff:            { placeholder: 'Search staff by name or role...' }
};

/**
 * Helper to resolve department configuration from explicit prop or user role
 */
export const resolveDepartment = (explicitDepartment, userRole) => {
    if (explicitDepartment && DEPARTMENT_CONFIGS[explicitDepartment.toLowerCase()]) {
        return DEPARTMENT_CONFIGS[explicitDepartment.toLowerCase()];
    }

    const role = (userRole || '').toLowerCase();

    if (role.includes('account')) return DEPARTMENT_CONFIGS.accounts;
    if (role.includes('hr')) return DEPARTMENT_CONFIGS.hr;
    if (role.includes('sale')) return DEPARTMENT_CONFIGS.sales;
    if (role.includes('procurement')) return DEPARTMENT_CONFIGS.procurement;
    if (role.includes('design')) return DEPARTMENT_CONFIGS.design;
    if (role.includes('project') || role.includes('site') || role.includes('production') || role.includes('engineer') || role.includes('supervisor')) {
        return DEPARTMENT_CONFIGS.production;
    }
    if (role.includes('admin') || role.includes('manager')) return DEPARTMENT_CONFIGS.admin;

    return DEPARTMENT_CONFIGS.accounts;
};
