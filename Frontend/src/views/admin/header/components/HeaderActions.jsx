import React from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActionBtn = ({ show, onClick, label, icon: Icon = Plus, variant = 'primary', className = '', to }) => {
    if (!show) return null;
    
    if (to) {
        return (
            <Link to={to} className={`btn-${variant} ${className}`.trim()}>
                <Icon size={18} strokeWidth={2.4} />
                <span className="nav-btn-text">{label}</span>
            </Link>
        );
    }

    return (
        <button
            className={`btn-${variant} ${className}`.trim()}
            onClick={onClick}
        >
            <Icon size={18} strokeWidth={2.4} />
            <span className="nav-btn-text">{label}</span>
        </button>
    );
};

const HeaderActions = ({ isHome, tab, location, user }) => {
    return (
        <>

            {(isHome && tab === 'invoices' || location.pathname === '/invoice') && (
                <ActionBtn show={true} onClick={() => window.dispatchEvent(new CustomEvent('open-create-invoice-modal'))} label="Create Invoice" variant="primary" />
            )}
            <ActionBtn show={isHome && tab === 'expenses'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))} label="Add Expense" variant="primary" />
            <ActionBtn show={isHome && tab === 'payments'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-payment-modal'))} label="Record Payment" variant="success" />
            <ActionBtn show={isHome && tab === 'clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add Client" variant="primary" />
            <ActionBtn show={isHome && tab === 'reports'} onClick={() => window.dispatchEvent(new CustomEvent('export-reports-pdf'))} label="Export PDF" icon={Download} variant="primary" />
            <ActionBtn show={location.pathname === '/quotations'} to="/quotations/new" label="New Quotation" variant="primary" />
            <ActionBtn show={location.pathname === '/po-inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-po-inventory-modal'))} label="Add Item" variant="primary" />
            <ActionBtn show={location.pathname === '/purchase-orders'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-po-modal'))} label="Create PO" variant="primary" />
            <ActionBtn show={location.pathname === '/tasks'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-task-modal'))} label="Assign New Task" variant="primary" />
            <ActionBtn show={location.pathname === '/site/leave' || location.pathname === '/engineer/leave'} onClick={() => window.dispatchEvent(new CustomEvent('open-new-leave-drawer'))} label="New Application" variant="success" />
            <ActionBtn show={location.pathname.startsWith('/production-management/tasks')} onClick={() => window.dispatchEvent(new CustomEvent('open-create-production-task-modal'))} label="New Task" variant="primary" className="header-production-task-navbar-btn" />
            <ActionBtn show={location.pathname.startsWith('/production-management/team')} onClick={() => window.dispatchEvent(new CustomEvent('open-create-production-member-modal'))} label="Add Member" variant="primary" className="header-production-team-navbar-btn" />
            <ActionBtn show={location.pathname.startsWith('/production-management/reports')} onClick={() => window.dispatchEvent(new CustomEvent('export-production-reports-pdf'))} label="Export" icon={Download} variant="primary" className="header-production-reports-navbar-btn" />
            <ActionBtn show={location.pathname === '/staff'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-staff-modal'))} label="Add New Staff" variant="primary" />
            <ActionBtn show={location.pathname === '/clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add New Client" variant="primary" />
            <ActionBtn show={location.pathname === '/inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-inventory-modal'))} label="Add New Item" variant="primary" />
            <ActionBtn show={location.pathname === '/meetings' && ['super admin', 'admin', 'superadmin'].includes(user?.role?.toLowerCase())} onClick={() => window.dispatchEvent(new CustomEvent('open-schedule-meeting-modal'))} label="Schedule Meeting" variant="primary" />

            
            {isHome && tab === 'vendors' && user?.role?.toLowerCase() === 'procurement manager' && (
                <button
                    className="btn-primary header-vendor-navbar-btn"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-create-vendor-modal'))}
                >
                    <Plus size={18} strokeWidth={2.4} />
                    <span>Add Vendor</span>
                </button>
            )}

            <ActionBtn 
                show={(location.pathname.endsWith('/staff-reports') || location.pathname.endsWith('/reports')) && !['admin', 'super admin', 'superadmin', 'manager', 'design manager', 'procurement manager', 'project manager', 'accounts manager'].includes(user?.role?.toLowerCase() || '')} 
                onClick={() => window.dispatchEvent(new CustomEvent('open-new-staff-report'))} 
                label="New Report" 
                variant="primary" 
            />
        </>
    );
};

export default HeaderActions;
