import React from 'react';
import { Calendar, DollarSign, Star, FileText, Upload, X, CheckCircle } from 'lucide-react';

const CompletionForm = ({ formData, setFormData, handleSubmit, submitting, handlePhotoUpload, removePhoto, navigate }) => {
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                        <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                        Completion Date
                    </label>
                    <input 
                        type="date" 
                        value={formData.completionDate}
                        onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                        <DollarSign size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                        Final Project Cost (₹)
                    </label>
                    <input 
                        type="number" 
                        placeholder="Enter final cost"
                        value={formData.finalCost}
                        onChange={(e) => setFormData({...formData, finalCost: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                    <Star size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                    Client Satisfaction Rating
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(rating => (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({...formData, clientRating: rating})}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: `1px solid ${formData.clientRating >= rating ? '#f59e0b' : '#e2e8f0'}`,
                                background: formData.clientRating >= rating ? '#fffbeb' : 'white',
                                color: formData.clientRating >= rating ? '#d97706' : '#64748b',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <Star size={14} fill={formData.clientRating >= rating ? '#f59e0b' : 'none'} />
                            {rating}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                    <FileText size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                    Final Remarks & Handover Notes
                </label>
                <textarea 
                    rows={4}
                    placeholder="Summarize the project completion, handover details, and any pending minor issues..."
                    value={formData.finalRemarks}
                    onChange={(e) => setFormData({...formData, finalRemarks: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                    <Upload size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                    Final Site Photos
                </label>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px', textAlign: 'center', background: '#f8fafc' }}>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        id="photo-upload"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="photo-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <Upload size={16} /> Choose Photos
                    </label>
                    <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#64748b' }}>Upload high-quality completion photos (Max 5MB each)</p>
                </div>
                
                {formData.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {formData.photos.map((photo, index) => (
                            <div key={index} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <img src={photo.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button 
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={submitting}
                    style={{ padding: '12px 24px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
                >
                    {submitting ? 'Submitting...' : <><CheckCircle size={18} /> Complete Project</>}
                </button>
            </div>
        </form>
    );
};

export default CompletionForm;
