import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTaskDetail } from './hooks/useTaskDetail';
import PEReviewPortal from './components/TaskDetail/PEReviewPortal';
import TaskMainContent from './components/TaskDetail/TaskMainContent';
import TaskSidebar from './components/TaskDetail/TaskSidebar';
import CreateSubtaskModal from './components/ProjectDetail/CreateSubtaskModal'; // reuse from ProjectDetail
import './Engineer.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const getPriorityStyle = (p) => ({ Low:{color:'#64748b',bg:'#f1f5f9'}, Medium:{color:'#2563eb',bg:'#dbeafe'}, High:{color:'#d97706',bg:'#fef3c7'}, Urgent:{color:'#dc2626',bg:'#fee2e2'} }[p]||{color:'#64748b',bg:'#f1f5f9'});
const getStatusStyle   = (s) => ({ 'Pending':{label:'#92400e',bg:'#fef3c7',dot:'#f59e0b'}, 'In Progress':{label:'#1e40af',bg:'#dbeafe',dot:'#3b82f6'}, 'Completed':{label:'#065f46',bg:'#d1fae5',dot:'#10b981'}, 'Approved':{label:'#5b21b6',bg:'#ede9fe',dot:'#8b5cf6'} }[s]||{label:'#374151',bg:'#f3f4f6',dot:'#9ca3af'});

const TaskDetail = ({}) => {
    const user = useAppSelector(selectUser);
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        task, loading, comment, setComment, saving, statusSaving, toast,
        showNote, setShowNote, note, setNote, reviewNote, setReviewNote, reviewImages, uploadingReviewFile,
        uploadImage, removeImage,
        showSubtaskModal, setShowSubtaskModal, subtaskSaving, siteTeam, supervisors, subform, setSubform,
        handleCreateSubtask, handleStatusChange, handlePEReviewAction, handleReassignTask, handleComment
    } = useTaskDetail(id, user);

    if (loading) return <div className="eng-dashboard"><div className="eng-loading">Loading task…</div></div>;
    if (!task)   return <div className="eng-dashboard"><div className="eng-empty"><p>Task not found</p></div></div>;

    const pr = getPriorityStyle(task.priority);
    const st = getStatusStyle(task.status);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !['Completed','Approved'].includes(task.status);
    const isMine = task.assignedTo?._id === user?._id || task.assignedTo === user?._id;
    const currentPipelineStage = task.stage;

    return (
        <div className="eng-tasks-page">
            {toast && <div className="eng-toast" style={{ background: toast.type==='success'?'#10b981':'#ef4444' }}>{toast.msg}</div>}

            {/* Back */}
            <button className="eng-back-btn" style={{ marginBottom:16 }} onClick={() => navigate(-1)}>
                <ArrowLeft size={16}/> Back
            </button>

            <div className="eng-detail-grid">
                <div className="eng-detail-main">
                    <PEReviewPortal 
                        task={task} 
                        user={user} 
                        reviewNote={reviewNote} 
                        setReviewNote={setReviewNote} 
                        reviewImages={reviewImages}
                        uploadImage={uploadImage}
                        removeImage={removeImage}
                        uploadingReviewFile={uploadingReviewFile}
                        statusSaving={statusSaving} 
                        handlePEReviewAction={handlePEReviewAction} 
                    />
                    
                    <TaskMainContent 
                        task={task} user={user} isMine={isMine} isOverdue={isOverdue}
                        pr={pr} st={st} currentPipelineStage={currentPipelineStage}
                        statusSaving={statusSaving} handleStatusChange={handleStatusChange}
                        showNote={showNote} setShowNote={setShowNote} note={note} setNote={setNote}
                        setShowSubtaskModal={setShowSubtaskModal}
                        comment={comment} setComment={setComment} handleComment={handleComment} saving={saving}
                    />
                </div>

                <TaskSidebar 
                    task={task} user={user} supervisors={supervisors} siteTeam={siteTeam} 
                    saving={saving} handleReassignTask={handleReassignTask} 
                />
            </div>

            {/* Create Subtask Modal */}
            <CreateSubtaskModal 
                showSubtaskModal={showSubtaskModal} setShowSubtaskModal={setShowSubtaskModal}
                handleCreateSubtask={handleCreateSubtask} selectedTask={{ title: task.title, _id: task._id }}
                subtask={subform} setSubtask={setSubform}
                user={user} siteTeam={siteTeam} supervisors={supervisors} saving={subtaskSaving}
            />
        </div>
    );
};

export default TaskDetail;
