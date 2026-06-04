import ProductionProject from '../../models/production/ProductionProject.js';
import ProductionTask from '../../models/production/ProductionTask.js';

export const getProjects = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query.projectManager = reqData.user.id;
        const { status, search } = reqData.query;
        if (status && status !== 'All Statuses') query.status = status;
        let projects = await ProductionProject.find(query)
            .populate('clientId', 'name').populate('projectEngineer', 'fullName')
            .populate('projectManager', 'fullName').populate('siteEngineer', 'fullName').sort({ createdAt: -1 });
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            projects = projects.filter(p => searchRegex.test(p.projectName) || (p.clientId && searchRegex.test(p.clientId.name)));
        }
        return { status: 200, success: true, data: projects };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProjectById = async (reqData) => {
    try {
        const project = await ProductionProject.findById(reqData.params.id)
            .populate('clientId', 'name email phone').populate('projectManager', 'fullName email')
            .populate('projectEngineer', 'fullName email').populate('siteEngineer', 'fullName email')
            .populate('siteSupervisor', 'fullName email');
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        return { status: 200, success: true, data: project };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getHandoffProjects = async (reqData) => {
    try {
        let query = { status: 'Planning' };
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query.projectManager = reqData.user.id;
        const projects = await ProductionProject.find(query)
            .populate('clientId', 'name email phone').populate('projectManager', 'fullName email')
            .populate('sourceProject', 'name stage').sort({ createdAt: -1 });
        return { status: 200, success: true, data: projects };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getTasksByProject = async (reqData) => {
    try {
        const tasks = await ProductionTask.find({ projectId: reqData.params.id })
            .populate('assignedTo', 'fullName').populate('assignedBy', 'fullName').sort({ priority: -1, createdAt: -1 });
        return { status: 200, success: true, data: tasks };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getAllTasks = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query.projectManager = reqData.user.id;
        const projects = await ProductionProject.find(query);
        const projectIds = projects.map(p => p._id);
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } })
            .populate('projectId', 'projectName').populate('assignedTo', 'fullName').sort({ priority: -1, createdAt: -1 });
        return { status: 200, success: true, data: tasks };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getMyProjects = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const projects = await ProductionProject.find({ $or: [{ projectEngineer: uid }, { siteEngineer: uid }, { siteSupervisor: uid }] })
            .populate('clientId', 'name').populate('projectManager', 'fullName email').populate('projectEngineer', 'fullName')
            .populate('siteEngineer', 'fullName').populate('siteSupervisor', 'fullName').sort({ createdAt: -1 });
        const projectIds = projects.map(p => p._id);
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } });
        const taskCountMap = {};
        tasks.forEach(t => { const pid = t.projectId.toString(); taskCountMap[pid] = (taskCountMap[pid] || 0) + 1; });
        const result = projects.map(p => ({ ...p.toObject(), taskCount: taskCountMap[p._id.toString()] || 0 }));
        return { status: 200, success: true, data: result };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getCompletedProductionProjects = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ status: 'Completed' })
            .populate('projectManager', 'fullName email').populate('sourceProject', 'name projectNumber client').sort({ updatedAt: -1 });
        return { status: 200, success: true, data: projects };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getTaskById = async (reqData) => {
    try {
        const task = await ProductionTask.findById(reqData.params.taskId)
            .populate('projectId',  'projectName status progress startDate endDate')
            .populate('assignedBy', 'fullName role')
            .populate('assignedTo', 'fullName role')
            .populate('parentTask', 'title status')
            .populate('comments.postedBy', 'fullName role')
            .populate('updates.updatedBy', 'fullName');

        if (!task) return { status: 404, success: false, message: 'Task not found' };

        const subtasks = await ProductionTask.find({ parentTask: task._id })
            .populate('assignedTo', 'fullName role');

        return { status: 200, success: true, data: { ...task.toObject(), subtasks } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

export const getUnlockRequests = async (reqData) => {
    try {
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied.' };
        }
        const requests = await ProductionProject.find({ 'unlockRequest.requested': true })
            .populate('projectManager', 'fullName')
            .populate('unlockRequest.requestedBy', 'fullName role email')
            .sort({ 'unlockRequest.requestedAt': -1 });
        return { status: 200, success: true, data: requests };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
