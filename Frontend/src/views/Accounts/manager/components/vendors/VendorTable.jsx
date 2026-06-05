import React, { useState } from 'react';
import { Building2, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSkeleton } from '../../../components/UI/Skeleton';
import '../../../css/VendorTable.css';

const VendorTable = ({ loading, filtered, onEdit, onDelete }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (loading) return <TableSkeleton rows={8} cols={6} />;

    if (filtered.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Building2 size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p>No vendors found.</p>
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
            <div className="vendor-table-container">
                <table className="vendor-table">
                    <thead>
                        <tr>
                            {['Vendor', 'Category', 'Email', 'Phone', 'GST', 'Actions'].map(h => (
                                <th key={h}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((v, i) => (
                            <tr key={v._id || i}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="vendor-avatar">
                                            <Building2 size={16} color="#94a3b8" />
                                        </div>
                                        <span className="vendor-name">{v.name}</span>
                                    </div>
                                </td>
                                <td>
                                    {v.category && <span className="category-badge">{v.category}</span>}
                                </td>
                                <td>{v.email || '—'}</td>
                                <td>{v.phone || '—'}</td>
                                <td>{v.gstNumber || '—'}</td>
                                <td>
                                    <div className="vendor-actions">
                                        <button onClick={() => onEdit(v)} className="action-btn-sm edit" title="Edit"><Edit size={14} /></button>
                                        <button onClick={() => onDelete(v._id)} className="action-btn-sm delete" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Dropdown/Accordion View */}
            <div className="vendor-mobile-container">
                {paginatedData.map((v, i) => {
                    const id = v._id || i;
                    const isExpanded = expandedId === id;
                    return (
                        <div key={id} className="vendor-mobile-card">
                            <div className="vendor-mobile-header" onClick={() => toggleExpand(id)}>
                                <div className="vendor-mobile-info">
                                    <div className="vendor-avatar">
                                        <Building2 size={16} color="#94a3b8" />
                                    </div>
                                    <span className="vendor-name">{v.name}</span>
                                </div>
                                <div className={`vendor-mobile-toggle ${isExpanded ? 'expanded' : ''}`}>
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                            
                            <div className={`vendor-mobile-details ${isExpanded ? 'expanded' : ''}`}>
                                <div className="vendor-detail-row">
                                    <span className="vendor-detail-label">Category</span>
                                    <span className="vendor-detail-value">
                                        {v.category ? <span className="category-badge" style={{ padding: '2px 8px', fontSize: '11px' }}>{v.category}</span> : '—'}
                                    </span>
                                </div>
                                <div className="vendor-detail-row">
                                    <span className="vendor-detail-label">Email</span>
                                    <span className="vendor-detail-value">{v.email || '—'}</span>
                                </div>
                                <div className="vendor-detail-row">
                                    <span className="vendor-detail-label">Phone</span>
                                    <span className="vendor-detail-value">{v.phone || '—'}</span>
                                </div>
                                <div className="vendor-detail-row">
                                    <span className="vendor-detail-label">GST Number</span>
                                    <span className="vendor-detail-value">{v.gstNumber || '—'}</span>
                                </div>
                                
                                <div className="vendor-mobile-actions">
                                    <button className="btn-mobile-edit" onClick={() => onEdit(v)}>
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button className="btn-mobile-delete" onClick={() => onDelete(v._id)}>
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

export default VendorTable;
