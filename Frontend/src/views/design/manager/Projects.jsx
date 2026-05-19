import React from 'react';
import { 
    Briefcase, 
    ChevronRight, 
    Maximize, 
    Clock, 
    TrendingUp, 
    AlertCircle, 
    Package,
    ArrowRight,
    Users
} from 'lucide-react';
import '../css/DesignStudio.css';

const Projects = ({
    projects = [],
    tasks = [],
    getImageUrl,
    materialRequests = [],
    onReviewRequest,
    onUpdateStatus,
    onHandoffInitiate,
    onAssignStaff,
}) => {
    const sortedProjects = [...projects].sort((a, b) => {
        const aTasks = tasks.filter(t => 
            (t.project?._id || t.project || t.quotation?._id || t.quotation)?.toString() === a._id?.toString()
        );
        const bTasks = tasks.filter(t => 
            (t.project?._id || t.project || t.quotation?._id || t.quotation)?.toString() === b._id?.toString()
        );

        const aPending = a.stage !== 'Procurement' && aTasks.length === 0;
        const bPending = b.stage !== 'Procurement' && bTasks.length === 0;

        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return 0;
    });

    return (
        <div className="portfolio-modern fade-in" style={{ paddingTop: '1rem' }}>

            <div className="portfolio-grid">
                {sortedProjects.map((project, idx) => {
                    const projectMaterials = materialRequests?.filter(r => 
                        (r.project?._id || r.project)?.toString() === project._id?.toString()
                    ) || [];
                    const pendingMaterials = projectMaterials.filter(r => r.status === 'Design Review');

                    const projectTasks = tasks.filter(t => 
                        (t.project?._id || t.project || t.quotation?._id || t.quotation)?.toString() === project._id?.toString()
                    );

                    let displayStatus = 'Pending Assignment';
                    let statusClass = 'pending';
                    let statusDueDate = project.targetEndDate;

                    if (project.stage === 'Procurement') {
                        displayStatus = 'Forwarded to Procurement';
                        statusClass = 'procurement';
                    } else if (projectTasks.length > 0) {
                        const hasSubmissions = projectTasks.some(t => t.submissions?.length > 0);
                        const isApproved = projectTasks.every(t => t.status === 'Approved' || t.status === 'Pushed to Procurement' || t.status === 'Completed');
                        const needsRevision = projectTasks.some(t => t.status === 'Revision Required');
                        const isReviewPending = projectTasks.some(t => t.status === 'Review Pending');
                        const isSalesReview = projectTasks.some(t => t.status === 'Pending Sales Review');
                        
                        const primaryTask = projectTasks.find(t => t.status !== 'Completed') || projectTasks[0];

                        if (isApproved) {
                            displayStatus = 'Approved';
                            statusClass = 'completed';
                        } else if (isSalesReview) {
                            displayStatus = 'Pending Sales';
                            statusClass = 'submitted';
                        } else if (needsRevision) {
                            displayStatus = 'Revision Required';
                            statusClass = 'revision';
                        } else if (isReviewPending || hasSubmissions) {
                            displayStatus = 'Files Received';
                            statusClass = 'submitted';
                        } else {
                            displayStatus = `Assigned`;
                            statusClass = 'assigned';
                            if (primaryTask?.dueDate) statusDueDate = primaryTask.dueDate;
                        }
                    }

                    const moodImages = [
                        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
                        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=600"
                    ];

                    let previewImage = moodImages[idx % moodImages.length];
                    const submissions = projectTasks
                        .flatMap(t => t.submissions || [])
                        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

                    if (submissions.length > 0 && submissions[0].files?.length > 0) {
                        const imgFile = submissions[0].files.find(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i));
                        if (imgFile) previewImage = getImageUrl(imgFile.url);
                    }

                    return (
                        <div key={project._id} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div className="card-media">
                                <img src={previewImage} alt={project.name} />
                                <div className={`status-tag ${statusClass}`}>{displayStatus}</div>
                            </div>
                            
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div className="card-header-main">
                                    <h3 className="project-name">{project.name}</h3>
                                    <span className="project-num">{project.projectNumber}</span>
                                </div>

                                <div className="card-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem', flex: 1 }}>
                                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                                        <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '8px' }}><Briefcase size={12} /></div>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.client?.name || 'Private Client'}</span>
                                    </div>
                                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                                        <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px' }}><Users size={12} color="#2563eb" /></div>
                                        <span style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {projectTasks.length > 0 
                                                ? projectTasks.flatMap(t => t.assignedTo || []).map(s => s.name || s.fullName).filter((v, i, a) => v && a.indexOf(v) === i).join(', ') || 'Unassigned' 
                                                : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', gridColumn: 'span 2' }}>
                                        <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '8px' }}><Clock size={12} color="#ef4444" /></div>
                                        <span>
                                            <strong style={{ color: '#ef4444' }}>{displayStatus === 'Assigned' ? 'Due: ' : 'Deadline: '}</strong>
                                            {statusDueDate ? new Date(statusDueDate).toLocaleDateString() : 'TBD'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="card-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    {/* Handoff to Procurement Button */}
                                    {displayStatus === 'Approved' && project.stage !== 'Procurement' && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onHandoffInitiate(project); }}
                                            className="action-btn-primary"
                                            style={{
                                                flex: 1,
                                                minWidth: '120px',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                background: '#0f172a',
                                                color: '#ffffff',
                                                border: 'none',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                transition: 'all 0.15s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
                                        >
                                            Handoff to Procurement <ArrowRight size={14} />
                                        </button>
                                    )}

                                    {/* Material Review Button */}
                                    {pendingMaterials.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onReviewRequest(project._id); }}
                                            className="action-btn-secondary"
                                            style={{
                                                flex: 1,
                                                minWidth: '120px',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                background: '#fef2f2',
                                                color: '#ef4444',
                                                border: '1px solid #fee2e2',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                transition: 'all 0.15s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#fde2e2'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                                        >
                                            Review {pendingMaterials.length} Materials <Package size={14} />
                                        </button>
                                    )}

                                    {/* Assign Staff Button */}
                                    {project.stage === 'Design' && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onAssignStaff(project); }}
                                            style={{
                                                flex: 1,
                                                minWidth: '120px',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                background: projectTasks.length === 0 ? '#2563eb' : '#f1f5f9',
                                                color: projectTasks.length === 0 ? '#ffffff' : '#475569',
                                                border: projectTasks.length === 0 ? 'none' : '1px solid #e2e8f0',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                transition: 'all 0.15s'
                                            }}
                                            onMouseOver={(e) => {
                                                if (projectTasks.length === 0) {
                                                    e.currentTarget.style.background = '#1d4ed8';
                                                } else {
                                                    e.currentTarget.style.background = '#e2e8f0';
                                                }
                                            }}
                                            onMouseOut={(e) => {
                                                if (projectTasks.length === 0) {
                                                    e.currentTarget.style.background = '#2563eb';
                                                } else {
                                                    e.currentTarget.style.background = '#f1f5f9';
                                                }
                                            }}
                                        >
                                            <Users size={14} />
                                            {projectTasks.length === 0 ? 'Assign Staff' : 'Assign More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Projects;
