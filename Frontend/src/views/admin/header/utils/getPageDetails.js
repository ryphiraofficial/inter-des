export const getPageDetails = (location, user) => {
    const path = location.pathname;
    const tab = new URLSearchParams(location.search).get('tab')?.toLowerCase();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };
    const userName = user?.fullName?.split(' ')[0] || 'Admin';

    if (path === '/') {
        if (tab === 'invoices') return { title: 'Invoices', subtitle: 'Manage your client invoices.' };
        if (tab === 'expenses') return { title: 'Expenses', subtitle: 'Track your business spending.' };
        if (tab === 'payments') return { title: 'Payments', subtitle: 'Manage your incoming payments.' };
        if (tab === 'clients') return { title: 'Clients', subtitle: 'Manage your client database.' };
        if (tab === 'vendors') return { title: 'Vendors', subtitle: 'Manage your vendors and suppliers.' };
        if (tab === 'projects') return { title: 'Projects', subtitle: 'Manage your ongoing projects.' };
        if (tab === 'reports') return { title: 'Analytics Reports', subtitle: 'Detailed overview of performance.' };
        if (tab === 'pipeline') return { title: 'Design Pipeline', subtitle: 'Manage your studio workflow.' };
        if (tab === 'overview' || tab === 'dashboard') {
            return { 
                title: `${getGreeting()}, ${userName} 👋`, 
                subtitle: "Here's your financial overview today." 
            };
        }
        if (tab === 'requests') return { title: 'Material Requests', subtitle: 'Manage pending material requests.' };
        return { title: 'Dashboard', subtitle: "Welcome back! Here's your business overview." };
    }
    
    const staticMap = {
        '/quotations': { title: 'Quotations', subtitle: 'Detailed overview of project estimates.' },
        '/quotations/new': { title: 'New Quotation', subtitle: 'Craft a professional estimate.' },
        '/inventory': { title: 'Global Inventory', subtitle: 'Track your primary design materials.' },
        '/purchase-orders': { title: 'Purchase Orders', subtitle: 'Manage supplier orders.' },
        '/po-inventory': { title: 'PO Tracking', subtitle: 'Monitor stock received through POs.' },
        '/clients': { title: 'Relationships', subtitle: 'Manage your client database.' },
        '/tasks': { title: 'Tasks Hub', subtitle: 'Keep track of project milestones.' },
        '/reports': { title: 'Analytics', subtitle: 'Deep dive into your revenue metrics.' },
        '/settings': { title: 'System Controls', subtitle: 'Configure your preferences.' },
        '/users': { title: 'Team Access', subtitle: 'Manage staff accounts.' },
        '/invoice': { title: 'Invoices', subtitle: 'Generate and track professional client invoices.' },
        '/projects': { title: 'Projects', subtitle: 'Detailed overview of all ongoing projects.' },
        '/staff': { title: 'Staff', subtitle: 'Manage your team members and roles.' },
        '/approvals': { title: 'Approvals', subtitle: 'Review and manage pending design approvals.' },
        '/material-review': { title: 'Material Review', subtitle: 'Review and approve material requests.' },
        '/engineer/dashboard': { title: 'Dashboard', subtitle: 'Overview of assigned tasks' },
        '/engineer/projects': { title: 'My Projects', subtitle: 'Projects you are assigned to' },
        '/engineer/tasks': { title: 'My Tasks', subtitle: 'All tasks assigned to you' },
        '/engineer/leave': { title: 'Leave Request', subtitle: 'Submit and track applications' },
        '/engineer/reports': { title: 'Site Monitoring', subtitle: 'Review daily progress logs' },
        '/engineer/approvals': { title: 'Approvals', subtitle: 'Review and approve requests' },
        '/site/dashboard': { title: 'Dashboard', subtitle: 'Your site tasks at a glance' },
        '/site/projects': { title: 'My Projects', subtitle: 'Projects assigned to you' },
        '/site/tasks': { title: 'My Tasks', subtitle: 'Tasks assigned from Engineer' },
        '/site/transferred-tasks': { title: 'Transferred Tasks', subtitle: 'Tasks delegated to supervisors' },
        '/site/reports': { title: 'Site Reports', subtitle: 'Submit daily progress reports' },
        '/site/leave': { title: 'Leave Request', subtitle: 'Submit and track applications' },
        '/meetings': { title: 'Meetings', subtitle: 'Schedule and manage Google Meet sessions.' },
    };

    if (staticMap[path]) return staticMap[path];
    
    if (path.startsWith('/production-management/dashboard')) return { title: 'Production Dashboard', subtitle: 'Overview of operations' };
    if (path.startsWith('/production-management/projects')) return { title: 'Projects Overview', subtitle: 'Manage projects' };
    if (path.startsWith('/production-management/tasks')) return { title: 'Tasks Board', subtitle: 'Track production tasks' };
    if (path.startsWith('/production-management/team')) return { title: 'Team Directory', subtitle: 'Manage team members' };
    if (path.startsWith('/production-management/approvals')) return { title: 'Approvals & Requests', subtitle: 'Review requests' };
    if (path.startsWith('/production-management/handoff')) return { title: 'Project Handoff', subtitle: 'Review new projects' };
    if (path.startsWith('/production-management/reports')) return { title: 'Reports & Export', subtitle: 'Analytics data' };
    if (path.startsWith('/production-management/completed')) return { title: 'Completed Projects', subtitle: 'Archive of finished projects' };
    if (path.startsWith('/engineer/projects/')) return { title: 'Project Detail', subtitle: 'Project overview and tasks' };
    if (path.startsWith('/site/projects/')) return { title: 'Project Detail', subtitle: 'Project overview and tasks' };
    if (path.startsWith('/engineer/tasks/')) return { title: 'Task Detail', subtitle: 'Full task view' };
    if (path.startsWith('/site/tasks/')) return { title: 'Task Detail', subtitle: 'Full task view' };

    return {
        title: path.replace('/', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        subtitle: ''
    };
};
