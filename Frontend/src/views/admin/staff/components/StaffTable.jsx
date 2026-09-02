import React from 'react';
import { Mail, Phone, Calendar, Briefcase, IndianRupee, BarChart2, Edit, Trash2, ChevronDown } from 'lucide-react';

const StaffTable = ({ 
    staffList, 
    expandedRow, 
    toggleRow, 
    handleViewSalary, 
    handleViewAnalytics, 
    handleEdit, 
    handleDelete 
}) => {
    return (
        <div className="staff-table-container">
            <table className="staff-table">
                <thead>
                    <tr>
                        <th className="desktop-hide">Staff ID</th>
                        <th>Staff Member</th>
                        <th className="desktop-hide">Role</th>
                        <th className="desktop-hide">Contact</th>
                        <th className="desktop-hide">Joining Date</th>
                        <th className="desktop-hide">Status</th>
                        <th className="desktop-hide" style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Actions</th>
                        <th className="mobile-show">Status</th>
                        <th className="mobile-show"></th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map((staff) => (
                        <React.Fragment key={staff._id}>
                            <tr 
                                className={`staff-row ${expandedRow === staff._id ? 'expanded' : ''}`}
                                onClick={() => window.innerWidth <= 768 && toggleRow(staff._id)}
                            >
                                <td className="desktop-hide"><span className="staff-id-badge">{staff.staffId || '—'}</span></td>
                                <td>
                                    <div className="staff-info-cell">
                                        <div className="staff-avatar">{staff.name.charAt(0).toUpperCase()}</div>
                                        <div className="staff-details">
                                            <span className="staff-name">{staff.name}</span>
                                            <span className="staff-phone desktop-hide">{staff.phone}</span>
                                            <div className="mobile-staff-meta mobile-show"><span className="mobile-role">{staff.role}</span></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="desktop-hide">
                                    <div className="role-cell"><Briefcase size={14} /><span>{staff.role}</span></div>
                                </td>
                                <td className="desktop-hide">
                                    <div className="contact-cell">
                                        <div className="contact-item"><Mail size={12} /><span>{staff.email || '—'}</span></div>
                                        <div className="contact-item"><Phone size={12} /><span>{staff.phone || '—'}</span></div>
                                    </div>
                                </td>
                                <td className="desktop-hide">
                                    <div className="date-cell"><Calendar size={14} /><span>{staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : '—'}</span></div>
                                </td>
                                <td className="desktop-hide">
                                    <span className={`status-badge ${staff.status?.toLowerCase().replace(' ', '-')}`}>{staff.status}</span>
                                </td>
                                <td className="desktop-hide" style={{ textAlign: 'right', paddingRight: '1.25rem', minWidth: '150px' }}>
                                    <div className="actions-cell" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                                        <button className="btn-icon salary" onClick={() => handleViewSalary(staff)} title="Salary"><IndianRupee size={16} /></button>
                                        <button className="btn-icon analytics" onClick={() => handleViewAnalytics(staff)} title="Analytics"><BarChart2 size={16} /></button>
                                        <button className="btn-icon edit" onClick={() => handleEdit(staff)} title="Edit"><Edit size={16} /></button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(staff._id)} title="Remove"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                                <td className="mobile-show">
                                    <span className={`mobile-status-badge ${staff.status?.toLowerCase().replace(' ', '-')}`}>{staff.status}</span>
                                </td>
                                <td className="mobile-show toggle-cell">
                                    <ChevronDown size={18} className={`toggle-icon ${expandedRow === staff._id ? 'active' : ''}`} />
                                </td>
                            </tr>
                            {expandedRow === staff._id && (
                                <tr className="mobile-expansion-row mobile-only">
                                    <td colSpan="9">
                                        <div className="expansion-content">
                                            <div className="info-grid">
                                                <div className="info-item"><label>Staff ID</label><span>{staff.staffId || '—'}</span></div>
                                                <div className="info-item"><label>Role</label><span>{staff.role}</span></div>
                                                <div className="info-item"><label>Email</label><span>{staff.email || '—'}</span></div>
                                                <div className="info-item"><label>Joining Date</label><span>{staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : '—'}</span></div>
                                            </div>
                                            <div className="expansion-actions">
                                                <button className="btn-mobile-action salary" onClick={() => handleViewSalary(staff)}><IndianRupee size={16} /> View Salary</button>
                                                <button className="btn-mobile-action primary" onClick={() => handleViewAnalytics(staff)}><BarChart2 size={16} /> Analytics</button>
                                                <button className="btn-mobile-action secondary" onClick={() => handleEdit(staff)}><Edit size={16} /> Edit</button>
                                                <button className="btn-mobile-action danger" onClick={() => handleDelete(staff._id)}><Trash2 size={16} /> Remove</button>
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

export default StaffTable;
