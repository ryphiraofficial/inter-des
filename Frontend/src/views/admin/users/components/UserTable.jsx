import React from 'react';
import { Phone, Edit, Trash2, ChevronDown } from 'lucide-react';

const getRoleClass = (role) => {
    if (!role) return 'default';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) return 'admin';
    if (roleLower.includes('manager')) return 'manager';
    if (roleLower.includes('staff')) return 'staff';
    return 'default';
};

const UserTable = ({ 
    users, loading, expandedRow, toggleRow, handleEditClick, handleDelete 
}) => {
    if (loading) {
        return (
            <div className="skeleton-table">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton-table-row">
                        <div className="skeleton skeleton-avatar" />
                        <div className="skeleton skeleton-table-cell" />
                        <div className="skeleton skeleton-table-cell" />
                        <div className="skeleton skeleton-table-cell" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="users-table-card">
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className="desktop-hide">Contact Info</th>
                        <th className="desktop-hide">Role</th>
                        <th className="desktop-hide">Status</th>
                        <th className="desktop-hide">Actions</th>
                        <th className="mobile-show">Role</th>
                        <th className="mobile-show"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <React.Fragment key={user._id}>
                            <tr 
                                className={`user-row ${expandedRow === user._id ? 'expanded' : ''}`}
                                onClick={() => toggleRow(user._id)}
                            >
                                <td>
                                    <div className="user-profile-cell">
                                        <div className="user-avatar">{user.fullName?.charAt(0)}</div>
                                        <div className="user-details">
                                            <span style={{ fontWeight: 600 }}>{user.fullName}</span>
                                            <span className="user-email">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="desktop-hide">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontSize: '0.85rem' }}><Phone size={12} style={{ marginRight: '6px' }} />{user.phone || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="desktop-hide">
                                    <span className={`role-badge ${getRoleClass(user.role)}`}>{user.role}</span>
                                </td>
                                <td className="desktop-hide"><span className="status-badge-active">Active</span></td>
                                <td className="desktop-hide">
                                    <div className="invoice-actions">
                                        <button className="btn-inv-action" title="Edit" onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}><Edit size={16} /></button>
                                        <button className="btn-inv-action" title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                                <td className="mobile-show">
                                    <span className={`role-badge-small ${getRoleClass(user.role)}`}>{user.role}</span>
                                </td>
                                <td className="mobile-show toggle-cell">
                                    <ChevronDown size={18} className={`toggle-icon ${expandedRow === user._id ? 'active' : ''}`} />
                                </td>
                            </tr>
                            {expandedRow === user._id && (
                                <tr className="mobile-expansion-row mobile-show">
                                    <td colSpan="3">
                                        <div className="expansion-content">
                                            <div className="info-grid">
                                                <div className="info-item"><label>Phone</label><span>{user.phone || 'N/A'}</span></div>
                                                <div className="info-item"><label>Department</label><span>{user.department || 'Admin'}</span></div>
                                                <div className="info-item"><label>Status</label><span style={{ color: '#16a34a' }}>Active</span></div>
                                            </div>
                                            <div className="expansion-actions">
                                                <button className="btn-mobile-action primary" onClick={() => handleEditClick(user)}><Edit size={16} /> Edit Account</button>
                                                <button className="btn-mobile-action danger" onClick={() => handleDelete(user._id)}><Trash2 size={16} /> Delete Account</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
