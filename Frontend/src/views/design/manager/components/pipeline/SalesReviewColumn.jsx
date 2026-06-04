import React from 'react';
import { Send, CheckCircle, Briefcase, Clock } from 'lucide-react';

const SalesReviewColumn = ({ salesReview, getApprovalTime, CardPreview, onReviewTask }) => {
    return (
        <div className="pipeline-column">
            <div className="col-header" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="col-title-box"><Send size={18} /><span>Sales Review</span></div>
                <span className="col-count" style={{ background: '#d1fae5', color: '#059669' }}>{salesReview.length}</span>
            </div>
            <div className="col-body">
                {salesReview.map(task => (
                    <div key={task._id} className="pipeline-card sales-card">
                        <div className="card-header">
                            <h4>{task.title}</h4>
                            <div className="approval-marker mgr">
                                <CheckCircle size={10} />
                                <span>MGR APPROVED: {getApprovalTime(task, 'approved')}</span>
                            </div>
                        </div>
                        <CardPreview task={task} />
                        <div className="card-info">
                            <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                            <p className="pending-notice"><Clock size={12} /> Waiting for Sales/Client approval...</p>
                        </div>
                        <button className="card-btn secondary" onClick={() => onReviewTask(task)}>View Design</button>
                    </div>
                ))}
                {salesReview.length === 0 && <div className="empty-col">No designs with Sales</div>}
            </div>
        </div>
    );
};

export default SalesReviewColumn;
