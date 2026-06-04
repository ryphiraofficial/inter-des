import React from 'react';
import { LogOut } from 'lucide-react';
import { BASE_IMAGE_URL } from '../../../../config/constants';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/authSlice';

const SidebarFooter = ({ onLogout }) => {
    const user = useAppSelector(selectUser);
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const displayName = user?.fullName || user?.name || 'Admin';
    const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="sidebar-footer">
            {user && (
                <div className="footer-user-info">
                    <div className="footer-avatar">
                        {user.avatar ? (
                            <img src={getImageUrl(user.avatar)} alt="Avatar" />
                        ) : (
                            userInitials
                        )}
                    </div>
                    <div className="footer-details">
                        <p className="footer-name">{displayName}</p>
                        <p className="footer-role">{user.role ? user.role.replace(/_/g, ' ') : 'Administration'}</p>
                    </div>
                </div>
            )}
            <button className="btn-logout-icon mobile-hide" onClick={onLogout} title="Logout">
                <LogOut size={18} />
            </button>
        </div>
    );
};

export default SidebarFooter;
