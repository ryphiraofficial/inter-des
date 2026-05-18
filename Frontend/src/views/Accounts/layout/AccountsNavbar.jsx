import React from 'react';
import { RefreshCw, Landmark } from 'lucide-react';

const AccountsNavbar = ({ user, onRefresh, isLoading }) => {
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    return (
        <header className="accounts-navbar">
            <div className="accounts-navbar-brand">
                <div className="accounts-navbar-icon">
                    <Landmark size={20} />
                </div>
                <div>
                    <span className="accounts-navbar-title">Finance & Accounts Hub</span>
                    <span className="accounts-navbar-subtitle">
                        {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                </div>
            </div>

            <div className="accounts-navbar-right">
                {onRefresh && (
                    <button className="accounts-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
                <div className="accounts-navbar-user">
                    <div className="accounts-navbar-avatar">{getInitials(user?.name)}</div>
                    <div className="accounts-navbar-userinfo">
                        <span className="accounts-navbar-name">{user?.name || 'Accounts Officer'}</span>
                        <span className="accounts-navbar-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AccountsNavbar;
