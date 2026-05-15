import React from 'react';
import { X } from 'lucide-react';

const NewCategoryModal = ({ 
    isAddingSection, setIsAddingSection, newSectionName, setNewSectionName, handleAddSection 
}) => {
    if (!isAddingSection) return null;

    return (
        <div className="modal-overlay sub-modal">
            <div className="modal-content small">
                <div className="modal-header">
                    <h4>Create New Category</h4>
                    <button className="modal-close" onClick={() => setIsAddingSection(false)}><X size={16} /></button>
                </div>
                <div className="modal-body">
                    <input
                        type="text"
                        className="client-input"
                        placeholder="Category name (e.g., Lighting)"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={() => setIsAddingSection(false)}>Cancel</button>
                    <button className="btn-submit" onClick={() => handleAddSection(newSectionName)}>Add Category</button>
                </div>
            </div>
        </div>
    );
};

export default NewCategoryModal;
