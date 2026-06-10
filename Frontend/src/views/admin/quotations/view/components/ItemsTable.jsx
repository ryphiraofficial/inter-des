import React from 'react';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const ItemsTable = ({ items }) => {
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
        return `${BASE_IMAGE_URL}${path}`;
    };

    // Group items by section/category
    const grouped = items.reduce((acc, item) => {
        const key = item.section || 'General';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    // Flatten with running global index
    let globalIdx = 0;

    return (
        <section className="items-section">
            <table className="qv-items-table">
                <thead>
                    <tr>
                        <th className="col-idx">#</th>
                        <th className="col-item">Description &amp; Specifications</th>
                        <th className="col-unit">Unit</th>
                        <th className="col-qty">Qty</th>
                        <th className="col-rate">Rate</th>
                        <th className="col-amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(grouped).map(([sectionName, sectionItems]) => (
                        <React.Fragment key={sectionName}>
                            {/* Category header row */}
                            <tr className="qv-category-row">
                                <td colSpan="6" className="category-header-cell">
                                    {sectionName}
                                </td>
                            </tr>

                            {sectionItems.map((item) => {
                                globalIdx += 1;
                                const idx = globalIdx;
                                return (
                                    <React.Fragment key={item._id || idx}>
                                        <tr className="qv-item-row">
                                            <td className="col-idx" data-label="#">{idx}</td>
                                            <td className="col-item" data-label="Description">
                                                <span className="item-name">{item.itemName || item.name}</span>
                                                {item.description && (
                                                    <p className="item-desc">{item.description}</p>
                                                )}
                                                <div className="item-specs">
                                                    {item.finish && <span><strong>Finish:</strong> {item.finish}</span>}
                                                    {item.material && <span><strong>Material:</strong> {item.material}</span>}
                                                    {item.size && <span><strong>Size:</strong> {item.size}</span>}
                                                    {item.finishBrand && <span><strong>Brand:</strong> {item.finishBrand}</span>}
                                                    {item.materialOrigin && <span><strong>Origin:</strong> {item.materialOrigin}</span>}
                                                </div>
                                                {item.image && (
                                                    <div className="item-preview-img">
                                                        <img
                                                            src={getImageUrl(item.image)}
                                                            alt={item.itemName || item.name}
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="col-unit" data-label="Unit">{item.unit || '-'}</td>
                                            <td className="col-qty" data-label="Qty">{item.quantity}</td>
                                            <td className="col-rate" data-label="Rate">₹{Number(item.rate || 0).toLocaleString('en-IN')}</td>
                                            <td className="col-amount" data-label="Amount">₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default ItemsTable;
