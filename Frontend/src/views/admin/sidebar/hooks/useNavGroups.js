import { 
    LayoutDashboard, FileText, Box, ShoppingCart, Package, Users, 
    CheckSquare, BarChart, Settings, Shield, Receipt, Briefcase, 
    Target, Palette, Wrench, ClipboardCheck, Calendar, FolderOpen, 
    Bell, MessageSquare, Award, Clock, DollarSign, Building2, Video, Trophy
} from 'lucide-react';
import { getRoleDepartment, useRoleDashboard, isSuperAdmin } from '../../hooks/useRoleDashboard';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/authSlice';

export const useNavGroups = () => {
    const user = useAppSelector(selectUser);
    const dashboardType = useRoleDashboard(user?.role);
    const department = getRoleDepartment(user?.role);

    const getGroups = () => {
        const mainItems = [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
            { name: 'Projects', icon: Target, path: '/projects' },
            { name: 'Meetings', icon: Video, path: '/meetings' },
        ];

        const salesItems = [
            { name: 'Quotations', icon: FileText, path: '/quotations' },
            { name: 'Invoice', icon: Receipt, path: '/invoice' },
            { name: 'Clients', icon: Users, path: '/clients' },
        ];

        const operationsItems = [
            { name: 'Inventory', icon: Box, path: '/inventory' },
            { name: 'Purchase Orders', icon: ShoppingCart, path: '/purchase-orders' },
            { name: 'PO Inventory', icon: Package, path: '/po-inventory' },
            { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
            { name: 'Approvals', icon: Palette, path: '/approvals' },
        ];

        const systemItems = [
            { name: 'Staff', icon: Briefcase, path: '/staff' },
            { name: 'Employee Analysis', icon: Award, path: '/employee-analysis' },
            { name: 'Milestones', icon: Trophy, path: '/milestones' },
            { name: 'Reports', icon: BarChart, path: '/reports' },
            { name: 'Users', icon: Shield, path: '/users' },
            { name: 'Settings', icon: Settings, path: '/settings' },
        ];



        let roleSpecificItems = [];
        if (dashboardType === 'accounts_manager') {
            return [
                {
                    title: "Financial",
                    items: [
                        { name: 'Accounts Overview', icon: LayoutDashboard, path: '/?tab=overview' },
                        { name: 'Payment Clearance', icon: Shield, path: '/?tab=clearance' },
                        { name: 'Invoices', icon: Receipt, path: '/?tab=invoices' },
                        { name: 'Expenses', icon: DollarSign, path: '/?tab=expenses' },
                        { name: 'Payments', icon: Receipt, path: '/?tab=payments' },
                    ]
                },
                {
                    title: "Operations",
                    items: [
                        { name: 'Clients', icon: Users, path: '/?tab=clients' },
                        { name: 'Vendors', icon: Building2, path: '/?tab=vendors' },
                        { name: 'Projects', icon: Target, path: '/?tab=projects' },
                        { name: 'Reports', icon: BarChart, path: '/?tab=reports' },
                    ]
                },
                {
                    title: "Internal",
                    items: [
                        { name: 'Calendar', icon: Calendar, path: '/?tab=calendar' },
                        { name: 'Documents', icon: FolderOpen, path: '/?tab=documents' },
                        { name: 'Notifications', icon: Bell, path: '/?tab=notifications' },
                        { name: 'Internal Notes', icon: MessageSquare, path: '/?tab=notes' },
                        { name: 'Performance', icon: Award, path: '/?tab=performance' },
                        { name: 'Attendance', icon: Clock, path: '/?tab=attendance' },
                    ]
                }
            ];
        } else if (dashboardType === 'design_manager') {
            roleSpecificItems = [
                { name: 'Design Pipeline', icon: Palette, path: '/?tab=pipeline' },
                { name: 'Studio Dashboard', icon: LayoutDashboard, path: '/?tab=dashboard' },
                { name: 'Material Requests', icon: Package, path: '/material-review' },
            ];
        } else if (dashboardType === 'procurement_manager') {
            roleSpecificItems = [
                { name: 'Vendors', icon: Building2, path: '/?tab=vendors' },
                { name: 'Material Requests', icon: Package, path: '/?tab=requests' },
            ];
        } else if (dashboardType === 'project_manager') {
            roleSpecificItems = [
                { name: 'Production Pipeline', icon: Wrench, path: '/' },
                { name: 'Checklists', icon: ClipboardCheck, path: '/checklists' },
            ];
        }

        let filteredMain = [...mainItems];
        if (roleSpecificItems.length > 0) {
            filteredMain[0] = roleSpecificItems[0];
            if (roleSpecificItems.length > 1) {
                filteredMain.splice(1, 0, ...roleSpecificItems.slice(1));
            }
        }

        const groups = [
            { title: "Main", items: filteredMain },
            { title: "Sales", items: salesItems },
            { title: "Operations", items: operationsItems },
            { title: "System", items: systemItems }
        ];

        if (isSuperAdmin(user?.role)) return groups;

        const roleLower = user?.role?.toLowerCase() || '';

        return groups.map(group => {
            const filteredItems = group.items.filter(item => {
                const path = item.path.toLowerCase();
                if (path === '/' || path === '/projects') return true;
                if (roleLower.includes('design')) return ['/', '/?tab=pipeline', '/?tab=dashboard', '/material-review', '/tasks', '/projects'].includes(path);
                if (roleLower.includes('procurement')) return ['/inventory', '/purchase-orders', '/po-inventory', '/tasks'].includes(path);
                if (roleLower.includes('production')) return ['/tasks', '/inventory', '/projects'].includes(path);
                if (roleLower === 'manager') return ['/quotations', '/clients', '/tasks', '/projects', '/reports', '/milestones'].includes(path);
                if (roleLower === 'sales') return ['/quotations', '/clients', '/tasks', '/projects'].includes(path);
                return true;
            });
            return { ...group, items: filteredItems };
        }).filter(group => group.items.length > 0);
    };

    return { navGroups: getGroups(), department };
};
