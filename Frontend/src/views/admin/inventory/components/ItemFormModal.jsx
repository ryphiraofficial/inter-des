import React from 'react';
import { X, Loader, Upload } from 'lucide-react';
import AISuggestButton from '../../components/AISuggestButton';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${url.startsWith('/') ? '' : '/'}${url}`;
};

const ItemFormModal = ({ 
    showItemModal, closeModal, editingItem, formData, setFormData, handleInputChange, 
    availableSections, setIsAddingSection, handleImageUpload, handleSubmit, submitting 
}) => {
    if (!showItemModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-wide" data-lenis-prevent>
                <div className="modal-header">
                    <h3>{editingItem ? 'Edit Item' : 'New Item Registration'}</h3>
                    <button className="modal-close" onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={(e) => handleSubmit(e, formData, editingItem)}>
                    <div className="form-grid">
                        <div className="form-field full-width">
                            <label>Item Name <span>*</span></label>
                            <input name="itemName" className="client-input" value={formData.itemName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-field full-width">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Description</label>
                                <AISuggestButton type="Inventory" field="description" value={formData.description} context={{ itemName: formData.itemName }} onSuggest={(v) => setFormData(prev => ({ ...prev, description: v }))} />
                            </div>
                            <textarea name="description" className="client-input" value={formData.description} onChange={handleInputChange} rows="2" />
                        </div>
                        <div className="form-field">
                            <label>Section / Category</label>
                            <select name="section" className="client-input" value={formData.section} onChange={handleInputChange}>
                                <option value="">Select Section</option>
                                {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button type="button" className="btn-add-inline" onClick={() => setIsAddingSection(true)}>+ Add New Category</button>
                        </div>
                        <div className="form-field">
                            <label>Unit of Measure</label>
                            <select name="unit" className="client-input" value={formData.unit} onChange={handleInputChange}>
                                <option value="Numbers">Numbers (pcs)</option><option value="Sq Ft">Square Feet</option><option value="Running Ft">Running Feet</option><option value="Liters">Liters</option><option value="Kg">Kilograms</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Price (₹) <span>*</span></label>
                            <input type="number" name="price" className="client-input" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="form-field">
                            <label>Stock Level <span>*</span></label>
                            <input type="number" name="stock" className="client-input" value={formData.stock} onChange={handleInputChange} required />
                        </div>
                        <div className="form-field">
                            <label>Reorder Level</label>
                            <input type="number" name="reorderLevel" className="client-input" value={formData.reorderLevel} onChange={handleInputChange} />
                        </div>
                        <div className="form-field full-width">
                            <label>Product Image</label>
                            <div className="image-upload-preview-container">
                                {formData.image ? (
                                    <div className="form-image-preview">
                                        <img src={getImageUrl(formData.image)} alt="Preview" />
                                        <button type="button" className="remove-preview-btn" onClick={() => setFormData(prev => ({ ...prev, image: null }))}><X size={14} /></button>
                                    </div>
                                ) : (
                                    <div className="image-upload-dropzone">
                                        <Upload size={24} /><span>Click to upload product image</span>
                                        <input type="file" onChange={(e) => handleImageUpload(e.target.files[0])} accept="image/*" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? <Loader className="spinner" size={16} /> : (editingItem ? 'Update Item' : 'Add to Catalog')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemFormModal;
