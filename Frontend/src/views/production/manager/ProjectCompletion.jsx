import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload, Star, DollarSign, FileText, Calendar, X } from 'lucide-react';
import { productionManagerAPI } from '../../../models/api';
import '../css/ProductionManagement.css'; 

const ProjectCompletion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        completionDate: new Date().toISOString().split('T')[0],
        finalRemarks: '',
        clientRating: 5,
        finalCost: '',
        photos: []
    });
    
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Fetch the project details using the common getProjects with ID search
                const res = await productionManagerAPI.getProjects({ search: id });
                if (res?.success && res.data) {
                    const found = res.data.find(p => p._id === id);
                    if (found) setProject(found);
                }
            } catch (err) {
                console.error("Error fetching project:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        // Simulate upload by generating local object URLs for previews
        const newPhotos = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    };

    const removePhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                completionDate: formData.completionDate,
                finalRemarks: formData.finalRemarks,
                clientRating: formData.clientRating,
                finalCost: formData.finalCost,
                photos: formData.photos.map(p => p.url) 
            };
            
            const res = await productionManagerAPI.submitProjectCompletion(id, payload);
            if (res?.success) {
                setToast({ type: 'success', msg: 'Project completed successfully!' });
                setTimeout(() => {
                    navigate('/production-management/projects');
                }, 2000);
            } else {
                setToast({ type: 'error', msg: res?.message || 'Failed to submit completion.' });
            }
        } catch (error) {
            setToast({ type: 'error', msg: 'An error occurred during submission.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading project details...</div>;
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: '24px', right: '24px', padding: '14px 28px',
                    borderRadius: '12px', color: 'white', fontWeight: 600, zIndex: 9999,
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}>
                    {toast.msg}
                </div>
            )}

            <button 
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}
            >
                <ArrowLeft size={16} /> Back to Projects
            </button>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '32px', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <CheckCircle size={28} />
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Project Completion</h1>
                    </div>
                    <p style={{ margin: 0, opacity: 0.9 }}>Finalize and close out the project</p>
                </div>

                <div style={{ padding: '32px' }}>
                    {project && (
                        <div style={{ marginBottom: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Project Details</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{project.projectName}</div>
                            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#475569' }}>
                                <div><strong>Client:</strong> {project.clientId?.name || 'N/A'}</div>
                                <div><strong>Type:</strong> {project.projectType}</div>
                                <div><strong>ID:</strong> {project._id.substring(0,8)}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Completion Date */}
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

                            {/* Final Cost */}
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

                        {/* Client Rating */}
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

                        {/* Final Remarks */}
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

                        {/* Photo Upload */}
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
                            
                            {/* Photo Previews */}
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

                        {/* Submit Actions */}
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
                </div>
            </div>
        </div>
    );
};

export default ProjectCompletion;
