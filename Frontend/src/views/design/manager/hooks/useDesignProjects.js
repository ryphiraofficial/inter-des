import { useState, useMemo } from 'react';

export const useDesignProjects = ({ projects, tasks, materialRequests, getImageUrl }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const { projectsWithStatus, pendingCount, revisionCount, otherCount } = useMemo(() => {
        const sortedProjects = [...(projects || [])].sort((a, b) => {
            const aTasks = (tasks || []).filter(t => 
                (t.project?._id || t.project || t.quotation?._id || t.quotation)?.toString() === a._id?.toString()
            );
            const bTasks = (tasks || []).filter(t => 
                (t.project?._id || t.project || t.quotation?._id || t.quotation)?.toString() === b._id?.toString()
            );

            const finishedStages = ['Procurement', 'Production', 'Completed'];
            const aFinished = finishedStages.includes(a.stage);
            const bFinished = finishedStages.includes(b.stage);
            
            if (aFinished && !bFinished) return 1;
            if (!aFinished && bFinished) return -1;

            const aPending = !aFinished && aTasks.length === 0;
            const bPending = !bFinished && bTasks.length === 0;

            if (aPending && !bPending) return -1;
            if (!aPending && bPending) return 1;
            
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const withStatus = sortedProjects.map((project, idx) => {
            const projectMaterials = (materialRequests || []).filter(r => 
                (r.project?._id || r.project)?.toString() === project._id?.toString()
            );
            const pendingMaterials = projectMaterials.filter(r => r.status === 'Design Review');

            const projectTasks = (tasks || []).filter(t => 
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
                if (imgFile && getImageUrl) previewImage = getImageUrl(imgFile.url);
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

        return {
            projectsWithStatus: withStatus,
            pendingCount: withStatus.filter(p => p.group === 'Pending').length,
            revisionCount: withStatus.filter(p => p.group === 'Revision Required').length,
            otherCount: withStatus.filter(p => p.group === 'Other').length
        };
    }, [projects, tasks, materialRequests, getImageUrl]);

    const filteredProjects = activeFilter === 'All' 
        ? projectsWithStatus 
        : projectsWithStatus.filter(p => p.group === activeFilter);

    return {
        activeFilter,
        setActiveFilter,
        projectsWithStatus,
        pendingCount,
        revisionCount,
        otherCount,
        filteredProjects
    };
};
