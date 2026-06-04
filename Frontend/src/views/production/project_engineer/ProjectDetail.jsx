import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FolderOpen, ArrowLeft, Info, ClipboardList, Activity } from 'lucide-react';
import { useProjectDetail } from './hooks/useProjectDetail';
import ProjectOverviewTab from './components/ProjectDetail/ProjectOverviewTab';
import ProjectTasksTab from './components/ProjectDetail/ProjectTasksTab';
import ProjectActivityTab from './components/ProjectDetail/ProjectActivityTab';
import CreateTaskModal from './components/ProjectDetail/CreateTaskModal';
import CreateSubtaskModal from './components/ProjectDetail/CreateSubtaskModal';
import StaffReplacementModal from './components/ProjectDetail/StaffReplacementModal';
import './Engineer.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const ProjectDetail = ({}) => {
    const user = useAppSelector(selectUser);
    const { id } = useParams();
    const navigate = useNavigate();
    const basePath = user?.role === 'Project Engineer' ? '/engineer' : '/site';

    const {
        project, tasks, activity, siteTeam, supervisors,
        tab, setTab, loading, toast, showToast,
        showSubtaskModal, setShowSubtaskModal,
        showTaskModal, setShowTaskModal,
        selectedTask, setSelectedTask,
        subtask, setSubtask,
        newTask, setNewTask,
        showReplaceModal, setShowReplaceModal,
        replaceData, setReplaceData,
        saving,
        handleCreateSubtask, handleCreateTask, handleReplaceRequest, handleAssignTask,
        myTasks
    } = useProjectDetail(id);

    if (loading) return <div className="eng-dashboard"><div className="eng-loading">Loading project…</div></div>;
    if (!project) return <div className="eng-dashboard"><div className="eng-empty"><p>Project not found</p></div></div>;

    return (
        <div className="eng-tasks-page">
            {toast && <div className="eng-toast" style={{ background: toast.type==='success'?'#10b981':'#ef4444' }}>{toast.msg}</div>}

            {/* Back + Identity Banner */}
            <div className="eng-page-header">
                <div>
                    <button className="eng-back-btn" onClick={() => navigate(`${basePath}/projects`)}>
                        <ArrowLeft size={16}/> Back to Projects
                    </button>
                    
                    <div className="eng-project-banner-card">
                        <div className="eng-banner-icon-box">
                            <FolderOpen size={28}/>
                        </div>
                        <div className="eng-banner-text-details">
                            <h1 className="eng-banner-title">{project.projectName}</h1>
                            <div className="eng-banner-meta-row">
                                <span className="eng-banner-meta-pill">
                                    <strong>PM:</strong> {project.projectManager?.fullName || '—'}
                                </span>
                                <span className={`eng-banner-status-badge status-${(project.status || 'Active').toLowerCase().replace(' ', '-')}`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Segmented Control */}
            <div className="eng-tabs-container">
                <div className="eng-tabs-segmented">
                    {[['overview','Overview',<Info size={16} key="info"/>],['tasks','Tasks',<ClipboardList size={16} key="tasks"/>],['activity','Activity',<Activity size={16} key="act"/>]].map(([key,label,icon])=>(
                        <button key={key} className={`eng-tab-pill${tab===key?' active':''}`} onClick={()=>setTab(key)}>
                            {icon}
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs Content */}
            {tab === 'overview' && (
                <ProjectOverviewTab 
                    project={project} 
                    allTasks={tasks} 
                    myTasks={myTasks} 
                    user={user} 
                    setReplaceData={setReplaceData} 
                    setShowReplaceModal={setShowReplaceModal} 
                />
            )}
            
            {tab === 'tasks' && (
                <ProjectTasksTab 
                    tasks={tasks} 
                    user={user} 
                    setNewTask={setNewTask} 
                    setShowTaskModal={setShowTaskModal} 
                    setSelectedTask={setSelectedTask} 
                    setShowSubtaskModal={setShowSubtaskModal} 
                    siteTeam={siteTeam} 
                    supervisors={supervisors} 
                    handleAssignTask={handleAssignTask}
                />
            )}
            
            {tab === 'activity' && (
                <ProjectActivityTab activity={activity} />
            )}

            {/* Modals */}
            <CreateTaskModal 
                showTaskModal={showTaskModal} setShowTaskModal={setShowTaskModal}
                handleCreateTask={handleCreateTask}
                newTask={newTask} setNewTask={setNewTask}
                user={user} siteTeam={siteTeam} supervisors={supervisors} saving={saving}
            />

            <CreateSubtaskModal 
                showSubtaskModal={showSubtaskModal} setShowSubtaskModal={setShowSubtaskModal}
                handleCreateSubtask={handleCreateSubtask} selectedTask={selectedTask}
                subtask={subtask} setSubtask={setSubtask}
                user={user} siteTeam={siteTeam} supervisors={supervisors} saving={saving}
            />

            <StaffReplacementModal 
                showReplaceModal={showReplaceModal} setShowReplaceModal={setShowReplaceModal}
                handleReplaceRequest={handleReplaceRequest}
                replaceData={replaceData} setReplaceData={setReplaceData} saving={saving}
            />
        </div>
    );
};

export default ProjectDetail;
