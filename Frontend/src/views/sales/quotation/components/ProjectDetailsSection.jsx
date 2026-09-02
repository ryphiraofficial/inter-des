import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const ProjectDetailsSection = ({ 
    formData, handleInputChange, clientSearchQuery, handleClientSearch, 
    showClientSuggestions, filteredClients, selectClient, handleQuickAddClient, setFormData,
    fieldErrors
}) => {
    return (
        <div className="form-section">
            <div className="section-header-row" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                <div className="section-header-left">
                    <Briefcase className="section-icon" size={18} />
                    <h3>Project Details</h3>
                </div>
            </div>
            <div className="form-grid">
                <div className="form-group" id="client-field-group" style={{ position: 'relative' }}>
                    <label>Client *</label>
                    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <input
                            type="text"
                            className={`input-styled ${fieldErrors?.client ? 'error-field' : ''}`}
                            placeholder="Type to search client..."
                            value={clientSearchQuery}
                            onChange={(e) => handleClientSearch(e.target.value)}
                            onFocus={() => clientSearchQuery.trim() && showClientSuggestions && true} 
                            required
                            style={{ borderRadius: '4px' }}
                        />
                        {fieldErrors?.client && (
                            <span className="field-error-msg" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', display: 'block', fontWeight: '500' }}>
                                {fieldErrors.client}
                            </span>
                        )}
                        {showClientSuggestions && (
                            <div className="product-search-dropdown" style={{ width: '100%', top: '100%', left: 0 }}>
                                {filteredClients.map(c => (
                                    <div key={c._id} className="search-result-item" onClick={() => selectClient(c)}>
                                        <div className="res-info">
                                            <span className="res-name">{c.name}</span>
                                            <span className="res-cat">{c.company || 'Individual'}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select</span>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    className="search-result-item add-new-prompt"
                                    onClick={handleQuickAddClient}
                                    style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}
                                >
                                    <div className="res-info">
                                        <span className="res-name" style={{ color: '#6366f1' }}>+ Add "{clientSearchQuery}"</span>
                                        <span className="res-cat">Create new client profile</span>
                                    </div>
                                    <Plus size={16} color="#6366f1" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <CustomSelect 
                        label="Document Type"
                        name="documentType" 
                        value={formData.documentType} 
                        onChange={handleInputChange} 
                        options={[
                            { value: 'Quotation', label: 'Quotation' },
                            { value: 'Estimate', label: 'Estimate' },
                            { value: 'Proposal', label: 'Proposal' }
                        ]} 
                    />
                </div>
            </div>
            <div className="form-group" id="projectName-field-group" style={{ marginTop: '1.25rem' }}>
                <label>Project Name *</label>
                <input
                    type="text"
                    name="projectName"
                    className={`input-styled ${fieldErrors?.projectName ? 'error-field' : ''}`}
                    placeholder="e.g., Living Room Interior Design"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: '4px' }}
                />
                {fieldErrors?.projectName && (
                    <span className="field-error-msg" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem', display: 'block', fontWeight: '500' }}>
                        {fieldErrors.projectName}
                    </span>
                )}
            </div>
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label>Description</label>
                <textarea name="projectDescription" className="textarea-styled" placeholder="Brief description of the project scope..." value={formData.projectDescription} onChange={handleInputChange} rows="2" style={{ borderRadius: '4px' }}></textarea>
            </div>
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label>Scope of Work</label>
                <textarea name="scopeOfWork" className="textarea-styled" placeholder="Define what is included in this project..." value={formData.scopeOfWork} onChange={handleInputChange} rows="2"></textarea>
            </div>
        </div>
    );
};

export default ProjectDetailsSection;
