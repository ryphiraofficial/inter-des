import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { useUpdateProjectMutation } from '../../../../store/api/adminApi';
import SdcnSelect from '../../../../components/ui/SdcnSelect';
import './ProjectEditModal.css';

const ProjectEditModal = ({ project, onClose, onUpdate }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        priority: 'Medium',
        stage: 'Design',
        status: 'Not Started',
        paymentStatus: 'Pending Advance',
        budget: 0
    });
    const [saving, setSaving] = useState(false);
    const [updateProject] = useUpdateProjectMutation();

    useEffect(() => {
        if (project) {
            setForm({
                name: project.name || '',
                description: project.description || '',
                priority: project.priority || 'Medium',
                stage: project.stage || 'Design',
                status: project.status || 'Not Started',
                paymentStatus: project.paymentStatus || 'Pending Advance',
                budget: project.budget || 0
            });
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProject({ id: project._id, ...form }).unwrap();
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project. Please check if the status/stage transition is valid.');
        } finally {
            setSaving(false);
        }
    };

    if (!project) return null;

    return (
        <div className="pe-drawer-overlay" onClick={onClose}>
            <div className="pe-drawer-content" onClick={e => e.stopPropagation()}>
                <div className="pe-drawer-header">
                    <h2>Edit Project: {project.name}</h2>
                    <button className="pe-drawer-close" onClick={onClose}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="pe-drawer-body">
                        {/* Project Name */}
                        <div style={{ marginBottom: '18px' }}>
                            <label className="pe-field-label">Project Name *</label>
                            <input 
                                type="text" 
                                className="pe-sdcn-input" 
                                value={form.name} 
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                required
                            />
                        </div>
                        
                        {/* Description */}
                        <div style={{ marginBottom: '18px' }}>
                            <label className="pe-field-label">Description</label>
                            <textarea 
                                className="pe-sdcn-input" 
                                value={form.description} 
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                rows={3}
                            />
                        </div>
                        
                        {/* Priority + Budget */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                            <div>
                                <label className="pe-field-label">Priority</label>
                                <SdcnSelect
                                    value={form.priority}
                                    onChange={v => setForm(p => ({ ...p, priority: v }))}
                                    options={[
                                        { value: 'Low', label: 'Low' },
                                        { value: 'Medium', label: 'Medium' },
                                        { value: 'High', label: 'High' },
                                    ]}
                                />
                            </div>
                            
                            <div>
                                <label className="pe-field-label">Budget (₹)</label>
                                <input 
                                    type="number" 
                                    className="pe-sdcn-input" 
                                    value={form.budget} 
                                    onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))}
                                />
                            </div>
                        </div>
                        
                        {/* Stage + Status + Payment */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px', marginBottom: '24px' }}>
                            <div>
                                <label className="pe-field-label">Stage</label>
                                <SdcnSelect
                                    value={form.stage}
                                    onChange={v => setForm(p => ({ ...p, stage: v }))}
                                    options={[
                                        { value: 'Accounts', label: 'Accounts' },
                                        { value: 'Design', label: 'Design' },
                                        { value: 'Procurement', label: 'Procurement' },
                                        { value: 'Production', label: 'Production' },
                                        { value: 'Completed', label: 'Completed' },
                                    ]}
                                />
                            </div>
                            
                            <div>
                                <label className="pe-field-label">Status</label>
                                <SdcnSelect
                                    value={form.status}
                                    onChange={v => setForm(p => ({ ...p, status: v }))}
                                    options={[
                                        { value: 'Not Started', label: 'Not Started' },
                                        { value: 'In Progress', label: 'In Progress' },
                                        { value: 'On Hold', label: 'On Hold' },
                                        { value: 'Completed', label: 'Completed' },
                                        { value: 'Delayed', label: 'Delayed' },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="pe-field-label">Payment</label>
                                <SdcnSelect
                                    value={form.paymentStatus}
                                    onChange={v => setForm(p => ({ ...p, paymentStatus: v }))}
                                    options={[
                                        { value: 'Pending Advance', label: 'Pending Advance' },
                                        { value: 'Invoice Sent', label: 'Invoice Sent' },
                                        { value: 'Partial Payment', label: 'Partial Payment' },
                                        { value: 'Cleared', label: 'Cleared' },
                                        { value: 'Overdue', label: 'Overdue' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="pe-drawer-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <><Loader size={16} className="spin" /> Saving...</> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectEditModal;
