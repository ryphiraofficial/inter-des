import { useMemo } from 'react';

export const useRoleDashboard = (role) => {
    return useMemo(() => {
        if (!role) return 'default';

        const roleLower = role.toLowerCase();

        // Check for specific department managers (not general admin)
        if (roleLower === 'design manager') return 'design_manager';
        if (roleLower === 'design staff') return 'design_staff';
        if (roleLower === 'procurement manager') return 'procurement_manager';
        if (roleLower === 'procurement staff') return 'procurement_staff';
        if (roleLower === 'project manager') return 'project_manager';
        if (roleLower === 'project engineer') return 'project_engineer';
        if (roleLower === 'site engineer') return 'site_engineer';
        if (roleLower === 'site supervisor') return 'site_supervisor';
        if (roleLower === 'accounts manager') return 'accounts_manager';
        if (roleLower === 'accounts staff') return 'accounts_staff';
        if (roleLower.includes('sales')) return 'sales';

        // General roles
        if (roleLower === 'super admin' || roleLower === 'admin' || roleLower === 'manager') {
            return 'admin';
        }

        // General roles fallback
        if (roleLower.includes('admin') || roleLower === 'manager') {
            return 'admin';
        }
        if (roleLower.includes('staff') || roleLower.includes('designer')) {
            return 'staff';
        }

        return 'default';
    }, [role]);
};

export const getRolePermissions = (role) => {
    const normalizeRole = (r) => {
        if (!r) return 'default';
        const roleLower = r.toLowerCase();
        if (roleLower === 'design manager') return 'design_manager';
        if (roleLower === 'design staff') return 'design_staff';
        if (roleLower === 'procurement manager') return 'procurement_manager';
        if (roleLower === 'procurement staff') return 'procurement_staff';
        if (roleLower === 'project manager') return 'project_manager';
        if (roleLower === 'project engineer') return 'project_engineer';
        if (roleLower === 'site engineer') return 'site_engineer';
        if (roleLower === 'site supervisor') return 'site_supervisor';
        if (roleLower === 'accounts manager') return 'accounts_manager';
        if (roleLower === 'accounts staff') return 'accounts_staff';
        if (roleLower === 'super admin' || roleLower === 'admin' || roleLower === 'manager') return 'admin';
        return 'default';
    };
    
    const roleKey = normalizeRole(role);
    
    const permissions = {
        design_manager: {
            canApproveQuotations: true,
            canAssignTasks: true,
            canManageDesign: true,
            canTagMaterials: true,
            canMoveToProcurement: true,
            canViewBudget: true,
            canManageTeam: true
        },
        design_staff: {
            canCreateQuotations: true,
            canUploadDrawings: true,
            canTagMaterials: true,
            canUpdateTasks: true,
            canViewAssignedProjects: true
        },
        procurement_manager: {
            canCompareVendors: true,
            canApprovePO: true,
            canManageVendors: true,
            canViewBudget: true,
            canMoveToProduction: true,
            canManageTeam: true
        },
        procurement_staff: {
            canCompareVendors: true,
            canCreatePO: true,
            canViewMaterialRequests: true,
            canMarkReceived: true
        },
        project_manager: {
            canAssignTasks: true,
            canManageProduction: true,
            canMonitorChecklist: true,
            canResolveIssues: true,
            canMoveToCompleted: true,
            canManageTeam: true
        },
        project_engineer: {
            canUpdateTasks: true,
            canUploadPhotos: true,
            canReportIssues: true,
            canUpdateChecklist: true,
            canViewAssignedTasks: true,
            canAssignTasks: true
        },
        site_engineer: {
            canUpdateTasks: true,
            canUploadPhotos: true,
            canReportIssues: true,
            canUpdateChecklist: true,
            canViewAssignedTasks: true
        },
        site_supervisor: {
            canUpdateTasks: true,
            canUploadPhotos: true,
            canReportIssues: true,
            canUpdateChecklist: true,
            canViewAssignedTasks: true
        },
        accounts_manager: {
            canCreateInvoices: true,
            canRecordPayments: true,
            canManageExpenses: true,
            canViewFinancials: true,
            canGenerateReports: true,
            canManageTeam: true
        },
        accounts_staff: {
            canRecordPayments: true,
            canAddExpenses: true,
            canViewInvoices: true,
            canGenerateReceipts: true
        },
        admin: {
            canApproveQuotations: true,
            canAssignTasks: true,
            canManageDesign: true,
            canCompareVendors: true,
            canApprovePO: true,
            canManageProduction: true,
            canCreateInvoices: true,
            canRecordPayments: true,
            canViewBudget: true,
            canManageTeam: true,
            canManageUsers: true
        },
        default: {
            canViewAssignedTasks: true,
            canUpdateOwnTasks: true
        }
    };

    return permissions[roleKey] || permissions.default;
};

