import React from 'react';
import { RefreshCw, ShoppingCart } from 'lucide-react';

const ProcurementNavbar = ({ user, onRefresh, isLoading }) => {
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'P';

    return (
        <header className="procurement-navbar">
            <div className="procurement-navbar-brand">
                <div className="procurement-navbar-icon">
                    <ShoppingCart size={20} />
                </div>
                <div>
                    <span className="procurement-navbar-title">Sourcing Hub</span>
                    <span className="procurement-navbar-subtitle">
                        {user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                </div>
            </div>

            <div className="procurement-navbar-right">
                {onRefresh && (
                    <button className="procurement-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
                <div className="procurement-navbar-user">
                    <div className="procurement-navbar-avatar">{getInitials(user?.fullName || user?.name)}</div>
                    <div className="procurement-navbar-userinfo">
                        <span className="procurement-navbar-name">{user?.fullName || user?.name || 'Procurement Specialist'}</span>
                        <span className="procurement-navbar-role">{user?.role?.replace(/_/g, ' ')}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProcurementNavbar;
