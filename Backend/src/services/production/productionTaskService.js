import User from '../../models/admin/User.js';
import ProductionProject from '../../models/production/ProductionProject.js';
import ProductionTask from '../../models/production/ProductionTask.js';
import ProductionActivityLog from '../../models/production/ProductionActivityLog.js';

const logActivity = async (projectId, userId, action, message) => {
    await ProductionActivityLog.create({ projectId, userId, action, message });
};

// Guard: block all writes on Admin Approved projects
const assertProjectNotLocked = async (projectId) => {
    if (!projectId) return null;
    const project = await ProductionProject.findById(projectId).select('status');
    if (project?.status === 'Admin Approved') {
        return { status: 403, success: false, message: 'This project has been approved and locked by Admin. No further changes are allowed.' };
    }
    return null;
};

export const createTask = async (reqData) => {
    try {
        const { title, description, projectId, assignedTo, priority, dueDate } = reqData.body;
        const locked = await assertProjectNotLocked(projectId);
        if (locked) return locked;
        let stage = reqData.body.stage || 'PE';
        if (assignedTo) {
            const assignee = await User.findById(assignedTo);
            const stageMap = { 'Project Engineer': 'PE', 'Site Engineer': 'SE', 'Site Supervisor': 'SS', 'Project Manager': 'PM' };
            if (assignee && stageMap[assignee.role]) stage = stageMap[assignee.role];
        }
        const task = await ProductionTask.create({
            title, description, projectId, assignedBy: reqData.user.id, assignedTo, stage, priority, dueDate,
            assignmentHistory: [{ assignedTo, assignedBy: reqData.user.id, stage }]
        });
        await logActivity(projectId, reqData.user.id, 'CREATE_TASK', `Task "${title}" created for stage ${stage}.`);
        return { status: 201, success: true, data: task };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};


export const assignTask = async (reqData) => {
    try {
        const { assignedTo } = reqData.body;
        // Fetch the task first to get projectId for the lock check
        const existingTask = await ProductionTask.findById(reqData.params.taskId).select('projectId');
        if (existingTask) {
            const locked = await assertProjectNotLocked(existingTask.projectId);
            if (locked) return locked;
        }
        let stage;
        if (assignedTo) {
            const assignee = await User.findById(assignedTo);
            const stageMap = { 'Project Engineer': 'PE', 'Site Engineer': 'SE', 'Site Supervisor': 'SS', 'Project Manager': 'PM' };
            stage = stageMap[assignee?.role] || undefined;
        }
        const updateFields = { assignedTo, assignedBy: reqData.user.id };
        if (stage) updateFields.stage = stage;
        
        const task = await ProductionTask.findByIdAndUpdate(
            reqData.params.taskId, 
            {
                $set: updateFields,
                $push: { assignmentHistory: { assignedTo, assignedBy: reqData.user.id, stage: stage || existingTask.stage } }
            }, 
            { new: true }
        );
        await logActivity(task.projectId, reqData.user.id, 'ASSIGN_TASK', `Task "${task.title}" reassigned.`);
        return { status: 200, success: true, data: task };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const updateTaskStatus = async (reqData) => {
    try {
        const { status, note, images } = reqData.body;
        const task = await ProductionTask.findById(reqData.params.taskId);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        const locked = await assertProjectNotLocked(task.projectId);
        if (locked) return locked;
        
        const oldStatus = task.status;
        const oldStage = task.stage;
        task.status = status;
        
        if (status === 'Completed') {
            let nextAssignee = null;
            if (task.assignedTo?.toString() === reqData.user.id && task.assignmentHistory && task.assignmentHistory.length > 0) {
                let lastIndex = -1;
                for (let i = task.assignmentHistory.length - 1; i >= 0; i--) {
                    if (task.assignmentHistory[i].assignedTo?.toString() === reqData.user.id) {
                        lastIndex = i;
                        break;
                    }
                }
                if (lastIndex > -1) {
                    const lastAssignment = task.assignmentHistory[lastIndex];
                    if (lastAssignment.assignedBy) {
                        nextAssignee = await User.findById(lastAssignment.assignedBy);
                        task.assignmentHistory.splice(lastIndex, 1);
                    }
                }
            }
            if (!nextAssignee && task.assignedTo?.toString() === reqData.user.id) {
                const project = await ProductionProject.findById(task.projectId);
                if (task.stage === 'SS' && project?.siteEngineer) nextAssignee = await User.findById(project.siteEngineer);
                else if (task.stage === 'SE' && project?.projectEngineer) nextAssignee = await User.findById(project.projectEngineer);
                else if (task.stage === 'PE' && project?.projectManager) nextAssignee = await User.findById(project.projectManager);
            }
            if (nextAssignee) {
                const stageMap = { 'Project Engineer': 'PE', 'Site Engineer': 'SE', 'Site Supervisor': 'SS', 'Project Manager': 'PM' };
                task.stage = stageMap[nextAssignee.role] || task.stage;
                task.assignedTo = nextAssignee._id;
                task.assignedBy = reqData.user.id;
            }
        } else if (status === 'In Progress' && oldStatus === 'Completed') {
            let nextAssignee = null;
            if (task.assignedTo?.toString() === reqData.user.id && task.assignedBy) {
                nextAssignee = await User.findById(task.assignedBy);
            }
            if (!nextAssignee && task.assignedTo?.toString() === reqData.user.id) {
                const project = await ProductionProject.findById(task.projectId);
                if (task.stage === 'SE' && project?.siteSupervisor) nextAssignee = await User.findById(project.siteSupervisor);
                else if (task.stage === 'PE' && project?.siteEngineer) nextAssignee = await User.findById(project.siteEngineer);
                else if (task.stage === 'PM' && project?.projectEngineer) nextAssignee = await User.findById(project.projectEngineer);
            }
            if (nextAssignee) {
                const stageMap = { 'Project Engineer': 'PE', 'Site Engineer': 'SE', 'Site Supervisor': 'SS', 'Project Manager': 'PM' };
                task.stage = stageMap[nextAssignee.role] || task.stage;
                task.assignedTo = nextAssignee._id;
                task.assignedBy = reqData.user.id;
                task.assignmentHistory.push({ assignedTo: nextAssignee._id, assignedBy: reqData.user.id, stage: task.stage });
            }
        }
        
        if (note || images) {
            const existingIndex = task.updates.findIndex(u => u.updatedBy?.toString() === reqData.user.id && !u.note?.includes('Approved by') && !u.note?.includes('Rejected by') && status === 'Completed' && oldStatus === 'Completed');
            if (existingIndex > -1) {
                task.updates[existingIndex].note = note || task.updates[existingIndex].note;
                task.updates[existingIndex].images = images || [];
                task.updates[existingIndex].timestamp = Date.now();
            } else {
                task.updates.push({ note: note || `Stage transition from ${oldStage} to ${task.stage}`, images: images || [], updatedBy: reqData.user.id });
            }
        }
        
        await task.save();
        await logActivity(task.projectId, reqData.user.id, 'UPDATE_TASK', `Task "${task.title}" status changed to ${status} (Stage: ${oldStage} -> ${task.stage}).`);
        return { status: 200, success: true, data: task };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const approveTask = async (reqData) => {
    try {
        const task = await ProductionTask.findById(reqData.params.taskId);
        task.status = 'Approved';
        await task.save();
        await logActivity(task.projectId, reqData.user.id, 'APPROVE_TASK', `Task "${task.title}" approved by PM.`);
        return { status: 200, success: true, data: task };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const addComment = async (reqData) => {
    try {
        const { text } = reqData.body;
        if (!text) return { status: 400, success: false, message: 'Comment text is required' };
        const task = await ProductionTask.findById(reqData.params.taskId);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        task.comments.push({ text, postedBy: reqData.user.id });
        await task.save();
        await logActivity(task.projectId, reqData.user.id, 'ADD_COMMENT', `Comment added to task "${task.title}".`);
        const updated = await ProductionTask.findById(task._id).populate('comments.postedBy', 'fullName role');
        return { status: 200, success: true, data: updated.comments };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const createSubtask = async (reqData) => {
    try {
        const { title, description, projectId, assignedTo, priority, dueDate, parentTaskId } = reqData.body;
        if (!parentTaskId) return { status: 400, success: false, message: 'parentTaskId is required' };
        const parentTask = await ProductionTask.findById(parentTaskId);
        if (!parentTask) return { status: 404, success: false, message: 'Parent task not found' };
        const locked = await assertProjectNotLocked(projectId || parentTask.projectId);
        if (locked) return locked;
        
        const assignee = await User.findById(assignedTo);
        const stageMap = { 'Site Engineer': 'SE', 'Site Supervisor': 'SS', 'Project Engineer': 'PE' };
        const stage = stageMap[assignee?.role] || 'SE';
        
        const subtask = await ProductionTask.create({
            title, description, projectId: projectId || parentTask.projectId, assignedBy: reqData.user.id, assignedTo, stage, priority: priority || 'Medium', dueDate, parentTask: parentTaskId, isSubtask: true,
            assignmentHistory: [{ assignedTo, assignedBy: reqData.user.id, stage }]
        });
        await logActivity(subtask.projectId, reqData.user.id, 'CREATE_SUBTASK', `Subtask "${title}" created under "${parentTask.title}".`);
        return { status: 201, success: true, data: subtask };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
