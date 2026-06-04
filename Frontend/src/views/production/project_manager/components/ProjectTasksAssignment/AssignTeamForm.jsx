import React from 'react';
import { UserPlus, Loader2, Check } from 'lucide-react';

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
                        <UserPlus size={14} color="#3b82f6" /> Project Engineer (PE)
                    </label>
                    <select 
                        value={teamForm.projectEngineer}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, projectEngineer: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    >
                        <option value="">-- Unassigned --</option>
                        {projectEngineers.map(e => (
                            <option key={e._id} value={e._id}>{e.fullName} ({e.email})</option>
                        ))}
                    </select>
                </div>

                {/* Site Engineer */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        <UserPlus size={14} color="#10b981" /> Site Engineer (SE)
                    </label>
                    <select 
                        value={teamForm.siteEngineer}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, siteEngineer: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    >
                        <option value="">-- Unassigned --</option>
                        {siteEngineers.map(e => (
                            <option key={e._id} value={e._id}>{e.fullName} ({e.email})</option>
                        ))}
                    </select>
                </div>

                {/* Site Supervisor */}
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                        <UserPlus size={14} color="#f59e0b" /> Site Supervisor (SS)
                    </label>
                    <select 
                        value={teamForm.siteSupervisor}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, siteSupervisor: e.target.value }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                    >
                        <option value="">-- Unassigned --</option>
                        {siteSupervisors.map(e => (
                            <option key={e._id} value={e._id}>{e.fullName} ({e.email})</option>
                        ))}
                    </select>
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
