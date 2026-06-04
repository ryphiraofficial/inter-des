import Task from '../../models/design/Task.js';
import Quotation from '../../models/sales/Quotation.js';
import Project from '../../models/design/Project.js';
import { createNotification, notifyStaffUser } from '../../utils/notificationHelper.js';
import { logAction } from '../../services/auditService.js';

export const createTask = async (reqData) => {
    try {
        ['project', 'quotation', 'client', 'team'].forEach(field => {
            if (reqData.body[field] === '') delete reqData.body[field];
        });

        let quotationId = reqData.body.quotation;

        if (reqData.body.project) {
            const isQuotation = await Quotation.exists({ _id: reqData.body.project });
            if (isQuotation) {
                quotationId = reqData.body.project;
                reqData.body.quotation = quotationId;
                const associatedProject = await Project.findOne({ quotation: quotationId });
                if (associatedProject) reqData.body.project = associatedProject._id;
                else delete reqData.body.project;
            }
        }

        if (quotationId) {
            const quotation = await Quotation.findById(quotationId);
            if (!quotation) return { status: 404, success: false, message: 'Quotation not found' };
            const allowedStatuses = ['Approved', 'Design Approved', 'Under Review', 'Draft'];
            if (!allowedStatuses.includes(quotation.status)) return { status: 400, success: false, message: `Only active quotations can be assigned to tasks. (Current status: ${quotation.status})` };
            if (!reqData.body.project) {
                const project = await Project.findOne({ quotation: quotationId });
                if (project) reqData.body.project = project._id;
            }
        }

        if (reqData.body.assignedTo && !Array.isArray(reqData.body.assignedTo)) {
            reqData.body.assignedTo = [reqData.body.assignedTo];
        }

        reqData.body.createdBy = reqData.user.id;
        reqData.body.timeline = [{ action: 'created', performedBy: reqData.user.id, details: 'Task created', timestamp: new Date() }];

        const task = await Task.create(reqData.body);

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name role email phone staffId')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount');

        const assignees = Array.isArray(populatedTask.assignedTo) ? populatedTask.assignedTo : [populatedTask.assignedTo];
        assignees.forEach(staff => {
            if (staff) {
                createNotification({ title: 'New Task Assigned', description: `Task "${populatedTask.title}" assigned to you. Due: ${new Date(populatedTask.dueDate).toLocaleDateString('en-IN')}.`, type: 'Task', relatedModel: 'Task', relatedId: populatedTask._id, createdBy: reqData.user.id });
                if (staff.email) {
                    notifyStaffUser(staff.email, { title: 'New Task Assigned to You', description: `You have been assigned "${populatedTask.title}". Priority: ${populatedTask.priority}. Due: ${new Date(populatedTask.dueDate).toLocaleDateString('en-IN')}.`, type: 'Task', relatedModel: 'Task', relatedId: populatedTask._id, createdBy: reqData.user.id });
                }
            }
        });

        logAction({ userId: reqData.user.id, action: 'Task Created', module: 'Task', referenceId: populatedTask._id, referenceModel: 'Task', newValue: { title: populatedTask.title, assignedTo: populatedTask.assignedTo?.map(s => s._id) }, description: `Task "${populatedTask.title}" created and assigned to ${populatedTask.assignedTo?.map(s => s.name).join(', ')}` });

        return { status: 201, success: true, data: populatedTask, message: 'Task created successfully' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
