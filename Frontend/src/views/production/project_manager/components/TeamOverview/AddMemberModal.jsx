import React from 'react';
import { Users, X } from 'lucide-react';

const AddMemberModal = ({ isModalOpen, setIsModalOpen, newMember, setNewMember, handleCreateMember }) => {
    if (!isModalOpen) return null;

    return (
        <div className="pm-modal-overlay">
            <div className="pm-modal" style={{ maxWidth: '600px' }}>
                <div className="pm-modal-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                        <Users size={24} color="#3b82f6" /> Add Team Member
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="pm-modal-close">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreateMember}>
                    <div className="pm-modal-body" data-lenis-prevent>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="pm-input-label">Full Name *</label>
                                <input required type="text" className="pm-text-input" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="pm-input-label">Role *</label>
                                <input required type="text" className="pm-text-input" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="e.g. Project Engineer" />
                            </div>
                            <div>
                                <label className="pm-input-label">Location *</label>
                                <input required type="text" className="pm-text-input" value={newMember.location} onChange={e => setNewMember({...newMember, location: e.target.value})} />
                            </div>
                            <div>
                                <label className="pm-input-label">Email *</label>
                                <input required type="email" className="pm-text-input" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="pm-input-label">Phone *</label>
                                <input required type="text" className="pm-text-input" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="pm-input-label">Reporting Team (Comma separated names)</label>
                                <input type="text" className="pm-text-input" value={newMember.reportingManager} onChange={e => setNewMember({...newMember, reportingManager: e.target.value})} placeholder="e.g. Arjun M., Neha S." />
                            </div>
                            <div>
                                <label className="pm-input-label">Active Projects</label>
                                <input type="number" min="0" className="pm-text-input" value={newMember.activeProjects} onChange={e => setNewMember({...newMember, activeProjects: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label className="pm-input-label">Workload %</label>
                                <input type="number" min="0" max="100" className="pm-text-input" value={newMember.workloadPercentage} onChange={e => setNewMember({...newMember, workloadPercentage: parseInt(e.target.value)})} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="pm-input-label">Performance</label>
                                <select className="pm-text-input" value={newMember.performance} onChange={e => setNewMember({...newMember, performance: e.target.value})}>
                                    <option value="Good">Good</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Outstanding">Outstanding</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="pm-modal-footer">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="pm-modal-btn secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="pm-modal-btn primary" style={{ flex: 1 }}>Add Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
