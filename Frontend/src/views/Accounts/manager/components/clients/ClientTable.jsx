import React, { useState } from 'react';
import { Users, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';
import '../../../css/ClientTable.css';

const ClientTable = ({ loading, filtered, onEdit, onDelete }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (loading) return <TableSkeleton rows={8} cols={5} />;

    if (filtered.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No clients found.</p>
            </div>
        );
    }

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

    return (
        <>
            {/* Desktop Table View */}
            <div className="client-table-container">
                <table className="client-table">
                    <thead>
                        <tr>
                            {['Client', 'Email', 'Phone', 'GST Number', 'Actions'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((c, i) => (
                            <tr key={c._id || i}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="client-avatar">
                                            {c.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="client-name">{c.name}</span>
                                    </div>
                                </td>
                                <td>{c.email || '—'}</td>
                                <td>{c.phone || '—'}</td>
                                <td>{c.gstNumber || '—'}</td>
                                <td>
                                    <div className="client-actions">
                                        <button onClick={() => onEdit(c)} className="action-btn-sm edit" title="Edit"><Edit size={14} /></button>
                                        <button onClick={() => onDelete(c._id)} className="action-btn-sm delete" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Dropdown/Accordion View */}
            <div className="client-mobile-container">
                {paginatedData.map((c, i) => {
                    const id = c._id || i;
                    const isExpanded = expandedId === id;
                    return (
                        <div key={id} className="client-mobile-card">
                            <div className="client-mobile-header" onClick={() => toggleExpand(id)}>
                                <div className="client-mobile-client-info">
                                    <div className="client-avatar">
                                        {c.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="client-name">{c.name}</span>
                                </div>
                                <div className={`client-mobile-toggle ${isExpanded ? 'expanded' : ''}`}>
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                            
                            <div className={`client-mobile-details ${isExpanded ? 'expanded' : ''}`}>
                                <div className="client-detail-row">
                                    <span className="client-detail-label">Email</span>
                                    <span className="client-detail-value">{c.email || '—'}</span>
                                </div>
                                <div className="client-detail-row">
                                    <span className="client-detail-label">Phone</span>
                                    <span className="client-detail-value">{c.phone || '—'}</span>
                                </div>
                                <div className="client-detail-row">
                                    <span className="client-detail-label">GST Number</span>
                                    <span className="client-detail-value">{c.gstNumber || '—'}</span>
                                </div>
                                
                                <div className="client-mobile-actions">
                                    <button className="btn-mobile-edit" onClick={() => onEdit(c)}>
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button className="btn-mobile-delete" onClick={() => onDelete(c._id)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 10px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === 1 ? '#f8fafc' : '#fff', color: currentPage === 1 ? '#cbd5e1' : '#475569', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                            style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: currentPage === totalPages ? '#f8fafc' : '#fff', color: currentPage === totalPages ? '#cbd5e1' : '#475569', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientTable;
