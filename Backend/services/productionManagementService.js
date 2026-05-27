const ProductionProject = require('../models/ProductionProject');
const ProductionTask = require('../models/ProductionTask');
const ProductionActivityLog = require('../models/ProductionActivityLog');
const StaffReplacementRequest = require('../models/StaffReplacementRequest');

const logActivity = async (projectId, userId, action, message) => {
    await ProductionActivityLog.create({
        projectId,
        userId,
        action,
        message
    });
};


exports.createProject = async (reqData) => {
    try {
        // ONLY Admin or Super Admin can create projects
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied. Only Admins can create production projects.' };
        }

        const { projectName, clientId, description, startDate, endDate, projectManager } = reqData.body;
        
        if (!projectManager) {
            return { status: 400, success: false, message: 'A Project Manager must be assigned during creation.' };
        }

        const project = await ProductionProject.create({
            projectName,
            clientId,
            description,
            startDate,
            endDate,
            projectManager,
            createdBy: reqData.user.id
        });

        await logActivity(project._id, reqData.user.id, 'CREATE_PROJECT', `Project "${projectName}" created.`);

        return { status: 201, success: true, data: project };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getProjects = async (reqData) => {
    try {
        let query = {};
        
        // If not Admin/Super Admin, restrict to strictly projects where user is PM
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query.projectManager = reqData.user.id;
        }

        const { status, search } = reqData.query;
        if (status && status !== 'All Statuses') {
            query.status = status;
        }

        let projects = await ProductionProject.find(query)
            .populate('clientId', 'name')
            .populate('projectEngineer', 'fullName')
            .populate('projectManager', 'fullName')
            .populate('siteEngineer', 'fullName')
            .sort({ createdAt: -1 });

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            projects = projects.filter(p => 
                searchRegex.test(p.projectName) || 
                (p.clientId && searchRegex.test(p.clientId.name))
            );
        }

        return { status: 200, success: true, data: projects };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getProjectById = async (reqData) => {
    try {
        const project = await ProductionProject.findById(reqData.params.id)
            .populate('clientId', 'name email phone')
            .populate('projectManager', 'fullName email')
            .populate('projectEngineer', 'fullName email')
            .populate('siteEngineer', 'fullName email')
            .populate('siteSupervisor', 'fullName email');

        if (!project) {
            return { status: 404, success: false, message: 'Project not found' };
        }

        return { status: 200, success: true, data: project };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.updateProject = async (reqData) => {
    try {
        const project = await ProductionProject.findByIdAndUpdate(reqData.params.id, reqData.body, {
            new: true,
            runValidators: true
        });

        await logActivity(project._id, reqData.user.id, 'UPDATE_PROJECT', `Project details updated.`);

        return { status: 200, success: true, data: project };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.assignTeam = async (reqData) => {
    try {
        const { projectEngineer, siteEngineer, siteSupervisor } = reqData.body;
        
        const project = await ProductionProject.findById(reqData.params.id);
        
        if (projectEngineer) project.projectEngineer = projectEngineer;
        if (siteEngineer) project.siteEngineer = siteEngineer;
        if (siteSupervisor) project.siteSupervisor = siteSupervisor;
        
        await project.save();

        await logActivity(project._id, reqData.user.id, 'ASSIGN_TEAM', `Team assignments updated.`);

        return { status: 200, success: true, data: project };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.createTask = async (reqData) => {
    try {
        const { title, description, projectId, assignedTo, priority, dueDate } = reqData.body;

        // Auto-derive stage from assignee's role so the task always
        // lands in the correct portal (PE/SE/SS), regardless of what
        // the frontend sends.
        let stage = reqData.body.stage || 'PE';
        if (assignedTo) {
            const User = require('../models/User');
            const assignee = await User.findById(assignedTo);
            const stageMap = {
                'Project Engineer': 'PE',
                'Site Engineer':    'SE',
                'Site Supervisor':  'SS',
                'Project Manager':  'PM'
            };
            if (assignee && stageMap[assignee.role]) {
                stage = stageMap[assignee.role];
            }
        }

        const task = await ProductionTask.create({
            title,
            description,
            projectId,
            assignedBy: reqData.user.id,
            assignedTo,
            stage,
            priority,
            dueDate
        });

        await logActivity(projectId, reqData.user.id, 'CREATE_TASK', `Task "${title}" created for stage ${stage}.`);

        return { status: 201, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.assignTask = async (reqData) => {
    try {
        const { assignedTo } = reqData.body;

        // Re-derive stage from new assignee's role
        let stage;
        if (assignedTo) {
            const User = require('../models/User');
            const assignee = await User.findById(assignedTo);
            const stageMap = {
                'Project Engineer': 'PE',
                'Site Engineer':    'SE',
                'Site Supervisor':  'SS',
                'Project Manager':  'PM'
            };
            stage = stageMap[assignee?.role] || undefined;
        }

        const updateFields = { assignedTo, assignedBy: reqData.user.id };
        if (stage) updateFields.stage = stage;

        const task = await ProductionTask.findByIdAndUpdate(
            reqData.params.taskId,
            updateFields,
            { new: true }
        );

        await logActivity(task.projectId, reqData.user.id, 'ASSIGN_TASK', `Task "${task.title}" reassigned.`);

        return { status: 200, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.updateTaskStatus = async (reqData) => {
    try {
        const { status, note, images } = reqData.body;
        const task = await ProductionTask.findById(reqData.params.taskId);
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }
        
        const oldStatus = task.status;
        const oldStage = task.stage;
        
        task.status = status;
        
        // Option A Workflows: Dynamic Assignee Promoting on Task Completion
        if (status === 'Completed') {
            const project = await ProductionProject.findById(task.projectId);
            if (task.stage === 'SS') {
                // Elevate to SE (Site Engineer)
                if (project && project.siteEngineer) {
                    task.stage = 'SE';
                    task.assignedTo = project.siteEngineer;
                    task.assignedBy = reqData.user.id;
                }
            } else if (task.stage === 'SE') {
                // Elevate to PE (Project Engineer)
                if (project && project.projectEngineer) {
                    task.stage = 'PE';
                    task.assignedTo = project.projectEngineer;
                    task.assignedBy = reqData.user.id;
                }
            } else if (task.stage === 'PE') {
                // Elevate to PM (Project Manager)
                if (project && project.projectManager) {
                    task.stage = 'PM';
                    task.assignedTo = project.projectManager;
                    task.assignedBy = reqData.user.id;
                }
            }
        } else if (status === 'In Progress' && oldStatus === 'Completed') {
            // Rejection / Send Back workflow
            const project = await ProductionProject.findById(task.projectId);
            if (task.stage === 'SE') {
                // Send back to SS (Site Supervisor)
                if (project && project.siteSupervisor) {
                    task.stage = 'SS';
                    task.assignedTo = project.siteSupervisor;
                    task.assignedBy = reqData.user.id;
                }
            } else if (task.stage === 'PE') {
                // Send back to SE (Site Engineer)
                if (project && project.siteEngineer) {
                    task.stage = 'SE';
                    task.assignedTo = project.siteEngineer;
                    task.assignedBy = reqData.user.id;
                }
            } else if (task.stage === 'PM') {
                // Send back to PE (Project Engineer)
                if (project && project.projectEngineer) {
                    task.stage = 'PE';
                    task.assignedTo = project.projectEngineer;
                    task.assignedBy = reqData.user.id;
                }
            }
        }
        
        if (note || images) {
            // Support updating existing completion log rather than creating duplicate entries if status hasn't changed
            const existingIndex = task.updates.findIndex(u => 
                u.updatedBy?.toString() === reqData.user.id && 
                !u.note?.includes('Approved by') && 
                !u.note?.includes('Rejected by') &&
                status === 'Completed' &&
                oldStatus === 'Completed'
            );

            if (existingIndex > -1) {
                task.updates[existingIndex].note = note || task.updates[existingIndex].note;
                task.updates[existingIndex].images = images || [];
                task.updates[existingIndex].timestamp = Date.now();
            } else {
                task.updates.push({
                    note: note || `Stage transition from ${oldStage} to ${task.stage}`,
                    images: images || [],
                    updatedBy: reqData.user.id
                });
            }
        }
        
        await task.save();

        await logActivity(
            task.projectId, 
            reqData.user.id, 
            'UPDATE_TASK', 
            `Task "${task.title}" status changed to ${status} (Stage: ${oldStage} -> ${task.stage}).`
        );

        return { status: 200, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTasksByProject = async (reqData) => {
    try {
        const tasks = await ProductionTask.find({ projectId: reqData.params.id })
            .populate('assignedTo', 'fullName')
            .populate('assignedBy', 'fullName')
            .sort({ priority: -1, createdAt: -1 });

        return { status: 200, success: true, data: tasks };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.approveTask = async (reqData) => {
    try {
        const task = await ProductionTask.findById(reqData.params.taskId);
        task.status = 'Approved';
        await task.save();

        await logActivity(task.projectId, reqData.user.id, 'APPROVE_TASK', `Task "${task.title}" approved by PM.`);

        return { status: 200, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getDashboardOverview = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query = { projectManager: reqData.user.id };
        }

        const projects = await ProductionProject.find(query);
        const projectIds = projects.map(p => p._id);
        
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } });
        
        const pendingApprovals = tasks.filter(t => t.status === 'Pending').length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const activeProjects = projects.filter(p => p.status === 'Active').length;

        const recentActivity = await ProductionActivityLog.find({ projectId: { $in: projectIds } })
            .populate('userId', 'fullName')
            .sort({ timestamp: -1 })
            .limit(10);

        return { status: 200, success: true, data: { totalProjects: projects.length, activeProjects, pendingApprovals, completedTasks, projects, recentActivity } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getUpcomingDeadlines = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query = { projectManager: reqData.user.id };
        }
        const projects = await ProductionProject.find(query);
        const projectIds = projects.map(p => p._id);

        const tasks = await ProductionTask.find({ 
            projectId: { $in: projectIds },
            status: { $nin: ['Completed', 'Approved'] },
            dueDate: { $exists: true, $ne: null }
        })
        .populate('projectId', 'projectName')
        .sort({ dueDate: 1 })
        .limit(5);

        const deadlines = tasks.map(t => {
            const today = new Date();
            today.setHours(0,0,0,0);
            const due = new Date(t.dueDate);
            due.setHours(0,0,0,0);
            const diffTime = due - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let priority = 'low';
            if (daysLeft < 0) priority = 'urgent'; // Overdue
            else if (daysLeft <= 3) priority = 'urgent';
            else if (daysLeft <= 7) priority = 'high';
            else if (daysLeft <= 14) priority = 'medium';

            return {
                id: t._id,
                task: t.title,
                project: t.projectId ? t.projectId.projectName : 'Unknown',
                daysLeft,
                priority
            };
        });

        return { status: 200, success: true, data: deadlines };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getBudgetOverview = async (reqData) => {
    try {
        // Mocking the aggregated budget for now until financial models are fully linked
        const budgetData = {
            total: 13550000,
            spent: 9214000,
            categories: [
                { name: 'Materials', amount: 4200000, color: '#3b82f6' },
                { name: 'Labour', amount: 2800000, color: '#8b5cf6' },
                { name: 'Equipment', amount: 1200000, color: '#f59e0b' },
                { name: 'Overheads', amount: 1014000, color: '#10b981' },
            ]
        };
        return { status: 200, success: true, data: budgetData };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getPendingApprovals = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query = { projectManager: reqData.user.id };
        }

        const projects = await ProductionProject.find(query);
        const projectIds = projects.map(p => p._id);
        
        const tasks = await ProductionTask.find({ 
            projectId: { $in: projectIds },
            status: 'Pending'
        })
        .populate('projectId', 'projectName')
        .populate('assignedTo', 'fullName')
        .sort({ updatedAt: -1 });

        return { status: 200, success: true, data: tasks };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getAllTasks = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query = { projectManager: reqData.user.id };
        }

        const projects = await ProductionProject.find(query);
        const projectIds = projects.map(p => p._id);
        
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } })
            .populate('projectId', 'projectName')
            .populate('assignedTo', 'fullName')
            .sort({ priority: -1, createdAt: -1 });

        return { status: 200, success: true, data: tasks };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTeamOverview = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query = { projectManager: reqData.user.id };
        }

        const projects = await ProductionProject.find(query)
            .populate('projectEngineer', 'fullName email')
            .populate('siteEngineer', 'fullName email')
            .populate('siteSupervisor', 'fullName email');
            
        const teamMap = new Map();
        
        projects.forEach(project => {
            const roles = [
                { user: project.projectEngineer, title: 'Project Engineer' },
                { user: project.siteEngineer, title: 'Site Engineer' },
                { user: project.siteSupervisor, title: 'Site Supervisor' }
            ];
            
            roles.forEach(role => {
                if (role.user) {
                    const id = role.user._id.toString();
                    if (!teamMap.has(id)) {
                        teamMap.set(id, {
                            id: id,
                            name: role.user.fullName,
                            email: role.user.email,
                            role: role.title,
                            projects: 1
                        });
                    } else {
                        teamMap.get(id).projects += 1;
                    }
                }
            });
        });

        return { status: 200, success: true, data: Array.from(teamMap.values()) };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getMyProjects = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const projects = await ProductionProject.find({
            $or: [
                { projectEngineer: uid },
                { siteEngineer:    uid },
                { siteSupervisor:  uid }
            ]
        })
        .populate('clientId',        'name')
        .populate('projectManager',  'fullName email')
        .populate('projectEngineer', 'fullName')
        .populate('siteEngineer',    'fullName')
        .populate('siteSupervisor',  'fullName')
        .sort({ createdAt: -1 });

        // Attach task counts per project
        const projectIds = projects.map(p => p._id);
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } });

        const taskCountMap = {};
        tasks.forEach(t => {
            const pid = t.projectId.toString();
            taskCountMap[pid] = (taskCountMap[pid] || 0) + 1;
        });

        const result = projects.map(p => ({
            ...p.toObject(),
            taskCount: taskCountMap[p._id.toString()] || 0
        }));

        return { status: 200, success: true, data: result };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getEngineerDashboard = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch assigned projects (as site engineer, project engineer, or supervisor)
        const projects = await ProductionProject.find({
            $or: [
                { projectEngineer: uid },
                { siteEngineer:    uid },
                { siteSupervisor:  uid }
            ]
        })
        .populate('projectManager',  'fullName')
        .populate('projectEngineer', 'fullName')
        .populate('siteEngineer',    'fullName')
        .populate('siteSupervisor',  'fullName')
        .sort({ createdAt: -1 });

        // Determine this user's role per project
        const myProjects = projects.map(p => {
            let myRole = 'Team Member';
            if (p.projectEngineer?._id?.toString() === uid) myRole = 'Project Engineer';
            else if (p.siteEngineer?._id?.toString() === uid) myRole = 'Site Engineer';
            else if (p.siteSupervisor?._id?.toString() === uid) myRole = 'Site Supervisor';
            return { ...p.toObject(), myRole };
        });

        const tasks = await ProductionTask.find({ assignedTo: uid })
            .populate('projectId', 'projectName')
            .populate('assignedBy', 'fullName')
            .sort({ createdAt: -1 });

        const pending    = tasks.filter(t => ['Pending', 'PENDING', 'To Do', 'TO DO'].includes(t.status)).length;
        const inProgress = tasks.filter(t => ['In Progress', 'IN PROGRESS', 'ACTIVE'].includes(t.status)).length;
        const completed  = tasks.filter(t => ['Completed', 'COMPLETED', 'Approved', 'APPROVED'].includes(t.status)).length;
        const approved   = tasks.filter(t => ['Approved', 'APPROVED'].includes(t.status)).length;
        const overdue    = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && !['Completed','Approved','COMPLETED','APPROVED'].includes(t.status));
        const dueToday   = tasks.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow);
        const highPriority = tasks.filter(t => ['High','Urgent','HIGH','URGENT'].includes(t.priority) && !['Completed','Approved','COMPLETED','APPROVED'].includes(t.status));
        const recent     = tasks.slice(0, 5);

        return { status: 200, success: true, data: {
                stats: { total: tasks.length, pending, inProgress, completed, approved },
                projects: myProjects,
                overdue,
                dueToday,
                highPriority,
                recentTasks: recent
            }
        };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getEngineerTasks = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const { status, priority, stage, projectId, transferred } = reqData.query;

        const query = {};
        if (transferred === 'true') {
            query.assignedBy = uid;
            query.assignedTo = { $ne: uid };
        } else {
            query.assignedTo = uid;
        }

        if (status)    query.status   = status;
        if (priority)  query.priority = priority;
        if (stage)     query.stage    = stage;
        if (projectId) query.projectId = projectId;

        const tasks = await ProductionTask.find(query)
            .populate('projectId',  'projectName')
            .populate('assignedBy', 'fullName role')
            .populate('assignedTo', 'fullName')
            .sort({ createdAt: -1 });

        return { status: 200, success: true, data: tasks };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTaskById = async (reqData) => {
    try {
        const task = await ProductionTask.findById(reqData.params.taskId)
            .populate('projectId',  'projectName status progress startDate endDate')
            .populate('assignedBy', 'fullName role')
            .populate('assignedTo', 'fullName role')
            .populate('parentTask', 'title status')
            .populate('comments.postedBy', 'fullName role')
            .populate('updates.updatedBy', 'fullName');

        if (!task) return { status: 404, success: false, message: 'Task not found' };

        // Also fetch subtasks
        const subtasks = await ProductionTask.find({ parentTask: task._id })
            .populate('assignedTo', 'fullName role');

        return { status: 200, success: true, data: { ...task.toObject(), subtasks } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.addComment = async (reqData) => {
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
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.createSubtask = async (reqData) => {
    try {
        const { title, description, projectId, assignedTo, priority, dueDate, parentTaskId } = reqData.body;

        if (!parentTaskId) return { status: 400, success: false, message: 'parentTaskId is required' };

        const parentTask = await ProductionTask.findById(parentTaskId);
        if (!parentTask) return { status: 404, success: false, message: 'Parent task not found' };

        // Determine stage based on assigned user role
        const User = require('../models/User');
        const assignee = await User.findById(assignedTo);
        const stageMap = { 'Site Engineer': 'SE', 'Site Supervisor': 'SS', 'Project Engineer': 'PE' };
        const stage = stageMap[assignee?.role] || 'SE';

        const subtask = await ProductionTask.create({
            title,
            description,
            projectId: projectId || parentTask.projectId,
            assignedBy: reqData.user.id,
            assignedTo,
            stage,
            priority: priority || 'Medium',
            dueDate,
            parentTask: parentTaskId,
            isSubtask: true
        });

        await logActivity(subtask.projectId, reqData.user.id, 'CREATE_SUBTASK', `Subtask "${title}" created under "${parentTask.title}".`);

        return { status: 201, success: true, data: subtask };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getProjectActivity = async (reqData) => {
    try {
        const uid = reqData.user.id;
        const projectId = reqData.params.id;

        // Verify access
        const project = await ProductionProject.findById(projectId);
        if (!project) return { status: 404, success: false, message: 'Project not found' };

        const ids = [project.projectManager, project.projectEngineer, project.siteEngineer, project.siteSupervisor]
            .map(i => i?.toString());
        if (!ids.includes(uid) && reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied' };
        }

        const logs = await ProductionActivityLog.find({ projectId })
            .populate('userId', 'fullName role')
            .sort({ timestamp: -1 })
            .limit(50);

        return { status: 200, success: true, data: logs };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getSiteTeam = async (reqData) => {
    try {
        const User = require('../models/User');
        const members = await User.find({
            role: { $in: ['Site Engineer', 'Site Supervisor'] }
        }).select('fullName email role');
        return { status: 200, success: true, data: members };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getSupervisors = async (reqData) => {
    try {
        const User = require('../models/User');
        const members = await User.find({
            role: 'Site Supervisor',
            status: 'Active'
        }).select('fullName email role');
        return { status: 200, success: true, data: members };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getHandoffProjects = async (reqData) => {
    try {
        let query = { status: 'Planning' };
        
        // Non-admin users only see their own projects
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            query.projectManager = reqData.user.id;
        }

        const projects = await ProductionProject.find(query)
            .populate('clientId', 'name email phone')
            .populate('projectManager', 'fullName email')
            .populate('sourceProject', 'name stage')
            .sort({ createdAt: -1 });

        return { status: 200, success: true, data: projects };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getProductionStaff = async (reqData) => {
    try {
        const User = require('../models/User');
        const staff = await User.find({
            role: { $in: ['Project Manager', 'Project Engineer', 'Site Engineer', 'Site Supervisor'] },
            status: 'Active'
        }).select('fullName email role');

        return { status: 200, success: true, data: staff };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.acceptHandoff = async (reqData) => {
    try {
        const { projectEngineer, siteEngineer, siteSupervisor } = reqData.body;
        const project = await ProductionProject.findById(reqData.params.id);

        if (!project) {
            return { status: 404, success: false, message: 'Project not found' };
        }

        if (project.status !== 'Planning') {
            return { status: 400, success: false, message: 'Project has already been activated' };
        }

        // Assign team (any combination allowed)
        if (projectEngineer) project.projectEngineer = projectEngineer;
        if (siteEngineer) project.siteEngineer = siteEngineer;
        if (siteSupervisor) project.siteSupervisor = siteSupervisor;

        project.status = 'Active';
        await project.save();

        await logActivity(project._id, reqData.user.id, 'ACCEPT_HANDOFF', 'Project accepted and team assigned by Production Manager.');

        // Notify each assigned team member
        const { notifyUser } = require('../utils/notificationHelper');
        const User = require('../models/User');
        const assignedRoles = [
            { userId: projectEngineer, role: 'Project Engineer' },
            { userId: siteEngineer, role: 'Site Engineer' },
            { userId: siteSupervisor, role: 'Site Supervisor' }
        ];

        for (const assignee of assignedRoles) {
            if (assignee.userId) {
                const user = await User.findById(assignee.userId);
                if (user) {
                    await notifyUser(assignee.userId, {
                        title: `🏗️ Assigned as ${assignee.role}`,
                        description: `You have been assigned as ${assignee.role} for project "${project.projectName}". The project is now active.`,
                        type: 'Info',
                        relatedModel: 'ProductionProject',
                        relatedId: project._id
                    });
                }
            }
        }

        // Also update the source project stage if linked
        if (project.sourceProject) {
            const Project = require('../models/Project');
            await Project.findByIdAndUpdate(project.sourceProject, {
                stage: 'Production'
            });
        }

        const populated = await ProductionProject.findById(project._id)
            .populate('projectManager', 'fullName')
            .populate('projectEngineer', 'fullName')
            .populate('siteEngineer', 'fullName')
            .populate('siteSupervisor', 'fullName')
            .populate('clientId', 'name');

        return { status: 200, success: true, data: populated, message: 'Project activated and team assigned successfully' };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.createReplacementRequest = async (reqData) => {
    try {
        const { projectId } = reqData.params;
        const { staffType, currentStaffId, reason } = reqData.body;

        if (!['Project Engineer', 'Site Engineer'].includes(reqData.user.role)) {
            return { status: 403, success: false, message: 'Unauthorized to request staff replacement.' };
        }

        if (reqData.user.role === 'Site Engineer' && staffType !== 'Site Supervisor') {
            return { status: 403, success: false, message: 'Site Engineers can only request replacement for Site Supervisors.' };
        }

        const project = await ProductionProject.findById(projectId);
        if (!project) {
            return { status: 404, success: false, message: 'Project not found' };
        }

        const request = await StaffReplacementRequest.create({
            projectId,
            requestedBy: reqData.user.id,
            staffType,
            currentStaffId,
            reason
        });

        await logActivity(projectId, reqData.user.id, 'STAFF_REPLACEMENT_REQUEST', `Requested replacement for ${staffType}`);

        return { status: 201, success: true, data: request };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getReplacementRequests = async (reqData) => {
    try {
        let query = {};
        
        // PM only sees requests for their own projects
        if (reqData.user.role === 'Project Manager') {
            const projects = await ProductionProject.find({ projectManager: reqData.user.id }).select('_id');
            const projectIds = projects.map(p => p._id);
            query.projectId = { $in: projectIds };
        } else if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied' };
        }

        const requests = await StaffReplacementRequest.find(query)
            .populate('projectId', 'projectName')
            .populate('requestedBy', 'fullName')
            .populate('currentStaffId', 'fullName')
            .sort({ createdAt: -1 });

        return { status: 200, success: true, data: requests };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.actionReplacementRequest = async (reqData) => {
    try {
        const { requestId } = reqData.params;
        const { status, adminRemarks } = reqData.body;

        if (reqData.user.role !== 'Project Manager' && reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied' };
        }

        const request = await StaffReplacementRequest.findById(requestId);
        if (!request) {
            return { status: 404, success: false, message: 'Request not found' };
        }

        request.status = status;
        request.adminRemarks = adminRemarks;
        request.actionedBy = reqData.user.id;
        request.actionedAt = Date.now();
        await request.save();

        // If approved, we don't auto-replace (the PM should do it manually via Assign Team)
        // Or we could have a "Replace & Assign" step. For now, just mark as approved.
        
        await logActivity(request.projectId, reqData.user.id, 'STAFF_REPLACEMENT_ACTION', `Replacement request ${status}`);

        return { status: 200, success: true, data: request };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getDashboardCharts = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ projectManager: reqData.user.id });
        const projectIds = projects.map(p => p._id);
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } });

        // Task status distribution
        const tasksByStatus = { Pending: 0, 'In Progress': 0, Completed: 0, Approved: 0 };
        tasks.forEach(t => { tasksByStatus[t.status] = (tasksByStatus[t.status] || 0) + 1; });

        // Task priority distribution
        const tasksByPriority = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
        tasks.forEach(t => { tasksByPriority[t.priority] = (tasksByPriority[t.priority] || 0) + 1; });

        // Project status distribution
        const projectsByStatus = { Planning: 0, Active: 0, 'On Hold': 0, Completed: 0 };
        projects.forEach(p => { projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1; });

        // Tasks by stage (PM → PE → SE → SS)
        const tasksByStage = { PM: 0, PE: 0, SE: 0, SS: 0 };
        tasks.forEach(t => { tasksByStage[t.stage] = (tasksByStage[t.stage] || 0) + 1; });

        // Weekly task completion trend (last 8 weeks)
        const weeklyTrend = [];
        for (let i = 7; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (i * 7));
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            const completed = tasks.filter(t =>
                t.status === 'Completed' &&
                new Date(t.updatedAt) >= weekStart &&
                new Date(t.updatedAt) < weekEnd
            ).length;

            const created = tasks.filter(t =>
                new Date(t.createdAt) >= weekStart &&
                new Date(t.createdAt) < weekEnd
            ).length;

            weeklyTrend.push({
                week: `W${8 - i}`,
                label: weekStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                completed,
                created
            });
        }

        // Project progress overview
        const projectProgress = projects.map(p => ({
            name: p.projectName,
            progress: p.progress || 0,
            status: p.status,
            budget: p.budget || 0,
            spent: p.spent || 0
        }));

        return { status: 200, success: true, data: { tasksByStatus, tasksByPriority, projectsByStatus, tasksByStage, weeklyTrend, projectProgress, totalTasks: tasks.length, totalProjects: projects.length } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getBudgetAnalytics = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ projectManager: reqData.user.id });

        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
        const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
        const totalEstimated = projects.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);

        const projectBudgets = projects.map(p => ({
            id: p._id,
            name: p.projectName,
            status: p.status,
            budget: p.budget || 0,
            spent: p.spent || 0,
            estimated: p.estimatedCost || 0,
            utilization: p.budget ? Math.round((p.spent / p.budget) * 100) : 0,
            variance: (p.budget || 0) - (p.spent || 0),
            riskLevel: p.riskLevel || 'Low'
        }));

        // Budget by status
        const budgetByStatus = {};
        projects.forEach(p => {
            if (!budgetByStatus[p.status]) budgetByStatus[p.status] = { budget: 0, spent: 0 };
            budgetByStatus[p.status].budget += p.budget || 0;
            budgetByStatus[p.status].spent += p.spent || 0;
        });

        return { status: 200, success: true, data: { totalBudget, totalSpent, totalEstimated, utilization: totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0, variance: totalBudget - totalSpent, projectBudgets, budgetByStatus } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getKPIMetrics = async (reqData) => {
    try {
        const projects = await ProductionProject.find({ projectManager: reqData.user.id });
        const projectIds = projects.map(p => p._id);
        const tasks = await ProductionTask.find({ projectId: { $in: projectIds } });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Approved').length;
        const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !['Completed', 'Approved'].includes(t.status)).length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

        // On-time delivery rate
        const tasksWithDueDate = tasks.filter(t => t.dueDate && ['Completed', 'Approved'].includes(t.status));
        const onTimeTasks = tasksWithDueDate.filter(t => new Date(t.updatedAt) <= new Date(t.dueDate));
        const onTimeRate = tasksWithDueDate.length ? Math.round((onTimeTasks.length / tasksWithDueDate.length) * 100) : 100;

        // Average project progress
        const avgProgress = projects.length ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0;

        // Task completion rate
        const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Risk distribution
        const riskDistribution = { Low: 0, Medium: 0, High: 0, Critical: 0 };
        projects.forEach(p => { riskDistribution[p.riskLevel || 'Low']++; });

        // Workforce utilization (unique assignees)
        const assignees = new Set(tasks.filter(t => t.assignedTo).map(t => t.assignedTo.toString()));
        const activeAssignees = new Set(tasks.filter(t => t.assignedTo && t.status === 'In Progress').map(t => t.assignedTo.toString()));

        // Milestone progress
        let totalMilestones = 0;
        let completedMilestones = 0;
        projects.forEach(p => {
            if (p.milestones) {
                totalMilestones += p.milestones.length;
                completedMilestones += p.milestones.filter(m => m.completed).length;
            }
        });

        return { status: 200, success: true, data: {
                onTimeRate,
                completionRate,
                avgProgress,
                totalTasks,
                completedTasks,
                overdueTasks,
                inProgressTasks,
                riskDistribution,
                workforce: {
                    total: assignees.size,
                    active: activeAssignees.size,
                    utilization: assignees.size ? Math.round((activeAssignees.size / assignees.size) * 100) : 0
                },
                milestones: {
                    total: totalMilestones,
                    completed: completedMilestones,
                    rate: totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0
                }
            }
        };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getGanttData = async (reqData) => {
    try {
        const { projectId } = reqData.params;

        let query = {};
        if (projectId && projectId !== 'all') {
            query.projectId = projectId;
        } else {
            const projects = await ProductionProject.find({ projectManager: reqData.user.id });
            query.projectId = { $in: projects.map(p => p._id) };
        }

        const tasks = await ProductionTask.find(query)
            .populate('assignedTo', 'fullName')
            .populate('projectId', 'projectName startDate endDate')
            .sort({ createdAt: 1 });

        const ganttItems = tasks.map(t => ({
            id: t._id,
            title: t.title,
            project: t.projectId?.projectName || '—',
            projectId: t.projectId?._id,
            assignee: t.assignedTo?.fullName || 'Unassigned',
            start: t.startDate || t.createdAt,
            end: t.dueDate || new Date(new Date(t.startDate || t.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000),
            status: t.status,
            priority: t.priority,
            stage: t.stage,
            progress: t.progress || 0
        }));

        return { status: 200, success: true, data: ganttItems };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getProductionReports = async (reqData) => {
    try {
        const LeaveRequest = require('../models/LeaveRequest');
        const ApprovalRequest = require('../models/Approval');

        // Total Projects metrics
        const totalProjects = await ProductionProject.countDocuments();
        const activeProjects = await ProductionProject.countDocuments({ status: { $in: ['Not Started', 'In Progress', 'Delayed', 'Active', 'ACTIVE', 'ON HOLD', 'On Hold'] } });
        const completedProjects = await ProductionProject.countDocuments({ status: { $in: ['Completed', 'COMPLETED'] } });
        const delayedProjects = await ProductionProject.countDocuments({ status: { $in: ['Delayed', 'DELAYED'] } });

        // Total Tasks metrics
        const totalTasks = await ProductionTask.countDocuments();
        const completedTasks = await ProductionTask.countDocuments({ status: { $in: ['Completed', 'Approved'] } });
        const pendingTasks = await ProductionTask.countDocuments({ status: { $in: ['To Do', 'In Progress'] } });
        const overdueTasks = await ProductionTask.find({ 
            status: { $nin: ['Completed', 'Approved'] },
            dueDate: { $lt: new Date() }
        }).countDocuments();

        // Material Requests
        const totalMaterials = await ApprovalRequest.countDocuments({ requestType: 'Material' });
        const pendingMaterials = await ApprovalRequest.countDocuments({ requestType: 'Material', status: 'pending' });

        // Leaves (For PM's scope: PE leaves + SE/SS leaves under them)
        // Keep it simple for reports: all pending leaves in the department.
        const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });

        // Get a breakdown of tasks by project
        const tasksByProjectRaw = await ProductionTask.aggregate([
            {
                $group: {
                    _id: '$projectId',
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $in: ['$status', ['Completed', 'Approved']] }, 1, 0] } }
                }
            }
        ]);

        const projectIds = tasksByProjectRaw.map(t => t._id);
        const projectsData = await ProductionProject.find({ _id: { $in: projectIds } }).select('projectName status');
        
        const tasksByProject = tasksByProjectRaw.map(t => {
            const proj = projectsData.find(p => p._id.toString() === t._id.toString());
            return {
                projectName: proj ? proj.projectName : 'Unknown',
                status: proj ? proj.status : 'Unknown',
                totalTasks: t.total,
                completedTasks: t.completed,
                completionRate: t.total > 0 ? Math.round((t.completed / t.total) * 100) : 0
            };
        });

        return { status: 200, success: true, data: {
                projects: { total: totalProjects, active: activeProjects, completed: completedProjects, delayed: delayedProjects },
                tasks: { total: totalTasks, completed: completedTasks, pending: pendingTasks, overdue: overdueTasks },
                materials: { total: totalMaterials, pending: pendingMaterials },
                leaves: { pending: pendingLeaves },
                projectBreakdown: tasksByProject
            }
        };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.submitProjectCompletion = async (reqData) => {
    try {
        const { completionDate, finalCost, clientRating, finalRemarks, photos } = reqData.body;
        const project = await ProductionProject.findById(reqData.params.id);
        
        if (!project) {
            return { status: 404, success: false, message: 'Project not found' };
        }
        
        project.status = 'Completed';
        project.progress = 100;
        project.completionDetails = {
            completionDate: completionDate || new Date(),
            finalCost,
            clientRating,
            finalRemarks,
            photos
        };
        
        if (finalCost) {
            project.spent = finalCost;
        }

        await project.save();

        await logActivity(
            project._id, 
            reqData.user.id, 
            'PROJECT_COMPLETED', 
            `Project "${project.projectName}" marked as Completed.`
        );

        return { status: 200, success: true, data: project };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};