import Task from '../../models/design/Task.js';
import Staff from '../../models/admin/Staff.js';
import { healTaskReferences } from './taskHelper.js';

export const getTasks = async (reqData) => {
    try {
        const { search, status, priority, assignedTo, page = 1, limit = 1000, includeOverdue } = reqData.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) {
            if (status.includes(',')) {
                query.status = { $in: status.split(',') };
            } else {
                query.status = status;
            }
        }
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;
        if (includeOverdue === 'true') query.isOverdue = true;

        const roleLower = reqData.user.role.toLowerCase();
        const isSales = roleLower.includes('sales');
        const isStaff = (roleLower.includes('staff') || roleLower.includes('designer') || isSales) && !roleLower.includes('manager') && !roleLower.includes('admin');

        if (isStaff) {
            const staffMember = await Staff.findOne({ email: reqData.user.email });
            if (staffMember) {
                if (isSales) {
                    query.$or = [ { assignedTo: staffMember._id }, { status: 'Pending Sales Review' } ];
                } else {
                    query.assignedTo = staffMember._id;
                }
            } else if (!isSales) {
                return { status: 200, success: true, count: 0, data: [] };
            }
        }

        const skip = (page - 1) * limit;
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name role email phone staffId')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount client items')
            .populate('project', 'name projectNumber stage status paymentStatus paymentCollectionStatus advanceAmount collectedAmount tempCollectionDetails')
            .populate('team', 'name')
            .populate('createdBy', 'fullName')
            .populate('comments.user', 'fullName email role')
            .sort({ isOverdue: -1, dueDate: 1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const now = new Date();
        for (const task of tasks) {
            await healTaskReferences(task);
            if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Completed' && !task.isOverdue) {
                task.isOverdue = true;
                await task.save();
            }
        }

        const filteredTasks = tasks.filter(t => {
            const rawObj = t.toObject();
            const hasProjectRef = rawObj.hasOwnProperty('project') && rawObj.project !== undefined;
            return !(hasProjectRef && t.project === null);
        });

        return { status: 200, success: true, count: filteredTasks.length, total: filteredTasks.length, page: parseInt(page), pages: Math.ceil(filteredTasks.length / limit), data: filteredTasks };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

export const getTask = async (reqData) => {
    try {
        const rawTask = await Task.findById(reqData.params.id);
        if (!rawTask) {
            return { status: 404, success: false, message: 'Task not found' };
        }
        await healTaskReferences(rawTask);

        const task = await Task.findById(reqData.params.id)
            .populate('assignedTo', 'name role email phone')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount')
            .populate('project', 'name projectNumber stage status')
            .populate('team', 'name')
            .populate('createdBy', 'fullName');
        return { status: 200, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

export const getTaskComments = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id)
            .select('comments')
            .populate('comments.user', 'fullName email role');
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        return { status: 200, success: true, count: task.comments.length, data: task.comments };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getTaskTimeline = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id)
            .select('timeline')
            .populate('timeline.performedBy', 'fullName email role');
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        return { status: 200, success: true, count: task.timeline.length, data: task.timeline };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getTaskStats = async (reqData) => {
    try {
        const total = await Task.countDocuments();
        const todo = await Task.countDocuments({ status: 'To Do' });
        const inProgress = await Task.countDocuments({ status: 'In Progress' });
        const completed = await Task.countDocuments({ status: 'Completed' });
        const blocked = await Task.countDocuments({ status: 'Blocked' });
        const overdue = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });
        const urgent = await Task.countDocuments({ priority: 'Critical' });
        return { status: 200, success: true, data: { total, todo, inProgress, completed, blocked, overdue, urgent } };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
