import React from 'react';
import { Mail, Phone, MapPin, Edit, Trash2, ChevronDown } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const ClientTable = ({ 
    clients, loading, isStaff, expandedRow, toggleRow, handleEdit, handleDelete 
}) => {
    if (loading) {
        return <TableSkeleton rows={10} cols={6} />;
    }

    return (
        <div className="c-list-card">
            <div className="c-table-container">
                <table className="c-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Project Name</th>
                            <th className="desktop-hide">Contact Info</th>
                            <th className="desktop-hide">Site Address</th>
                            <th className="desktop-hide">Status</th>
                            <th className="desktop-hide">Added By</th>
                            <th className="desktop-hide">Actions</th>
                            <th className="mobile-show">Contact</th>
                            <th className="mobile-show"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <React.Fragment key={client._id}>
                                <tr 
                                    className={`c-row ${expandedRow === client._id ? 'expanded' : ''}`}
                                    onClick={() => window.innerWidth <= 768 && toggleRow(client._id)}
                                >
                                    <td className="client-name-cell">
                                        <div className="client-profile">
                                            <div className="client-avatar">{client.name.charAt(0)}</div>
                                            <span className="client-name-text">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="client-project-name">{client.projectName || '—'}</td>
                                    <td className="desktop-hide">
                                        <div className="client-contact-info">
                                            <div className="contact-item"><Mail size={12} /><span>{client.email}</span></div>
                                            <div className="contact-item"><Phone size={12} /><span>{client.phone}</span></div>
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="client-site-addr"><MapPin size={12} /><span>{client.siteAddress || 'N/A'}</span></div>
                                    </td>
                                    <td className="desktop-hide">
                                        <span className={`c-status-badge ${client.status?.toLowerCase()}`}>{client.status}</span>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="added-by-info">
                                            <span className="added-by-name">{client.createdBy?.fullName || 'Admin'}</span>
                                            <span className={`added-by-role ${client.createdBy?.role?.toLowerCase()}`}>{client.createdBy?.role || 'Admin'}</span>
                                        </div>
                                    </td>
                                    <td className="desktop-hide">
                                        <div className="c-action-buttons">
                                            <button className="btn-icon-edit" onClick={(e) => { e.stopPropagation(); handleEdit(client); }} title="Edit"><Edit size={16} /></button>
                                            {!isStaff && <button className="btn-icon-delete" onClick={(e) => { e.stopPropagation(); handleDelete(client); }} title="Delete"><Trash2 size={16} /></button>}
                                        </div>
                                    </td>
                                    <td className="mobile-show">
                                        <div className="mobile-contact-preview"><span>{client.phone}</span></div>
                                    </td>
                                    <td className="mobile-show toggle-cell">
                                        <ChevronDown size={18} className={`toggle-icon ${expandedRow === client._id ? 'active' : ''}`} />
                                    </td>
                                </tr>
                                {expandedRow === client._id && (
                                    <tr className="mobile-expansion-row mobile-show">
                                        <td colSpan="3">
                                            <div className="expansion-content">
                                                <div className="info-grid">
                                                    <div className="info-item"><label>Project Name</label><span>{client.projectName || 'N/A'}</span></div>
                                                    <div className="info-item"><label>Email</label><span>{client.email}</span></div>
                                                    <div className="info-item"><label>Site Address</label><span>{client.siteAddress || 'N/A'}</span></div>
                                                    <div className="info-item"><label>Status</label><span className={`c-status-badge ${client.status?.toLowerCase()}`}>{client.status}</span></div>
                                                    <div className="info-item"><label>Added By</label><span>{client.createdBy?.fullName || 'Admin'} ({client.createdBy?.role || 'Admin'})</span></div>
                                                </div>
                                                <div className="expansion-actions">
                                                    <button className="btn-mobile-action primary" onClick={() => handleEdit(client)}><Edit size={16} /> Edit Client</button>
                                                    {!isStaff && <button className="btn-mobile-action danger" onClick={() => handleDelete(client)}><Trash2 size={16} /> Delete Client</button>}
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
        </div>
    );
};

export default ClientTable;
