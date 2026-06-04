import React from 'react';
import { RefreshCw, X, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

const DailyUpdateModal = ({ 
    selectedTask, 
    setShowDailyUpdateModal, 
    dailyUpdateData, 
    setDailyUpdateData, 
    handleSubmitDailyUpdate, 
    submittingUpdate 
}) => {
    if (!selectedTask) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-styled" style={{ maxWidth: '550px', borderRadius: '32px' }}>
                <div className="modal-header" style={{ padding: '2rem 2.5rem', background: '#fcfdfe' }}>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 900 }}><RefreshCw size={24} color="#6366f1" /> Daily Progress Update</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>Updating status for: <strong>{selectedTask.title}</strong></p>
                    </div>
                    <button className="close-btn" onClick={() => setShowDailyUpdateModal(false)}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmitDailyUpdate} style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px', color: '#1e293b' }}>
                            <TrendingUp size={16} color="#6366f1" /> Progress Summary
                        </label>
                        <textarea
                            className="premium-textarea"
                            value={dailyUpdateData.update}
                            onChange={e => setDailyUpdateData({ ...dailyUpdateData, update: e.target.value })}
                            placeholder="What was achieved today? List completed sub-tasks or milestones..."
                            required
                            style={{ minHeight: '120px', borderRadius: '18px', padding: '1rem', border: '1px solid #e2e8f0', width: '100%', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px', color: '#ef4444' }}>
                            <AlertTriangle size={16} /> Blockers or Emergencies
                        </label>
                        <textarea
                            className="premium-textarea"
                            value={dailyUpdateData.emergencies}
                            onChange={e => setDailyUpdateData({ ...dailyUpdateData, emergencies: e.target.value })}
                            placeholder="Mention any issues slowing you down..."
                            style={{ minHeight: '80px', borderRadius: '18px', padding: '1rem', border: '1px solid #fee2e2', width: '100%', fontSize: '0.9rem', background: '#fff1f2' }}
                        />
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '12px', color: '#1e293b' }}>
                            <Clock size={16} color="#6366f1" /> Extension Request
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>REQUESTED DATE</span>
                                    <input
                                        type="date"
                                        className="premium-date-input"
                                        value={dailyUpdateData.requestedDate}
                                        onChange={e => setDailyUpdateData({ ...dailyUpdateData, requestedDate: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>REASON FOR DELAY</span>
                                    <input
                                        type="text"
                                        className="premium-input-field"
                                        value={dailyUpdateData.reason}
                                        onChange={e => setDailyUpdateData({ ...dailyUpdateData, reason: e.target.value })}
                                        placeholder="Brief explanation..."
                                        style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-secondary" style={{ flex: 1, height: '54px', borderRadius: '16px', fontWeight: 800 }} onClick={() => setShowDailyUpdateModal(false)}>Discard</button>
                        <button type="submit" className="btn-primary" style={{ flex: 2, height: '54px', borderRadius: '16px', background: '#1e293b', fontWeight: 800 }} disabled={submittingUpdate}>
                            {submittingUpdate ? 'Submitting...' : 'Confirm Daily Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyUpdateModal;
