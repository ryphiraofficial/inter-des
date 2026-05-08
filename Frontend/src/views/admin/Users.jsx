import React, { useState, useEffect } from 'react';
import {
    Plus,
    X,
    Search,
    Edit,
    Trash2,
    Shield,
    Mail,
    Phone,
    UserCircle,
    Loader,
    ChevronDown
} from 'lucide-react';
import { userAPI } from '../../models/api';
import './css/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'Admin',
        password: '',
        department: 'Admin'
    });

    useEffect(() => {
        fetchUsers();

        const handleOpenModal = () => {
            setEditingUser(null);
            setFormData({ fullName: '', email: '', phone: '', role: 'Designer', password: '' });
            setShowModal(true);
        };

        const handleHeaderSearch = (e) => {
            setSearchTerm(e.detail || '');
        };

        window.addEventListener('open-create-user-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);
        return () => {
            window.removeEventListener('open-create-user-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            if (response.success) setUsers(response.data);
        } catch (err) {
            setError(err.message);
            alert('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'Admin',
            department: user.department || 'Admin',
            password: '' // Leave password empty during edit unless user wants to change it
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'role') {
            let dept = 'Admin';
            if (value.includes('Design')) dept = 'Design';
            else if (value.includes('Procurement')) dept = 'Procurement';
            else if (value.includes('Production') || value.includes('Project') || value.includes('Site')) dept = 'Production';
            else if (value.includes('Accounts')) dept = 'Accounts';
            else if (value === 'Sales') dept = 'Sales';
            
            setFormData(prev => ({
                ...prev,
                role: value,
                department: dept
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation: Password only required for new users
        if (!formData.fullName || !formData.email || (!editingUser && !formData.password)) {
            alert('Name, Email and Password are required');
            return;
        }

        try {
            setSubmitting(true);
            const response = editingUser
                ? await userAPI.update(editingUser._id, formData)
                : await userAPI.create(formData);

            if (response.success) {
                alert(editingUser ? 'User updated successfully' : 'New user created successfully');
                setShowModal(false);
                fetchUsers();
                setEditingUser(null);
                setFormData({ fullName: '', email: '', phone: '', role: 'Admin', department: 'Admin', password: '' });
            }
        } catch (err) {
            alert(err.message || `Error ${editingUser ? 'updating' : 'creating'} user`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await userAPI.delete(id);
            if (response.success) {
                setUsers(users.filter(u => u._id !== id));
                alert('User deleted successfully');
            }
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleClass = (role) => {
        if (!role) return 'default';
        const roleLower = role.toLowerCase();
        if (roleLower.includes('admin')) return 'admin';
        if (roleLower.includes('manager')) return 'manager';
        if (roleLower.includes('staff')) return 'staff';
        return 'default';
    };

    return (
        <div className="users-container">
            <div className="users-wrapper">
                {/* Header and Search removed and moved to navbar */}

                {loading ? (
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
                ) : (
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
                                {filteredUsers.map((user) => (
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
                                                <span className={`role-badge ${getRoleClass(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="desktop-hide">
                                                <span className="status-badge-active">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="desktop-hide">
                                                <div className="invoice-actions">
                                                    <button
                                                        className="btn-inv-action"
                                                        title="Edit"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-inv-action"
                                                        title="Delete"
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="mobile-show">
                                                <span className={`role-badge-small ${getRoleClass(user.role)}`}>
                                                    {user.role}
                                                </span>
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
                                                            <div className="info-item">
                                                                <label>Phone</label>
                                                                <span>{user.phone || 'N/A'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Department</label>
                                                                <span>{user.department || 'Admin'}</span>
                                                            </div>
                                                            <div className="info-item">
                                                                <label>Status</label>
                                                                <span style={{ color: '#16a34a' }}>Active</span>
                                                            </div>
                                                        </div>
                                                        <div className="expansion-actions">
                                                            <button className="btn-mobile-action primary" onClick={() => handleEditClick(user)}>
                                                                <Edit size={16} />
                                                                Edit Account
                                                            </button>
                                                            <button className="btn-mobile-action danger" onClick={() => handleDelete(user._id)}>
                                                                <Trash2 size={16} />
                                                                Delete Account
                                                            </button>
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
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-user" data-lenis-prevent>
                        <div className="modal-header">
                            <h3>{editingUser ? 'Edit Team Member' : 'Add Team Member'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    name="fullName"
                                    className="user-input"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="user-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    name="phone"
                                    className="user-input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    className="user-input"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <optgroup label="Core Admin">
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">General Manager</option>
                                    </optgroup>
                                    <optgroup label="Design Department">
                                        <option value="Design Manager">Design Manager</option>
                                        <option value="Design Staff">Design Staff</option>
                                    </optgroup>
                                    <optgroup label="Procurement Department">
                                        <option value="Procurement Manager">Procurement Manager</option>
                                        <option value="Procurement Staff">Procurement Staff</option>
                                    </optgroup>
                                    <optgroup label="Production Department">
                                        <option value="Project Manager">Project Manager</option>
                                        <option value="Production Staff">Production Staff</option>
                                    </optgroup>
                                    <optgroup label="Sales Department">
                                        <option value="Sales">Sales Executive</option>
                                    </optgroup>
                                    <optgroup label="Accounts Department">
                                        <option value="Accounts Manager">Accounts Manager</option>
                                        <option value="Accounts Staff">Accounts Staff</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Password {editingUser ? '(Leave blank to keep current)' : '*'}</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="user-input"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingUser}
                                />
                            </div>
                            <div className="modal-footer" style={{ marginTop: '2rem' }}>
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save" disabled={submitting}>
                                    {submitting ? <Loader className="spinner" size={16} /> : (editingUser ? 'Update Account' : 'Create Account')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default Users;
