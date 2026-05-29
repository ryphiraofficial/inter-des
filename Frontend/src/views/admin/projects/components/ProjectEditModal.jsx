import React, { useState, useEffect, useRef } from 'react';
import { X, Loader, ChevronDown, Check } from 'lucide-react';
import { projectAPI } from '../../../../models/api';

/* ── Shadcn-style custom Select ─────────────────────────────────── */
const SdcnSelect = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div className="sdcn-select" ref={ref}>
            <button
                type="button"
                className={`sdcn-select-trigger ${!selected ? 'placeholder' : ''}`}
                onClick={() => setOpen(o => !o)}
            >
                <span className="sdcn-select-value">{selected ? selected.label : (placeholder || 'Select…')}</span>
                <ChevronDown size={15} className={`sdcn-select-chevron ${open ? 'open' : ''}`} />
            </button>

            {open && (
                <div className="sdcn-select-content">
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`sdcn-select-item ${opt.value === value ? 'selected' : ''}`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                        >
                            <span>{opt.label}</span>
                            {opt.value === value && <Check size={14} className="sdcn-select-check" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── Inline scoped styles (no external CSS dep) ─────────────────── */
const scopedStyles = `
.sdcn-select {
    position: relative;
    width: 100%;
}

.sdcn-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    font-size: 13.5px;
    color: #0f172a;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
    box-sizing: border-box;
}

.sdcn-select-trigger:hover {
    border-color: #cbd5e1;
}

.sdcn-select-trigger:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
}

.sdcn-select-trigger.placeholder .sdcn-select-value {
    color: #94a3b8;
}

.sdcn-select-value {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sdcn-select-chevron {
    color: #94a3b8;
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

.sdcn-select-chevron.open {
    transform: rotate(180deg);
}

.sdcn-select-content {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04);
    z-index: 300;
    padding: 4px;
    max-height: 220px;
    overflow-y: auto;
    animation: sdcn-dropdown-in 0.12s ease;
}

@keyframes sdcn-dropdown-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
}

.sdcn-select-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13.5px;
    color: #0f172a;
    cursor: pointer;
    transition: background 0.12s;
    user-select: none;
}

.sdcn-select-item:hover {
    background: #f1f5f9;
}

.sdcn-select-item.selected {
    background: #eef2ff;
    font-weight: 600;
}

.sdcn-select-check {
    color: #6366f1;
    flex-shrink: 0;
}

/* ── Shadcn-style input / textarea ─────────────────────────────── */
.pe-sdcn-input {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    font-size: 13.5px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    font-family: inherit;
}

.pe-sdcn-input::placeholder { color: #94a3b8; }

.pe-sdcn-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
}

textarea.pe-sdcn-input {
    height: auto;
    padding: 10px 12px;
    resize: vertical;
    line-height: 1.5;
}

.pe-field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 7px;
}
`;

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
            await projectAPI.update(project._id, form);
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
        <div className="modal-overlay" onClick={onClose}>
            <style>{scopedStyles}</style>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', overflow: 'visible' }}>
                <div className="modal-header">
                    <h2>Edit Project: {project.name}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-body modern-body" style={{ overflow: 'visible' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', marginBottom: '24px' }}>
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
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
