import React from 'react';

const ItemsTable = ({ items }) => {
    return (
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
};

export default ItemsTable;
