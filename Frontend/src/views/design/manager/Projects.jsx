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

        // 1. Move finished projects (past Design) to the very bottom
        const finishedStages = ['Procurement', 'Production', 'Completed'];
        const aFinished = finishedStages.includes(a.stage);
        const bFinished = finishedStages.includes(b.stage);
        
        if (aFinished && !bFinished) return 1;
        if (!aFinished && bFinished) return -1;

        // 2. Move pending assignment projects to the very top
        const aPending = !aFinished && aTasks.length === 0;
        const bPending = !bFinished && bTasks.length === 0;

        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        
        // 3. Sort the rest by newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const [activeFilter, setActiveFilter] = React.useState('All');

    const projectsWithStatus = sortedProjects.map((project, idx) => {
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

        return {
            ...project,
            displayStatus,
            statusClass,
            statusDueDate,
            pendingMaterials,
            projectTasks,
            previewImage,
            group: displayStatus === 'Pending Assignment' ? 'Pending' :
                   displayStatus === 'Revision Required' ? 'Revision Required' : 'Other'
        };
    });

    const pendingCount = projectsWithStatus.filter(p => p.group === 'Pending').length;
    const revisionCount = projectsWithStatus.filter(p => p.group === 'Revision Required').length;
    const otherCount = projectsWithStatus.filter(p => p.group === 'Other').length;

    const filteredProjects = activeFilter === 'All' 
        ? projectsWithStatus 
        : projectsWithStatus.filter(p => p.group === activeFilter);

    const renderProjectCard = (project) => (
        <div key={project._id} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="card-media">
                <img src={project.previewImage} alt={project.name} />
                <div className={`status-tag ${project.statusClass}`}>{project.displayStatus}</div>
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
                            {project.projectTasks.length > 0 
                                ? project.projectTasks.flatMap(t => t.assignedTo || []).map(s => s.name || s.fullName).filter((v, i, a) => v && a.indexOf(v) === i).join(', ') || 'Unassigned' 
                                : 'Pending'}
                        </span>
                    </div>
                    <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', gridColumn: 'span 2' }}>
                        <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '8px' }}><Clock size={12} color="#ef4444" /></div>
                        <span>
                            <strong style={{ color: '#ef4444' }}>{project.displayStatus === 'Assigned' ? 'Due: ' : 'Deadline: '}</strong>
                            {project.statusDueDate ? new Date(project.statusDueDate).toLocaleDateString() : 'TBD'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    {/* Handoff to Procurement Button */}
                    {project.displayStatus === 'Approved' && !['Procurement', 'Production', 'Completed'].includes(project.stage) && (
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
                    {project.pendingMaterials.length > 0 && (
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
                            Review {project.pendingMaterials.length} Materials <Package size={14} />
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
                                background: project.projectTasks.length === 0 ? '#2563eb' : '#f1f5f9',
                                color: project.projectTasks.length === 0 ? '#ffffff' : '#475569',
                                border: project.projectTasks.length === 0 ? 'none' : '1px solid #e2e8f0',
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
                                if (project.projectTasks.length === 0) {
                                    e.currentTarget.style.background = '#1d4ed8';
                                } else {
                                    e.currentTarget.style.background = '#e2e8f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (project.projectTasks.length === 0) {
                                    e.currentTarget.style.background = '#2563eb';
                                } else {
                                    e.currentTarget.style.background = '#f1f5f9';
                                }
                            }}
                        >
                            <Users size={14} />
                            {project.projectTasks.length === 0 ? 'Assign Staff' : 'Assign More'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="portfolio-modern fade-in" style={{ paddingTop: '1rem' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveFilter('All')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'All' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'All' ? '#0f172a' : '#ffffff',
                        color: activeFilter === 'All' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <Briefcase size={16} /> All Projects
                    <span style={{ background: activeFilter === 'All' ? '#334155' : '#f1f5f9', color: activeFilter === 'All' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{projectsWithStatus.length}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('Pending')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'Pending' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'Pending' ? '#3b82f6' : '#ffffff',
                        color: activeFilter === 'Pending' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <Clock size={16} /> Pending
                    <span style={{ background: activeFilter === 'Pending' ? '#60a5fa' : '#f1f5f9', color: activeFilter === 'Pending' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{pendingCount}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('Revision Required')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'Revision Required' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'Revision Required' ? '#f59e0b' : '#ffffff',
                        color: activeFilter === 'Revision Required' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <AlertCircle size={16} /> Revision Required
                    <span style={{ background: activeFilter === 'Revision Required' ? '#fbbf24' : '#f1f5f9', color: activeFilter === 'Revision Required' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{revisionCount}</span>
                </button>
                <button
                    onClick={() => setActiveFilter('Other')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: activeFilter === 'Other' ? 'none' : '1px solid #e2e8f0',
                        background: activeFilter === 'Other' ? '#64748b' : '#ffffff',
                        color: activeFilter === 'Other' ? '#ffffff' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                    }}
                >
                    <TrendingUp size={16} /> Other
                    <span style={{ background: activeFilter === 'Other' ? '#94a3b8' : '#f1f5f9', color: activeFilter === 'Other' ? '#fff' : '#64748b', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{otherCount}</span>
                </button>
            </div>

            <div className="portfolio-grid">
                {filteredProjects.map(renderProjectCard)}
            </div>

            {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1', marginTop: '2rem' }}>
                    <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No projects found in this category</p>
                </div>
            )}
        </div>
    );
};

export default Projects;
