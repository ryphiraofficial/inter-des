import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSiteTaskDetail } from '../../hooks/useSiteTaskDetail';
import SiteTaskCompletionModal from './SiteTaskCompletionModal';
import SiteEngineerReviewBanner from './SiteTaskDetail/SiteEngineerReviewBanner';
import TaskHeader from './SiteTaskDetail/TaskHeader';
import CompletedWorkPhotos from './SiteTaskDetail/CompletedWorkPhotos';
import UpdateStatus from './SiteTaskDetail/UpdateStatus';
import CommentsSection from './SiteTaskDetail/CommentsSection';
import TaskDetailsSidebar from './SiteTaskDetail/TaskDetailsSidebar';

const SiteTaskDetail = ({ task, user, onBack, onUpdate }) => {
    const {
        localTask,
        comment, setComment,
        note, setNote,
        showNote, setShowNote,
        saving, statusSaving, reassigning,
        uploadingFile, uploadingReviewFile,
        toast,
        showCompletionModal, setShowCompletionModal,
        completionNote, setCompletionNote,
        selectedImages, qaChecked, setQaChecked,
        reviewNote, setReviewNote,
        reviewImages,
        supervisors,
        handleStatus, submitCompletion, handleReassign, handleReviewAction, handleComment,
        uploadImage, removeImage
    } = useSiteTaskDetail(task, user, onUpdate);

    const isMine = localTask.assignedTo?._id === user?._id || localTask.assignedTo === user?._id;
    const isOverdue = localTask.dueDate && new Date(localTask.dueDate) < new Date() && !['Completed', 'Approved'].includes(localTask.status);

    return (
        <div>
            {toast && <div className="site-toast" style={{ background: toast.type === 'success' ? '#10b981' : '#ef4444' }}>{toast.msg}</div>}
            <button className="site-back-btn" onClick={onBack}><ArrowLeft size={15} />Back to Tasks</button>
            <div className="site-detail-grid">
                <div>
                    <SiteEngineerReviewBanner 
                        localTask={localTask} user={user} reviewNote={reviewNote} setReviewNote={setReviewNote}
                        reviewImages={reviewImages} uploadImage={uploadImage} removeImage={removeImage}
                        uploadingReviewFile={uploadingReviewFile} statusSaving={statusSaving} handleReviewAction={handleReviewAction}
                    />

                    <TaskHeader localTask={localTask} isOverdue={isOverdue} />

                    <CompletedWorkPhotos localTask={localTask} />

                    <UpdateStatus 
                        localTask={localTask} user={user} handleStatus={handleStatus} 
                        statusSaving={statusSaving} showNote={showNote} setShowNote={setShowNote} 
                        note={note} setNote={setNote} isMine={isMine}
                    />

                    <CommentsSection 
                        localTask={localTask} comment={comment} setComment={setComment} 
                        handleComment={handleComment} saving={saving}
                    />
                </div>

                <div>
                    <TaskDetailsSidebar 
                        localTask={localTask} user={user} supervisors={supervisors} 
                        handleReassign={handleReassign} reassigning={reassigning}
                    />
                </div>
            </div>

            <SiteTaskCompletionModal
                show={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                completionNote={completionNote} setCompletionNote={setCompletionNote}
                selectedImages={selectedImages}
                uploadingFile={uploadingFile} uploadImage={uploadImage} removeImage={removeImage}
                qaChecked={qaChecked} setQaChecked={setQaChecked}
                submitCompletion={submitCompletion} statusSaving={statusSaving}
            />
        </div>
    );
};

export default SiteTaskDetail;
