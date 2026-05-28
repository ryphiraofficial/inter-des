import React from 'react';
import { Calendar } from 'lucide-react';

export const PartiesGrid = ({ client, projectName, projectDescription, validUntil }) => (
    <section className="parties-grid">
        <div className="party-box client-box">
            <h3>Prepared For</h3>
            <div className="party-details">
                <p className="client-name">{client?.name || 'Walk-in Client'}</p>
                <p>{client?.email}</p>
                <p>{client?.phone}</p>
                <p>{client?.company}</p>
            </div>
        </div>
        <div className="party-box project-box">
            <h3>Project Details</h3>
            <div className="party-details">
                <p className="project-title">{projectName}</p>
                <p className="project-desc">{projectDescription}</p>
                {validUntil && (
                    <p className="validity">
                        <Calendar size={14} /> Valid Until: {new Date(validUntil).toLocaleDateString()}
                    </p>
                )}
            </div>
        </div>
    </section>
);

export const ItemsTable = ({ items }) => (
    <section className="items-section">
        <table className="qv-items-table">
            <thead>
                <tr>
                    <th className="col-idx">#</th>
                    <th className="col-item">Description & Specifications</th>
                    <th className="col-qty">Qty</th>
                    <th className="col-rate">Rate</th>
                    <th className="col-amount">Amount</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <tr className="qv-item-row">
                            <td className="col-idx" data-label="#">{idx + 1}</td>
                            <td className="col-item" data-label="Item">
                                <div className="item-main-info">
                                    <span className="item-name">{item.itemName}</span>
                                    {item.section && <span className="item-section-tag">{item.section}</span>}
                                </div>
                                <p className="item-desc">{item.description}</p>
                                <div className="item-specs">
                                    {item.finish && <span><strong>Finish:</strong> {item.finish}</span>}
                                    {item.material && <span><strong>Material:</strong> {item.material}</span>}
                                    {item.size && <span><strong>Size:</strong> {item.size}</span>}
                                    {item.measurements && <span><strong>Measurements:</strong> {item.measurements}</span>}
                                </div>
                            </td>
                            <td className="col-qty" data-label="Qty">{item.quantity} {item.unit}</td>
                            <td className="col-rate" data-label="Rate">₹{item.rate?.toLocaleString()}</td>
                            <td className="col-amount" data-label="Amount">₹{item.amount?.toLocaleString()}</td>
                        </tr>
                        {item.image && (
                            <tr className="image-row no-print">
                                <td className="col-idx"></td>
                                <td colSpan="4">
                                    <div className="item-preview-img">
                                        <img src={`${item.image}`} alt="Preview" />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </section>
);
