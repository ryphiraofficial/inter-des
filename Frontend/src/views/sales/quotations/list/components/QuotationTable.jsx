import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileText } from 'lucide-react';
import Skeleton from '../../../components/Skeleton';

const QuotationTable = ({ loading, quotations }) => {
    return (
        <div className="sq-table-container">
            <table className="sq-table">
                <thead>
                    <tr>
                        <th>Quote No</th>
                        <th>Project & Client</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <tr key={i}>
                                <td>
                                    <Skeleton width="100px" height="16px" />
                                    <div style={{ height: '4px' }} />
                                    <Skeleton width="60px" height="12px" />
                                </td>
                                <td>
                                    <Skeleton width="180px" height="16px" />
                                    <div style={{ height: '4px' }} />
                                    <Skeleton width="120px" height="12px" />
                                </td>
                                <td><Skeleton width="80px" height="16px" /></td>
                                <td><Skeleton width="100px" height="24px" borderRadius="12px" /></td>
                                <td><Skeleton width="36px" height="36px" borderRadius="10px" /></td>
                            </tr>
                        ))
                    ) : quotations.length === 0 ? (
                        <tr>
                            <td colSpan="5">
                                <div className="sq-empty">
                                    <FileText size={40} />
                                    <p>No project quotations found</p>
                                </div>
                            </td>
                        </tr>
                    ) : quotations.map(q => (
                        <tr key={q._id}>
                            <td data-label="Quote No">
                                <span className="sq-quote-num">{q.quotationNumber}</span>
                                <span className="sq-date">{new Date(q.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td data-label="Project">
                                <div className="sq-project-info">
                                    <span className="sq-project-name">{q.projectName}</span>
                                    <span className="sq-client-name">{q.client?.name || 'N/A'}</span>
                                </div>
                            </td>
                            <td data-label="Amount">
                                ₹{(q.totalAmount || 0).toLocaleString()}
                            </td>
                            <td data-label="Status">
                                <span className={`sq-status-badge sq-status-${(q.status || 'pending').toLowerCase()}`}>
                                    {q.status || 'Under Review'}
                                </span>
                            </td>
                            <td data-label="Actions">
                                <Link to={`/staff/quotations/view/${q._id}`} className="sq-btn-view">
                                    <Eye size={18} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuotationTable;
