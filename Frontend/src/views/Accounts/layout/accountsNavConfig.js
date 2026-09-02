import { LayoutDashboard, Wallet, CreditCard, Receipt, FileText, Building2, BookOpen, BarChart3, Clock, Users } from 'lucide-react';

export const NAV_ITEMS = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'vouchers', label: 'Vouchers', icon: Receipt, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'ledgers', label: 'Ledgers', icon: BookOpen, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'programs', label: 'Project Programs', icon: Building2, roles: ['Admin', 'Accounts Manager'] },
    { tab: 'accounts', label: 'Bank & Cash', icon: Wallet, roles: ['Admin', 'Accounts Manager'] },
    { tab: 'invoices', label: 'Invoices', icon: FileText, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] },
    { tab: 'performance', label: 'Performance', icon: BarChart3, roles: ['Admin', 'Accounts Manager', 'Accounts Staff'] }
];

export const TAB_META = {
    dashboard:         { label: 'Overview',               description: 'High-level financial performance and metrics' },
    vouchers:          { label: 'Vouchers',               description: 'Manage Payments, Receipts, Purchases, and Sales' },
    ledgers:           { label: 'Ledgers',                description: 'Vendor and Customer running balances' },
    programs:          { label: 'Project Programs',       description: 'Project financials and procurement clearance' },
    accounts:          { label: 'Bank & Cash',            description: 'Company bank accounts and cash flow' },
    invoices:          { label: 'Invoices',               description: 'Manage billing and customer invoices' },
    performance:       { label: 'Performance Analytics',  description: 'Monitor staff and manager KPIs and performance scores' }
};

export const SEARCH_CONFIGS = {
    vouchers:         { placeholder: 'Search vouchers by ref or number...' },
    ledgers:          { placeholder: 'Search ledgers by name...' },
    programs:         { placeholder: 'Search projects or clients...' },
    invoices:         { placeholder: 'Search by client or invoice number...' }
};
