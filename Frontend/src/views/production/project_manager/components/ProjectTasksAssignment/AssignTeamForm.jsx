import React from 'react';
import { UserPlus, Loader2, Check } from 'lucide-react';

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

const AssignTeamForm = ({ 
    handleUpdateTeam, 
    teamForm, 
    setTeamForm, 
    updatingTeam, 
    setActiveTab,
    projectEngineers,
    siteEngineers,
    siteSupervisors
}) => {
    return (
        <form onSubmit={handleUpdateTeam} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#1e293b' }}>
                Project Active Team Assignment
            </h4>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                Assign or update the main team leads and staff members managing this active production workflow.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                
                {/* Project Engineer */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        <UserPlus size={14} color="#3b82f6" /> Project Engineer(s)
                    </label>
                    <MultiSelectCheckbox 
                        options={projectEngineers} 
                        selectedValues={teamForm.projectEngineer || []} 
                        onChange={(vals) => setTeamForm(prev => ({ ...prev, projectEngineer: vals }))} 
                    />
                </div>

                {/* Site Engineer */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        <UserPlus size={14} color="#10b981" /> Site Engineer(s)
                    </label>
                    <MultiSelectCheckbox 
                        options={siteEngineers} 
                        selectedValues={teamForm.siteEngineer || []} 
                        onChange={(vals) => setTeamForm(prev => ({ ...prev, siteEngineer: vals }))} 
                    />
                </div>

                {/* Site Supervisor */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        <UserPlus size={14} color="#f59e0b" /> Site Supervisor(s)
                    </label>
                    <MultiSelectCheckbox 
                        options={siteSupervisors} 
                        selectedValues={teamForm.siteSupervisor || []} 
                        onChange={(vals) => setTeamForm(prev => ({ ...prev, siteSupervisor: vals }))} 
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button 
                    type="button" 
                    onClick={() => setActiveTab('tasks')}
                    style={{ padding: '10px 20px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={updatingTeam}
                    style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    {updatingTeam ? <Loader2 className="pm-spin" size={16} /> : <><Check size={16} /> Save Team Assignment</>}
                </button>
            </div>
        </form>
    );
};

export default AssignTeamForm;
