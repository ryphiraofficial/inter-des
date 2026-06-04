import ProductionProject from '../../models/production/ProductionProject.js';
import ProductionTask from '../../models/production/ProductionTask.js';

export const getEngineerDashboard = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

        const projects = await ProductionProject.find({ $or: [{ projectEngineer: uid }, { siteEngineer: uid }, { siteSupervisor: uid }] })
            .populate('projectManager', 'fullName').populate('projectEngineer', 'fullName').populate('siteEngineer', 'fullName').populate('siteSupervisor', 'fullName').sort({ createdAt: -1 });

        const myProjects = projects.map(p => {
            let myRole = 'Team Member';
            if (p.projectEngineer?._id?.toString() === uid) myRole = 'Project Engineer';
            else if (p.siteEngineer?._id?.toString() === uid) myRole = 'Site Engineer';
            else if (p.siteSupervisor?._id?.toString() === uid) myRole = 'Site Supervisor';
            return { ...p.toObject(), myRole };
        });

        const tasks = await ProductionTask.find({ assignedTo: uid }).populate('projectId', 'projectName').populate('assignedBy', 'fullName').sort({ createdAt: -1 });
        const pending = tasks.filter(t => ['Pending', 'PENDING', 'To Do', 'TO DO'].includes(t.status)).length;
        const inProgress = tasks.filter(t => ['In Progress', 'IN PROGRESS', 'ACTIVE'].includes(t.status)).length;
        const completed = tasks.filter(t => ['Completed', 'COMPLETED', 'Approved', 'APPROVED'].includes(t.status)).length;
        const approved = tasks.filter(t => ['Approved', 'APPROVED'].includes(t.status)).length;
        const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && !['Completed','Approved','COMPLETED','APPROVED'].includes(t.status));
        const dueToday = tasks.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow);
        const highPriority = tasks.filter(t => ['High','Urgent','HIGH','URGENT'].includes(t.priority) && !['Completed','Approved','COMPLETED','APPROVED'].includes(t.status));

        return { status: 200, success: true, data: {
            stats: { total: tasks.length, pending, inProgress, completed, approved },
            projects: myProjects, overdue, dueToday, highPriority, recentTasks: tasks.slice(0, 5)
        }};
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getEngineerTasks = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const { status, priority, stage, projectId, transferred } = reqData.query;
        const query = {};

        if (reqData.query.awaitingApproval === 'true') {
            query.status = 'Completed';
            const roleStageMap = { 'Project Engineer': 'PE', 'Site Engineer': 'SE', 'Site Supervisor': 'SS' };
            if (roleStageMap[reqData.user.role]) query.stage = roleStageMap[reqData.user.role];
            const projects = await ProductionProject.find({ $or: [{ projectEngineer: uid }, { siteEngineer: uid }, { siteSupervisor: uid }] });
            query.projectId = { $in: projects.map(p => p._id) };
        } else if (transferred === 'true') {
            query.assignedBy = uid; query.assignedTo = { $ne: uid };
        } else {
            query.assignedTo = uid;
        }

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (stage) query.stage = stage;
        if (projectId) query.projectId = projectId;

        const tasks = await ProductionTask.find(query)
            .populate('projectId', 'projectName').populate('assignedBy', 'fullName role').populate('assignedTo', 'fullName').sort({ createdAt: -1 });
        return { status: 200, success: true, data: tasks };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getBudgetAnalytics = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ projectManager: reqData.user.id });
        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
        const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
        const totalEstimated = projects.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);

        const projectBudgets = projects.map(p => ({
            id: p._id, name: p.projectName, status: p.status, budget: p.budget || 0, spent: p.spent || 0,
            estimated: p.estimatedCost || 0, utilization: p.budget ? Math.round((p.spent / p.budget) * 100) : 0,
            variance: (p.budget || 0) - (p.spent || 0), riskLevel: p.riskLevel || 'Low'
        }));

        const budgetByStatus = {};
        projects.forEach(p => {
            if (!budgetByStatus[p.status]) budgetByStatus[p.status] = { budget: 0, spent: 0 };
            budgetByStatus[p.status].budget += p.budget || 0;
            budgetByStatus[p.status].spent += p.spent || 0;
        });

        return { status: 200, success: true, data: { totalBudget, totalSpent, totalEstimated, utilization: totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0, variance: totalBudget - totalSpent, projectBudgets, budgetByStatus } };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getBudgetOverview = async (reqData) => {
    try {
        const budgetData = {
            total: 13550000, spent: 9214000,
            categories: [
                { name: 'Materials', amount: 4200000, color: '#3b82f6' }, { name: 'Labour', amount: 2800000, color: '#8b5cf6' },
                { name: 'Equipment', amount: 1200000, color: '#f59e0b' }, { name: 'Overheads', amount: 1014000, color: '#10b981' }
            ]
        };
        return { status: 200, success: true, data: budgetData };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getGanttData = async (reqData) => {
    try {
        const { projectId } = reqData.params;
        let query = {};
        if (projectId && projectId !== 'all') query.projectId = projectId;
        else {
            const projects = await ProductionProject.find({ projectManager: reqData.user.id });
            query.projectId = { $in: projects.map(p => p._id) };
        }

        const tasks = await ProductionTask.find(query).populate('assignedTo', 'fullName').populate('projectId', 'projectName startDate endDate').sort({ createdAt: 1 });
        const ganttItems = tasks.map(t => ({
            id: t._id, title: t.title, project: t.projectId?.projectName || '—', projectId: t.projectId?._id,
            assignee: t.assignedTo?.fullName || 'Unassigned', start: t.startDate || t.createdAt, end: t.dueDate || new Date(new Date(t.startDate || t.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000),
            status: t.status, priority: t.priority, stage: t.stage, progress: t.progress || 0
        }));

        return { status: 200, success: true, data: ganttItems };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
