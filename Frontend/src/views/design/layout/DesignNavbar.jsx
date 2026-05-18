import React from 'react';
import { RefreshCw, LogOut, Palette } from 'lucide-react';

const DesignNavbar = ({ user, onRefresh, isLoading }) => {
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'D';

    return (
        <header className="design-navbar">
            <div className="design-navbar-brand">
                <div className="design-navbar-icon">
                    <Palette size={20} />
                </div>
                <div>
                    <span className="design-navbar-title">Design Studio</span>
                    <span className="design-navbar-subtitle">
                        {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                </div>
            </div>

            <div className="design-navbar-right">
                {onRefresh && (
                    <button className="design-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
                <div className="design-navbar-user">
                    <div className="design-navbar-avatar">{getInitials(user?.name)}</div>
                    <div className="design-navbar-userinfo">
                        <span className="design-navbar-name">{user?.name || 'Designer'}</span>
                        <span className="design-navbar-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DesignNavbar;
