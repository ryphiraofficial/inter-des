import React from 'react';
import ActiveDesignColumn from './pipeline/ActiveDesignColumn';
import StaffSubmissionsColumn from './pipeline/StaffSubmissionsColumn';
import SalesReviewColumn from './pipeline/SalesReviewColumn';
import AdminApprovalColumn from './pipeline/AdminApprovalColumn';
import FinalizedSection from './pipeline/FinalizedSection';

const PipelineTab = ({
    tasks, getImageUrl,
    onOpenAssignModal, onReviewTask, onSendToAdmin
}) => {
    const activeDesign = tasks.filter(t => t.status === 'To Do' || t.status === 'In Progress');
    const submissions = tasks.filter(t => t.status === 'Review Pending' || t.status === 'Revision Required');
    const salesReview = tasks.filter(t => t.status === 'Pending Sales Review');
    const adminApproval = tasks
        .filter(t => ['Sales Approved', 'Pending Admin Review', 'Admin Rejected', 'Pushed to Procurement', 'Admin Approved'].includes(t.status))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const getApprovalTime = (task, action) => {
        const entry = task.timeline?.find(item => item.action === action);
        return entry ? new Date(entry.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : null;
    };

    const hasPreviewImage = (task) =>
        task.submissions?.[task.submissions.length - 1]?.files?.some(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i));

    const getPreviewUrl = (task) => {
        const files = task.submissions?.[task.submissions.length - 1]?.files || [];
        const imgFile = files.find(f => f.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i));
        return imgFile ? getImageUrl(imgFile.url) : null;
    };

    const CardPreview = ({ task }) => hasPreviewImage(task) ? (
        <div style={{ margin: '10px 0', borderRadius: '12px', overflow: 'hidden', height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <img src={getPreviewUrl(task)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    ) : null;

    return (
        <div className="design-pipeline-workflow" style={{ padding: '1rem 10px 0 10px' }}>

            <div className="pipeline-grid">

                {/* COLUMN 1: ACTIVE DESIGN */}
                <ActiveDesignColumn 
                    activeDesign={activeDesign} 
                    onOpenAssignModal={onOpenAssignModal} 
                />

                {/* COLUMN 2: STAFF SUBMISSIONS */}
                <StaffSubmissionsColumn 
                    submissions={submissions} 
                    CardPreview={CardPreview} 
                    onReviewTask={onReviewTask} 
                />

                {/* COLUMN 3: SALES REVIEW */}
                <SalesReviewColumn 
                    salesReview={salesReview} 
                    getApprovalTime={getApprovalTime} 
                    CardPreview={CardPreview} 
                    onReviewTask={onReviewTask} 
                />

                {/* COLUMN 4: ADMIN APPROVAL */}
                <AdminApprovalColumn 
                    adminApproval={adminApproval} 
                    getApprovalTime={getApprovalTime} 
                    onSendToAdmin={onSendToAdmin} 
                />
            </div>
            
            {/* FULL WIDTH FINALIZED SECTION */}
            <FinalizedSection adminApproval={adminApproval} />
        </div>
    );
};

export default PipelineTab;
