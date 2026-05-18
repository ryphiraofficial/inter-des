import React from 'react';
import { FileText } from 'lucide-react';

const ReportSummaryTable = ({ quotations }) => {
    return (
        <div className="summary-container-card">
            <div className="summary-header">
                <h3>Quote Activity Summary</h3>
            </div>

            {quotations.length === 0 ? (
                <div className="empty-reports-state">
                    <FileText size={48} strokeWidth={1} />
                    <p>No activity to display</p>
                </div>
            ) : (
                <div className="reports-table-container">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Quotation #</th>
                                <th>Client</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.slice(0, 10).map((q) => (
                                <tr key={q._id}>
                                    <td data-label="Quotation #">{q.quotationNumber}</td>
                                    <td data-label="Client">{q.client?.name || 'N/A'}</td>
                                    <td data-label="Amount">₹{q.totalAmount?.toLocaleString()}</td>
                                    <td data-label="Status">
                                        <span className={`status-badge-small ${q.status?.toLowerCase()}`}>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td data-label="Date">{new Date(q.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReportSummaryTable;
