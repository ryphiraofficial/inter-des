import React from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActionBtn = ({ show, onClick, label, icon: Icon = Plus, variant = 'primary', className = '' }) => {
    if (!show) return null;
    
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
            {isHome && (!tab || tab === 'overview' || tab === 'dashboard') && !['design manager', 'procurement manager'].includes(user?.role?.toLowerCase()) && (
                <Link to="/quotations/new" className="no-underline">
                    <ActionBtn show={true} label="New Quotation" variant="primary" />
                </Link>
            )}
            {(isHome && tab === 'invoices' || location.pathname === '/invoice') && (
                <ActionBtn show={true} onClick={() => window.dispatchEvent(new CustomEvent('open-create-invoice-modal'))} label="Create Invoice" variant="primary" />
            )}
            <ActionBtn show={isHome && tab === 'expenses'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-expense-modal'))} label="Add Expense" variant="primary" />
            <ActionBtn show={isHome && tab === 'payments'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-payment-modal'))} label="Record Payment" variant="success" />
            <ActionBtn show={isHome && tab === 'clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add Client" variant="primary" />
            <ActionBtn show={isHome && tab === 'projects'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-project-modal'))} label="New Project" variant="primary" />
            <ActionBtn show={isHome && tab === 'reports'} onClick={() => window.dispatchEvent(new CustomEvent('export-reports-pdf'))} label="Export PDF" icon={Download} variant="primary" />
            <ActionBtn show={location.pathname === '/po-inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-po-inventory-modal'))} label="Add Item" variant="primary" />
            <ActionBtn show={location.pathname === '/purchase-orders'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-po-modal'))} label="Create PO" variant="primary" />
            <ActionBtn show={location.pathname === '/tasks'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-task-modal'))} label="Assign New Task" variant="primary" />
            <ActionBtn show={location.pathname.startsWith('/production-management/tasks')} onClick={() => window.dispatchEvent(new CustomEvent('open-create-production-task-modal'))} label="New Task" variant="primary" className="header-production-task-navbar-btn" />
            <ActionBtn show={location.pathname.startsWith('/production-management/projects')} onClick={() => {}} label="New Project" variant="primary" className="header-production-project-navbar-btn" />
            <ActionBtn show={location.pathname.startsWith('/production-management/team')} onClick={() => window.dispatchEvent(new CustomEvent('open-create-production-member-modal'))} label="Add Member" variant="primary" className="header-production-team-navbar-btn" />
            <ActionBtn show={location.pathname.startsWith('/production-management/reports')} onClick={() => window.dispatchEvent(new CustomEvent('export-production-reports-pdf'))} label="Export" icon={Download} variant="primary" className="header-production-reports-navbar-btn" />
            <ActionBtn show={location.pathname === '/staff'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-staff-modal'))} label="Add New Staff" variant="primary" />
            <ActionBtn show={location.pathname === '/clients'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-client-modal'))} label="Add New Client" variant="primary" />
            <ActionBtn show={location.pathname === '/inventory'} onClick={() => window.dispatchEvent(new CustomEvent('open-inventory-modal'))} label="Add New Item" variant="primary" />
            <ActionBtn show={location.pathname === '/users'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-user-modal'))} label="Add New User" variant="primary" />
            <ActionBtn show={location.pathname === '/projects'} onClick={() => window.dispatchEvent(new CustomEvent('open-create-project-modal'))} label="New Project" variant="primary" />
            <ActionBtn show={location.pathname === '/meetings'} onClick={() => window.dispatchEvent(new CustomEvent('open-schedule-meeting-modal'))} label="Schedule Meeting" variant="primary" />
            {location.pathname === '/quotations' && (
                <Link to="/quotations/new" className="no-underline">
                    <ActionBtn show={true} label="New Quotation" variant="primary" />
                </Link>
            )}
            
            {isHome && tab === 'vendors' && user?.role?.toLowerCase() === 'procurement manager' && (
                <button
                    className="btn-primary header-vendor-navbar-btn"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-create-vendor-modal'))}
                >
                    <Plus size={18} strokeWidth={2.4} />
                    <span>Add Vendor</span>
                </button>
            )}
        </>
    );
};

export default HeaderActions;
