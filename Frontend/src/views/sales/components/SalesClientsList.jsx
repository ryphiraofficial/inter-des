import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesClientsList = ({ loading, filteredClients }) => {
    return (
        <div className="sc-list-card">
            <div className="sc-table-container">
                <table className="sc-table">
                    <thead>
                        <tr>
                            <th>Client Profile</th>
                            <th>Contact Information</th>
                            <th>Site Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <tr key={i}>
                                    <td data-label="Client Profile">
                                        <div className="sc-client-profile">
                                            <Skeleton width="40px" height="40px" borderRadius="50%" />
                                            <Skeleton width="120px" height="16px" style={{ marginLeft: '12px' }} />
                                        </div>
                                    </td>
                                    <td data-label="Contact">
                                        <div className="sc-contact-info">
                                            <div className="sc-contact-item">
                                                <Skeleton width="150px" height="14px" />
                                            </div>
                                            <div className="sc-contact-item" style={{ marginTop: '8px' }}>
                                                <Skeleton width="100px" height="14px" />
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Site Address">
                                        <Skeleton width="200px" height="14px" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan="3">
                                    <div className="sc-empty">
                                        <User size={40} />
                                        <p>No clients found in directory</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredClients.map(client => (
                            <tr key={client._id}>
                                <td data-label="Client Profile">
                                    <div className="sc-client-profile">
                                        <div className="sc-avatar">{client.name?.charAt(0)}</div>
                                        <span className="sc-client-name">{client.name}</span>
                                    </div>
                                </td>
                                <td data-label="Contact">
                                    <div className="sc-contact-info">
                                        <div className="sc-contact-item">
                                            <Mail size={12} />
                                            <span>{client.email}</span>
                                        </div>
                                        <div className="sc-contact-item">
                                            <Phone size={12} />
                                            <span>{client.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Site Address">
                                    <div className="sc-contact-item">
                                        <MapPin size={12} />
                                        <span>{client.siteAddress || 'N/A'}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesClientsList;
