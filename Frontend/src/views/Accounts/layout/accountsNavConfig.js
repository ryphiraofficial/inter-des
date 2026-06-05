// Tab metadata — label & description for each accounts tab
export const TAB_META = {
    overview:          { label: 'Overview',               description: 'High-level financial performance and metrics' },
    clearance:         { label: 'Payment Clearance Hub',  description: 'Review and approve pending project payments' },
    collections:       { label: 'My Collections',         description: 'Track and manage your payment collections' },
    invoices:          { label: 'Invoices',               description: 'Manage billing and customer invoices' },
    payments:          { label: 'Payments',               description: 'Track incoming and outgoing transactions' },
    expenses:          { label: 'All Expenses',           description: 'Monitor and categorize all spending' },
    company_expenses:  { label: 'Company Expenses',       description: 'Monitor internal overhead and operational expenses' },
    clients:           { label: 'Clients',                description: 'Manage financial records for all clients' },
    vendors:           { label: 'Vendors',                description: 'Manage supplier and vendor accounts' },
    projects:          { label: 'Projects',               description: 'Financial overview of active projects' },
    reports:           { label: 'Financial Reports',      description: 'Generate detailed financial analytics' },
    meetings:          { label: 'Meetings',               description: 'Schedule and manage finance meetings' }
};

export const SEARCH_CONFIGS = {
    clearance:        { placeholder: 'Search projects...' },
    collections:      { placeholder: 'Search project name, ID, or client...' },
    clients:          { placeholder: 'Search by name, email or phone...' },
    payments:         { placeholder: 'Search by client or reference...' },
    company_expenses: { placeholder: 'Search company expenses...' },
    vendors:          { placeholder: 'Search by name or category...' }
};
