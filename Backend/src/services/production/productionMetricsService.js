import ProductionProject from '../../models/production/ProductionProject.js';
import ProductionTask from '../../models/production/ProductionTask.js';
import ProductionActivityLog from '../../models/production/ProductionActivityLog.js';
import ApprovalRequest from '../../models/shared/Approval.js';
import LeaveRequest from '../../models/admin/LeaveRequest.js';

export const getDashboardOverview = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query = { projectManager: reqData.user.id };
        const projects = await ProductionProject.find(query);
        const projectIds = projects.map(p => p._id);
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } });
        const pendingApprovals = tasks.filter(t => t.status === 'Pending').length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const activeProjects = projects.filter(p => p.status === 'Active').length;
        const recentActivity = await ProductionActivityLog.find({ projectId: { $in: projectIds } }).populate('userId', 'fullName').sort({ timestamp: -1 }).limit(10);
        return { status: 200, success: true, data: { totalProjects: projects.length, activeProjects, pendingApprovals, completedTasks, projects, recentActivity } };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getUpcomingDeadlines = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query = { projectManager: reqData.user.id };
        const projects = await ProductionProject.find(query);
        const tasks = await ProductionTask.find({ projectId: { $in: projects.map(p => p._id) }, status: { $nin: ['Completed', 'Approved'] }, dueDate: { $exists: true, $ne: null } }).populate('projectId', 'projectName').sort({ dueDate: 1 }).limit(5);
        const deadlines = tasks.map(t => {
            const today = new Date(); today.setHours(0,0,0,0);
            const due = new Date(t.dueDate); due.setHours(0,0,0,0);
            const diffTime = due - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let priority = 'low';
            if (daysLeft < 0 || daysLeft <= 3) priority = 'urgent'; else if (daysLeft <= 7) priority = 'high'; else if (daysLeft <= 14) priority = 'medium';
            return { id: t._id, task: t.title, project: t.projectId ? t.projectId.projectName : 'Unknown', daysLeft, priority };
        });
        return { status: 200, success: true, data: deadlines };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getPendingApprovals = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query = { projectManager: reqData.user.id };
        const projects = await ProductionProject.find(query);
        const tasks = await ProductionTask.find({ projectId: { $in: projects.map(p => p._id) }, status: 'Pending' }).populate('projectId', 'projectName').populate('assignedTo', 'fullName').sort({ updatedAt: -1 });
        return { status: 200, success: true, data: tasks };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProjectActivity = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const project = await ProductionProject.findById(reqData.params.id);
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        const ids = [project.projectManager, project.projectEngineer, project.siteEngineer, project.siteSupervisor].map(i => i?.toString());
        if (!ids.includes(uid) && reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') return { status: 403, success: false, message: 'Access denied' };
        const logs = await ProductionActivityLog.find({ projectId: project._id }).populate('userId', 'fullName role').sort({ timestamp: -1 }).limit(50);
        return { status: 200, success: true, data: logs };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getDashboardCharts = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ projectManager: reqData.user.id });
        const tasks = await ProductionTask.find({ projectId: { $in: projects.map(p => p._id) } });
        const tasksByStatus = { Pending: 0, 'In Progress': 0, Completed: 0, Approved: 0 };
        tasks.forEach(t => { tasksByStatus[t.status] = (tasksByStatus[t.status] || 0) + 1; });
        const tasksByPriority = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
        tasks.forEach(t => { tasksByPriority[t.priority] = (tasksByPriority[t.priority] || 0) + 1; });
        const projectsByStatus = { Planning: 0, Active: 0, 'On Hold': 0, Completed: 0 };
        projects.forEach(p => { projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1; });
        const tasksByStage = { PM: 0, PE: 0, SE: 0, SS: 0 };
        tasks.forEach(t => { tasksByStage[t.stage] = (tasksByStage[t.stage] || 0) + 1; });
        
        const weeklyTrend = [];
        for (let i = 7; i >= 0; i--) {
            const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - (i * 7)); weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 7);
            const completed = tasks.filter(t => t.status === 'Completed' && new Date(t.updatedAt) >= weekStart && new Date(t.updatedAt) < weekEnd).length;
            const created = tasks.filter(t => new Date(t.createdAt) >= weekStart && new Date(t.createdAt) < weekEnd).length;
            weeklyTrend.push({ week: `W${8 - i}`, label: weekStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), completed, created });
        }
        const projectProgress = projects.map(p => ({ name: p.projectName, progress: p.progress || 0, status: p.status, budget: p.budget || 0, spent: p.spent || 0 }));
        return { status: 200, success: true, data: { tasksByStatus, tasksByPriority, projectsByStatus, tasksByStage, weeklyTrend, projectProgress, totalTasks: tasks.length, totalProjects: projects.length } };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getKPIMetrics = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ projectManager: reqData.user.id });
        const tasks = await ProductionTask.find({ projectId: { $in: projects.map(p => p._id) } });
        const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Approved').length;
        const tasksWithDueDate = tasks.filter(t => t.dueDate && ['Completed', 'Approved'].includes(t.status));
        const onTimeTasks = tasksWithDueDate.filter(t => new Date(t.updatedAt) <= new Date(t.dueDate));
        
        const avgProgress = projects.length ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0;
        const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
        const onTimeRate = tasksWithDueDate.length ? Math.round((onTimeTasks.length / tasksWithDueDate.length) * 100) : 100;
        
        const riskDistribution = { Low: 0, Medium: 0, High: 0, Critical: 0 };
        projects.forEach(p => { riskDistribution[p.riskLevel || 'Low']++; });
        
        const assignees = new Set(tasks.filter(t => t.assignedTo).map(t => t.assignedTo.toString()));
        const activeAssignees = new Set(tasks.filter(t => t.assignedTo && t.status === 'In Progress').map(t => t.assignedTo.toString()));
        
        let totalMilestones = 0, completedMilestones = 0;
        projects.forEach(p => { if (p.milestones) { totalMilestones += p.milestones.length; completedMilestones += p.milestones.filter(m => m.completed).length; } });
        
        return { status: 200, success: true, data: {
            onTimeRate, completionRate, avgProgress, totalTasks: tasks.length, completedTasks,
            overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !['Completed', 'Approved'].includes(t.status)).length,
            inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
            riskDistribution, workforce: { total: assignees.size, active: activeAssignees.size, utilization: assignees.size ? Math.round((activeAssignees.size / assignees.size) * 100) : 0 },
            milestones: { total: totalMilestones, completed: completedMilestones, rate: totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0 }
        }};
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProductionReports = async (reqData) => {
    try {
        const totalProjects = await ProductionProject.countDocuments();
        const activeProjects = await ProductionProject.countDocuments({ status: { $in: ['Not Started', 'In Progress', 'Delayed', 'Active', 'ACTIVE', 'ON HOLD', 'On Hold'] } });
        const completedProjects = await ProductionProject.countDocuments({ status: { $in: ['Completed', 'COMPLETED'] } });
        const delayedProjects = await ProductionProject.countDocuments({ status: { $in: ['Delayed', 'DELAYED'] } });
        
        const totalTasks = await ProductionTask.countDocuments();
        const completedTasks = await ProductionTask.countDocuments({ status: { $in: ['Completed', 'Approved'] } });
        const pendingTasks = await ProductionTask.countDocuments({ status: { $in: ['To Do', 'In Progress'] } });
        const overdueTasks = await ProductionTask.countDocuments({ status: { $nin: ['Completed', 'Approved'] }, dueDate: { $lt: new Date() } });
        
        const totalMaterials = await ApprovalRequest.countDocuments({ requestType: 'Material' });
        const pendingMaterials = await ApprovalRequest.countDocuments({ requestType: 'Material', status: 'pending' });
        const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });
        
        const tasksByProjectRaw = await ProductionTask.aggregate([{ $group: { _id: '$projectId', total: { $sum: 1 }, completed: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'Approved']] }, 1, 0] } } } }]);
        const projectsData = await ProductionProject.find({ _id: { $in: tasksByProjectRaw.map(t => t._id) } }).select('projectName status');
        
        const projectBreakdown = tasksByProjectRaw.map(t => {
            const proj = projectsData.find(p => p._id.toString() === t._id.toString());
            return { projectName: proj ? proj.projectName : 'Unknown', status: proj ? proj.status : 'Unknown', totalTasks: t.total, completedTasks: t.completed, completionRate: t.total > 0 ? Math.round((t.completed / t.total) * 100) : 0 };
        });
        
        return { status: 200, success: true, data: {
            projects: { total: totalProjects, active: activeProjects, completed: completedProjects, delayed: delayedProjects },
            tasks: { total: totalTasks, completed: completedTasks, pending: pendingTasks, overdue: overdueTasks },
            materials: { total: totalMaterials, pending: pendingMaterials }, leaves: { pending: pendingLeaves }, projectBreakdown
        }};
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
