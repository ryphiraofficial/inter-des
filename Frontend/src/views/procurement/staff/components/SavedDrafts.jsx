import React from 'react';
import { CheckSquare, Trash2 } from 'lucide-react';

const SavedDrafts = ({ savedSourcing, handleDeleteSaved, setSelectedSourcingProject, setSourcingBucket, setDailyUpdate }) => {
    return (
        <div className="saved-drafts-section">
            <div className="section-title-row">
                <div className="icon-box"><CheckSquare size={20} /></div>
                <h4>Saved Sourcing Drafts</h4>
            </div>
            <div className="saved-sourcing-grid">
                {savedSourcing.map(draft => (
                    <div key={draft.id} className="saved-sourcing-card">
                        <div className="card-header">
                            <div className="project-info">
                                <h5>{draft.project?.name}</h5>
                                <span className="save-date">Saved: {new Date(draft.savedAt).toLocaleDateString()}</span>
                            </div>
                            <button className="btn-delete-draft" onClick={() => handleDeleteSaved(draft.id)}><Trash2 size={16} /></button>
                        </div>
                        <div className="draft-items-preview">
                            {draft.items.slice(0, 2).map((item, i) => (
                                <div key={i} className="preview-item">
                                    <span>{item.itemName}</span>
                                    <span className="price">₹{item.unitPrice}</span>
                                </div>
                            ))}
                            {draft.items.length > 2 && <span className="more-count">+{draft.items.length - 2} more items</span>}
                        </div>
                        <div className="draft-update-preview">
                            "{draft.dailyUpdate || 'No update provided'}"
                        </div>
                        <button 
                            className="btn-edit-continue"
                            onClick={() => {
                                setSelectedSourcingProject(draft.project);
                                setSourcingBucket(draft.items);
                                setDailyUpdate(draft.dailyUpdate);
                                handleDeleteSaved(draft.id);
                            }}
                        >
                            Edit & Continue
                        </button>
                    </div>
                ))}
                {savedSourcing.length === 0 && (
                    <div className="no-drafts-state">
                        No saved sourcing lists yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedDrafts;
