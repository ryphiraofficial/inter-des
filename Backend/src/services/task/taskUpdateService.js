import Task from '../../models/design/Task.js';
import Quotation from '../../models/sales/Quotation.js';
import Project from '../../models/design/Project.js';
import Staff from '../../models/admin/Staff.js';
import { createNotification, notifyStaffUser } from '../../utils/notificationHelper.js';
import { logAction } from '../../services/auditService.js';

const DUPLICATE_SUBMIT_WINDOW = 5000;

export const updateTask = async (reqData) => {
    try {
        ['project', 'quotation', 'client', 'team'].forEach(field => { if (reqData.body[field] === '') delete reqData.body[field]; });

        let task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        if (task.lastStatusUpdate && (Date.now() - task.lastStatusUpdate.getTime()) < DUPLICATE_SUBMIT_WINDOW) return { status: 429, success: false, message: 'Please wait before making another update to this task' };

        const oldStatus = task.status;
        const oldAssignedTo = task.assignedTo?.toString();
        let quotationId = reqData.body.quotation || task.quotation?.toString();

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

        if (quotationId && (reqData.body.quotation || reqData.body.project)) {
            const quotation = await Quotation.findById(quotationId);
            if (!quotation) return { status: 404, success: false, message: 'Quotation not found' };
            const allowedStatuses = ['Approved', 'Design Approved', 'Under Review', 'Draft'];
            if (!allowedStatuses.includes(quotation.status)) return { status: 400, success: false, message: `Only active quotations can be assigned to tasks. (Current status: ${quotation.status})` };
            if (!reqData.body.project) {
                const project = await Project.findOne({ quotation: quotationId });
                if (project) reqData.body.project = project._id;
            }
        }

        const timelineUpdates = [];
        if (reqData.body.status && reqData.body.status !== oldStatus) {
            let action = 'updated';
            if (reqData.body.status === 'In Progress') action = 'started';
            else if (reqData.body.status === 'Completed') action = 'completed';
            else if (reqData.body.status === 'To Do' && oldStatus === 'Completed') action = 'reopened';
            timelineUpdates.push({ action, performedBy: reqData.user.id, details: `Status changed from "${oldStatus}" to "${reqData.body.status}"`, oldValue: oldStatus, newValue: reqData.body.status, timestamp: new Date() });
        }

        if (reqData.body.assignedTo && reqData.body.assignedTo !== oldAssignedTo) {
            timelineUpdates.push({ action: 'reassigned', performedBy: reqData.user.id, details: `Task reassigned`, oldValue: oldAssignedTo, newValue: reqData.body.assignedTo, timestamp: new Date() });
        }

        Object.keys(reqData.body).forEach(key => { if (key !== 'timeline' && key !== 'lastStatusUpdate') task[key] = reqData.body[key]; });

        if (timelineUpdates.length > 0) {
            task.timeline.push(...timelineUpdates);
            task.lastStatusUpdate = new Date();
        }

        await task.save();

        const updatedTask = await Task.findById(task._id).populate('assignedTo', 'name role email phone').populate('client', 'name email phone').populate('quotation', 'quotationNumber projectName totalAmount').populate('comments.user', 'fullName email role');

        if (reqData.body.status && reqData.body.status !== oldStatus) {
            createNotification({ title: `Task Status: ${reqData.body.status}`, description: `Task "${task.title}" status changed from "${oldStatus}" to "${reqData.body.status}".`, type: reqData.body.status === 'Completed' ? 'Success' : 'Task', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
            if (task.assignedTo?.email) notifyStaffUser(task.assignedTo.email, { title: `Your Task Updated`, description: `Task "${task.title}" status changed to "${reqData.body.status}".`, type: reqData.body.status === 'Completed' ? 'Success' : 'Task', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
            if (reqData.body.status === 'Completed') logAction({ userId: reqData.user.id, action: 'Task Completed', module: 'Task', referenceId: task._id, referenceModel: 'Task', oldValue: { status: oldStatus }, newValue: { status: 'Completed', completedAt: new Date() }, description: `Task "${task.title}" marked as completed` });
        }

        if (reqData.body.assignedTo && reqData.body.assignedTo !== oldAssignedTo) {
            notifyStaffUser(task.assignedTo?.email, { title: 'Task Reassigned to You', description: `You have been assigned "${task.title}". Priority: ${task.priority}.`, type: 'Task', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
            logAction({ userId: reqData.user.id, action: 'Task Reassigned', module: 'Task', referenceId: task._id, referenceModel: 'Task', oldValue: { assignedTo: oldAssignedTo }, newValue: { assignedTo: reqData.body.assignedTo }, description: `Task "${task.title}" reassigned` });
        }

        return { status: 200, success: true, data: updatedTask, message: 'Task updated successfully' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const deleteTask = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        await task.deleteOne();
        return { status: 200, success: true, message: 'Task deleted', data: {} };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const addComment = async (reqData) => {
    try {
        const { text } = reqData.body;
        if (!text || text.trim() === '') return { status: 400, success: false, message: 'Comment text is required' };
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        const comment = { user: reqData.user.id, text: text.trim(), createdAt: new Date() };
        task.comments.push(comment);
        task.timeline.push({ action: 'commented', performedBy: reqData.user.id, details: `Comment added: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`, timestamp: new Date() });
        await task.save();
        const updatedTask = await Task.findById(reqData.params.id).populate('assignedTo', 'name role email phone').populate('comments.user', 'fullName email role');
        return { status: 201, success: true, data: updatedTask, message: 'Comment added successfully' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const reassignTask = async (reqData) => {
    try {
        const { assignedTo, staffIds, reason } = reqData.body;
        const newAssignees = staffIds || (Array.isArray(assignedTo) ? assignedTo : [assignedTo]);
        if (!newAssignees || newAssignees.length === 0 || !newAssignees[0]) return { status: 400, success: false, message: 'At least one assignee is required' };
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        const oldAssignees = task.assignedTo;
        const staffMembers = await Staff.find({ _id: { $in: newAssignees } });
        if (staffMembers.length === 0) return { status: 404, success: false, message: 'No valid assignees found' };

        await Task.findByIdAndUpdate(reqData.params.id, { $set: { assignedTo: newAssignees, lastStatusUpdate: new Date() }, $push: { timeline: { action: 'reassigned', performedBy: reqData.user.id, details: reason || `Task reassigned to ${staffMembers.map(s => s.name).join(', ')}`, oldValue: oldAssignees, newValue: newAssignees, timestamp: new Date() } } });
        const updatedTask = await Task.findById(reqData.params.id).populate('assignedTo', 'name role email phone').populate('client', 'name email phone').populate('quotation', 'quotationNumber projectName totalAmount');
        staffMembers.forEach(staff => {
            if (staff.email) notifyStaffUser(staff.email, { title: 'Task Reassigned to You', description: `You have been assigned "${task.title}". Priority: ${task.priority}. Due: ${new Date(task.dueDate).toLocaleDateString('en-IN')}.${reason ? ` Reason: ${reason}` : ''}`, type: 'Task', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
        });
        logAction({ userId: reqData.user.id, action: 'Task Reassigned', module: 'Task', referenceId: task._id, referenceModel: 'Task', oldValue: { assignedTo: oldAssignees }, newValue: { assignedTo: newAssignees, reason }, description: `Task "${task.title}" reassigned to ${staffMembers.map(s => s.name).join(', ')}` });
        return { status: 200, success: true, data: updatedTask, message: 'Task reassigned successfully' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const addDailyUpdate = async (reqData) => {
    try {
        const { update, emergencies, extensionRequest } = reqData.body;
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        const staff = await Staff.findOne({ email: reqData.user.email });
        task.dailyUpdates.push({ staff: staff ? staff._id : null, update, emergencies, extensionRequest: extensionRequest && extensionRequest.requestedDate ? { requestedDate: extensionRequest.requestedDate, reason: extensionRequest.reason, status: 'Pending' } : undefined });
        task.timeline.push({ action: 'updated', performedBy: reqData.user.id, details: `Daily update submitted by ${staff?.name || reqData.user.fullName}` });
        await task.save();
        return { status: 200, success: true, data: task };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const submitTask = async (reqData) => {
    try {
        const { staffNotes, files, designItems } = reqData.body;
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        const staffMember = await Staff.findOne({ email: reqData.user.email });
        const submission = { files: files || [], staffNotes, designItems: designItems || [], submittedBy: staffMember ? staffMember._id : null, submittedAt: new Date(), status: 'Pending Review' };
        task.submissions.push(submission);
        task.status = 'Review Pending';
        task.timeline.push({ action: 'submitted', performedBy: reqData.user.id, details: `Design files submitted by ${staffMember ? staffMember.name : reqData.user.fullName}`, timestamp: new Date() });
        const fieldsToFix = ['project', 'quotation', 'client', 'team'];
        fieldsToFix.forEach(field => { if (task[field] === '' || (task[field] && typeof task[field] === 'string' && task[field].trim() === '')) task[field] = undefined; });
        await task.save();

        createNotification({ title: 'Task Submitted', description: `Design files submitted for task "${task.title}" by ${staffMember ? staffMember.name : reqData.user.fullName}.`, type: 'Info', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
        return { status: 200, success: true, data: task, message: 'Task submitted for review' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
