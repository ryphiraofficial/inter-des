import { LayoutDashboard, Wallet, CreditCard, Receipt, FileText, Building2, BookOpen, BarChart3, Clock, Users } from 'lucide-react';

export const NAV_ITEMS = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'vouchers', label: 'Vouchers', icon: Receipt, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'ledgers', label: 'Ledgers', icon: BookOpen, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'programs', label: 'Project Programs', icon: Building2, roles: ['Admin', 'Accounts Manager'] },
    { tab: 'accounts', label: 'Bank & Cash', icon: Wallet, roles: ['Admin', 'Accounts Manager'] },
    { tab: 'accounts_v2', label: 'Bank & Cash', icon: Wallet, roles: ['Admin', 'Accounts Manager'] },
    { tab: 'invoices', label: 'Invoices', icon: FileText, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'performance', label: 'Performance', icon: BarChart3, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] }
];

export const TAB_META = {
    dashboard:         { label: 'Overview',               description: 'High-level financial performance and metrics' },
    overview:          { label: 'Overview',               description: 'High-level financial performance and metrics' },
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
    reports:           { label: 'Financial Reports',      description: 'P&L, Balance Sheets, and Cash Flow statements' },
    staff_reports:     { label: 'Staff Reports',          description: 'Departmental staff expense and activity reports' },
    performance:       { label: 'Performance Analytics',  description: 'Monitor staff and manager KPIs and performance scores' },
    meetings:          { label: 'Meetings',               description: 'Scheduled financial review meetings' }
};

export const SEARCH_CONFIGS = {
    vouchers:         { placeholder: 'Search vouchers by ref or number...' },
    ledgers:          { placeholder: 'Search ledgers by name...' },
    programs:         { placeholder: 'Search projects or clients...' },
    accounts:         { placeholder: 'Search bank & cash accounts...' },
    accounts_v2:      { placeholder: 'Search bank & cash accounts...' },
    invoices:         { placeholder: 'Search by client or invoice number...' },
    payments:         { placeholder: 'Search payments...' },
    expenses:         { placeholder: 'Search expenses...' },
    company_expenses: { placeholder: 'Search company expenses...' },
    clients:          { placeholder: 'Search clients...' },
    vendors:          { placeholder: 'Search vendors...' }
};
