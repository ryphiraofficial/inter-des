import React from 'react';
import { X, Save } from 'lucide-react';

const LaminateFormModal = ({
    showModal,
    closeModal,
    editingItem,
    formData,
    handleInputChange,
    handleSubmit,
    submitting,
    brands = []
}) => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay" onClick={closeModal} style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, padding: '1rem'
        }}>
            <div
                className="modal-container"
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '650px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.75rem',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        {editingItem ? 'Edit Laminate' : 'Add New Laminate'}
                    </h3>
                    <button onClick={closeModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Laminate Code *
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. LAM-MER-101"
                                required
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Laminate Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Walnut Natural Sheet"
                                required
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brandName"
                                value={formData.brandName || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Merino / Stylam"
                                list="laminate-brand-options"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                            <datalist id="laminate-brand-options">
                                {brands.map(b => (
                                    <option key={b._id || b.name} value={b.name} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Supplier
                            </label>
                            <input
                                type="text"
                                name="supplier"
                                value={formData.supplier || ''}
                                onChange={handleInputChange}
                                placeholder="Supplier Name"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Color / Shade
                            </label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Natural Walnut"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Finish
                            </label>
                            <input
                                type="text"
                                name="finish"
                                value={formData.finish || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Matt / Gloss / Suede"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Thickness (mm)
                            </label>
                            <input
                                type="number"
                                name="thicknessMm"
                                value={formData.thicknessMm ?? 1.0}
                                onChange={handleInputChange}
                                step="0.1"
                                min="0"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Sheet Size
                            </label>
                            <input
                                type="text"
                                name="sheetSize"
                                value={formData.sheetSize || '8x4 ft'}
                                onChange={handleInputChange}
                                placeholder="e.g. 8x4 ft"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Stock Qty (Sheets) *
                            </label>
                            <input
                                type="number"
                                name="stockQty"
                                value={formData.stockQty ?? 0}
                                onChange={handleInputChange}
                                min="0"
                                required
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Reorder Level
                            </label>
                            <input
                                type="number"
                                name="reorderLevel"
                                value={formData.reorderLevel ?? 5}
                                onChange={handleInputChange}
                                min="0"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Selling Price (₹)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price ?? 0}
                                onChange={handleInputChange}
                                min="0"
                                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Storage Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleInputChange}
                            placeholder="e.g. Rack A-12"
                            style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <button type="button" onClick={closeModal} style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 600 }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Save size={16} />
                            {submitting ? 'Saving...' : editingItem ? 'Update Laminate' : 'Add Laminate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LaminateFormModal;
