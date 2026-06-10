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
        <div className="tasks-board-view fade-in" style={{ padding: '0.5rem 0' }}>
            <div className="premium-tasks-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
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
                    <div className="premium-empty-state" style={{
                        gridColumn: '1 / -1',
                        background: 'white',
                        padding: '4rem 2rem',
                        borderRadius: '24px',
                        border: '2px dashed #e2e8f0',
                        textAlign: 'center',
                        color: '#64748b'
                    }}>
                        <div className="premium-empty-icon" style={{
                            width: '72px',
                            height: '72px',
                            background: '#f0fdf4',
                            color: '#10b981',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <CheckCircle size={36} />
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>You're All Caught Up!</h3>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748b' }}>No active tasks assigned to you right now. Take a break or check back later.</p>
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

