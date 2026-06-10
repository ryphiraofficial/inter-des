import React from 'react';
import { Building, Clock, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';

const MultiSelectCheckbox = ({ options, selectedValues = [], onChange }) => {
    const handleToggle = (id) => {
        if (selectedValues.includes(id)) {
            onChange(selectedValues.filter(val => val !== id));
        } else {
            onChange([...selectedValues, id]);
        }
    };
    
    return (
        <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px', maxHeight: '120px', overflowY: 'auto', background: '#fff' }}>
            {options.length === 0 ? <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>No users available</span> : null}
            {options.map(s => (
                <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '0.85rem', cursor: 'pointer', color: '#334155' }}>
                    <input 
                        type="checkbox" 
                        checked={selectedValues.includes(s._id)} 
                        onChange={() => handleToggle(s._id)} 
                        style={{ cursor: 'pointer' }}
                    />
                    {s.fullName}
                </label>
            ))}
        </div>
    );
};

const HandoffCard = ({ 
    project, 
    submitting, 
    currAssigned, 
    handleAssign, 
    handleAcceptHandoff,
    projectEngineers,
    siteEngineers,
    siteSupervisors
}) => {
    return (
        <div className="pm-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#0f172a' }}>{project.projectName}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                            {project.clientId && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Building size={14} /> {project.clientId.name}
                                </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={14} /> Received {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <span style={{ padding: '6px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                        Pending Team Assignment
                    </span>
                </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f1f5f9', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <AlertCircle size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
                        Admin has approved procurement for this project and assigned you as the Project Manager. Assign your team to begin production.
                    </p>
                </div>

                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1e293b' }}>Assign Team</h4>
                
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            <UserPlus size={14} /> Project Engineer(s)
                        </label>
                        <MultiSelectCheckbox 
                            options={projectEngineers} 
                            selectedValues={currAssigned.projectEngineer || []} 
                            onChange={(vals) => handleAssign(project._id, 'projectEngineer', vals)} 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            <UserPlus size={14} /> Site Engineer(s)
                        </label>
                        <MultiSelectCheckbox 
                            options={siteEngineers} 
                            selectedValues={currAssigned.siteEngineer || []} 
                            onChange={(vals) => handleAssign(project._id, 'siteEngineer', vals)} 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            <UserPlus size={14} /> Site Supervisor(s)
                        </label>
                        <MultiSelectCheckbox 
                            options={siteSupervisors} 
                            selectedValues={currAssigned.siteSupervisor || []} 
                            onChange={(vals) => handleAssign(project._id, 'siteSupervisor', vals)} 
                        />
                    </div>
                </div>

                <button 
                    onClick={() => handleAcceptHandoff(project)}
                    disabled={submitting}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        background: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: 600, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1
                    }}
                >
                    {submitting ? 'Activating...' : (
                        <><CheckCircle size={18} /> Accept Project & Notify Team</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HandoffCard;