export const getRoleDepartment = (role) => {
    if (!role) return 'General';
    
    const roleLower = role.toLowerCase();
    
    if (roleLower === 'design manager' || roleLower === 'design staff') return 'Design';
    if (roleLower === 'procurement manager' || roleLower === 'procurement staff') return 'Procurement';
    if (roleLower === 'project manager' || roleLower === 'project engineer' || roleLower === 'site engineer' || roleLower === 'site supervisor') return 'Production';
    if (roleLower === 'accounts manager' || roleLower === 'accounts staff') return 'Accounts';
    if (roleLower.includes('sales')) return 'Sales';
    
    return 'Admin';
};

// Check if user is a department manager (goes to Admin layout)
export const isDepartmentManager = (role) => {
    if (!role) return false;
    const roleLower = role.toLowerCase().replace(/\s+/g, '');
    return (
        roleLower === 'designmanager' ||
        roleLower === 'procurementmanager' ||
        roleLower === 'projectmanager' ||
        roleLower === 'accountsmanager'
    );
};

// Check if user is department staff (goes to Staff layout)
export const isDepartmentStaff = (role) => {
    if (!role) return false;
    const roleLower = role.toLowerCase().replace(/\s+/g, '');
    return (
        roleLower === 'designstaff' ||
        roleLower === 'procurementstaff' ||
        roleLower === 'projectengineer' ||
        roleLower === 'siteengineer' ||
        roleLower === 'sitesupervisor' ||
        roleLower === 'accountsstaff' ||
        roleLower === 'staff'
    );
};

// Check if user is super admin/admin (full access to Admin layout)
export const isSuperAdmin = (role) => {
    if (!role) return false;
    const roleLower = role.toLowerCase();
    return (
        roleLower.includes('super admin') ||
        roleLower === 'admin' ||
        roleLower === 'superadmin'
    );
};

// Combined check for Admin layout access
export const isAdminLayout = (role) => {
    if (!role) return false;
    const roleLower = role.toLowerCase();
    // Sales roles always go to Staff layout
    if (roleLower.includes('sales')) return false;
    // Department-specific roles use their own dedicated layouts
    if (
        roleLower.includes('accounts') ||
        roleLower.includes('procurement') ||
        roleLower.includes('design')
    ) return false;
    return isSuperAdmin(role) || roleLower === 'admin' || roleLower === 'manager' || roleLower === 'project manager' || roleLower.includes('project');
};

// Check for Staff layout access (Sales roles only)
export const isStaffLayout = (role) => {
    if (!role) return false;
    const roleLower = role.toLowerCase();
    // Sales (all variants) always use Staff layout
    if (roleLower.includes('sales')) return true;
    // Department-specific staff roles are excluded — they use their own dedicated layouts
    if (
        roleLower.includes('accounts') ||
        roleLower.includes('design') ||
        roleLower.includes('procurement')
    ) return false;
    // Generic 'staff' or 'designer' roles
    return (roleLower.includes('staff') || roleLower.includes('designer')) && !roleLower.includes('manager');
};


