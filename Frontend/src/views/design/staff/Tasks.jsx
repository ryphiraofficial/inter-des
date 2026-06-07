import React from 'react';
import { Target, CheckCircle } from 'lucide-react';
import '../css/StaffDashboard.css';
import { useStaffTasks } from './hooks/useStaffTasks';
import TaskCard from './components/TaskCard';
import DailyUpdateModal from './components/DailyUpdateModal';
import CommentModal from './components/CommentModal';

const Tasks = ({
    myTasks,
    onUpdateTaskStatus,
    getPriorityColor,
    onOpenUpload,
    user
}) => {
    const {
        showCommentModal,
        showDailyUpdateModal,
        setShowDailyUpdateModal,
        selectedTask,
        setSelectedTask,
        commentText,
        setCommentText,
        dailyUpdateData,
        setDailyUpdateData,
        comments,
        loadingComments,
        submittingComment,
        submittingUpdate,
        handleOpenComments,
        handleCloseComments,
        handleSubmitComment,
        handleSubmitDailyUpdate
    } = useStaffTasks();

    return (
        <div className="tasks-board-view fade-in">


            <div className="premium-tasks-grid">
                {myTasks.length > 0 ? myTasks.map(task => (
                    <TaskCard 
                        key={task._id} 
                        task={task} 
                        user={user}
                        getPriorityColor={getPriorityColor}
                        onUpdateTaskStatus={onUpdateTaskStatus}
                        onOpenUpload={onOpenUpload}
                        setSelectedTask={setSelectedTask}
                        setShowDailyUpdateModal={setShowDailyUpdateModal}
                        handleOpenComments={handleOpenComments}
                    />
                )) : (
                    <div className="premium-empty-state">
                        <div className="premium-empty-icon">
                            <CheckCircle size={40} />
                        </div>
                        <h3>You're All Caught Up!</h3>
                        <p>No active tasks assigned to you right now. Take a break or check back later.</p>
                    </div>
                )}
            </div>

            {/* Daily Update Modal */}
            {showDailyUpdateModal && (
                <DailyUpdateModal
                    selectedTask={selectedTask}
                    setShowDailyUpdateModal={setShowDailyUpdateModal}
                    dailyUpdateData={dailyUpdateData}
                    setDailyUpdateData={setDailyUpdateData}
                    handleSubmitDailyUpdate={handleSubmitDailyUpdate}
                    submittingUpdate={submittingUpdate}
                />
            )}

            {/* Comment Modal */}
            {showCommentModal && (
                <CommentModal
                    selectedTask={selectedTask}
                    handleCloseComments={handleCloseComments}
                    loadingComments={loadingComments}
                    comments={comments}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    handleSubmitComment={handleSubmitComment}
                    submittingComment={submittingComment}
                />
            )}
        </div>
    );
};

export default Tasks;

