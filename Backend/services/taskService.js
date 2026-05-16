const Task = require('../models/Task');
const MaterialRequest = require('../models/MaterialRequest');
const { createNotification, notifyStaffUser, notifyByRole, notifyUser } = require('../utils/notificationHelper');
const { logAction } = require('../services/auditService');
const Quotation = require('../models/Quotation');
const Project = require('../models/Project');
const Staff = require('../models/Staff');
const User = require('../models/User');

const DUPLICATE_SUBMIT_WINDOW = 5000;


exports.getTasks = async (reqData) => {
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

        // Automatically filter for staff users (Flexible role check)
        const roleLower = reqData.user.role.toLowerCase();
        const isSales = roleLower.includes('sales');
        const isStaff = (roleLower.includes('staff') || roleLower.includes('designer') || isSales) && !roleLower.includes('manager') && !roleLower.includes('admin');

        if (isStaff) {
            const Staff = require('../models/Staff');
            const staffMember = await Staff.findOne({ email: reqData.user.email });
            if (staffMember) {
                if (isSales) {
                    // Sales can see tasks assigned to them OR tasks pending sales review
                    query.$or = [
                        { assignedTo: staffMember._id },
                        { status: 'Pending Sales Review' }
                    ];
                } else {
                    query.assignedTo = staffMember._id;
                }
            } else if (!isSales) {
                // If not found in staff model and not sales, return empty
                return { status: 200, success: true, count: 0, data: [] };
            }
        }

        const skip = (page - 1) * limit;
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name role email phone staffId')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount client items')
            .populate('project', 'name projectNumber stage status')
            .populate('team', 'name')
            .populate('createdBy', 'fullName')
            .populate('comments.user', 'fullName email role')
            .sort({ isOverdue: -1, dueDate: 1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        // Update overdue flags for tasks
        const now = new Date();
        for (const task of tasks) {
            if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Completed' && !task.isOverdue) {
                task.isOverdue = true;
                await task.save();
            }
        }

        return { status: 200, success: true, count: tasks.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: tasks };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTask = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id)
            .populate('assignedTo', 'name role email phone')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount')
            .populate('project', 'name projectNumber stage status')
            .populate('team', 'name')
            .populate('createdBy', 'fullName');
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }
        return { status: 200, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.createTask = async (reqData) => {
    try {
        // Sanitize ObjectId fields to prevent casting errors from empty strings
        ['project', 'quotation', 'client', 'team'].forEach(field => {
            if (reqData.body[field] === '') {
                delete reqData.body[field];
            }
        });

        if (reqData.body.quotation) {
            const Quotation = require('../models/Quotation');
            const quotation = await Quotation.findById(reqData.body.quotation);

            if (!quotation) {
                return { status: 404, success: false, message: 'Quotation not found' };
            }

            if (quotation.status !== 'Approved' && quotation.status !== 'Design Approved') {
                return { status: 400, success: false, message: 'Only approved quotations can be assigned to tasks. Please wait for client approval.' };
            }

            // Find associated project
            const Project = require('../models/Project');
            const project = await Project.findOne({ quotation: reqData.body.quotation });
            if (project) {
                reqData.body.project = project._id;
            }
        }

        if (reqData.body.assignedTo && Array.isArray(reqData.body.assignedTo)) {
            // Already an array
        } else if (reqData.body.assignedTo) {
            reqData.body.assignedTo = [reqData.body.assignedTo];
        }

        reqData.body.createdBy = reqData.user.id;
        reqData.body.timeline = [{
            action: 'created',
            performedBy: reqData.user.id,
            details: 'Task created',
            timestamp: new Date()
        }];

        const task = await Task.create(reqData.body);

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name role email phone staffId')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount');

        return { status: 201, success: true, data: populatedTask, message: 'Task created successfully' };

        const assignees = Array.isArray(populatedTask.assignedTo) ? populatedTask.assignedTo : [populatedTask.assignedTo];

        assignees.forEach(staff => {
            if (staff) {
                createNotification({
                    title: 'New Task Assigned',
                    description: `Task "${populatedTask.title}" assigned to you. Due: ${new Date(populatedTask.dueDate).toLocaleDateString('en-IN')}.`,
                    type: 'Task',
                    relatedModel: 'Task',
                    relatedId: populatedTask._id,
                    createdBy: reqData.user.id
                });

                if (staff.email) {
                    notifyStaffUser(staff.email, {
                        title: 'New Task Assigned to You',
                        description: `You have been assigned "${populatedTask.title}". Priority: ${populatedTask.priority}. Due: ${new Date(populatedTask.dueDate).toLocaleDateString('en-IN')}.`,
                        type: 'Task',
                        relatedModel: 'Task',
                        relatedId: populatedTask._id,
                        createdBy: reqData.user.id
                    });
                }
            }
        });

        logAction({
            userId: reqData.user.id,
            action: 'Task Created',
            module: 'Task',
            referenceId: populatedTask._id,
            referenceModel: 'Task',
            newValue: { title: populatedTask.title, assignedTo: populatedTask.assignedTo?.map(s => s._id) },
            description: `Task "${populatedTask.title}" created and assigned to ${populatedTask.assignedTo?.map(s => s.name).join(', ')}`
        });
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.updateTask = async (reqData) => {
    try {
        // Sanitize ObjectId fields to prevent casting errors from empty strings
        ['project', 'quotation', 'client', 'team'].forEach(field => {
            if (reqData.body[field] === '') {
                delete reqData.body[field];
            }
        });

        let task = await Task.findById(reqData.params.id);
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        // Duplicate submit protection
        if (task.lastStatusUpdate && (Date.now() - task.lastStatusUpdate.getTime()) < DUPLICATE_SUBMIT_WINDOW) {
            return { status: 429, success: false, message: 'Please wait before making another update to this task' };
        }

        const oldStatus = task.status;
        const oldAssignedTo = task.assignedTo?.toString();
        const oldValues = {
            status: task.status,
            assignedTo: task.assignedTo,
            priority: task.priority,
            dueDate: task.dueDate
        };

        if (reqData.body.quotation && reqData.body.quotation !== task.quotation?.toString()) {
            const Quotation = require('../models/Quotation');
            const quotation = await Quotation.findById(reqData.body.quotation);

            if (!quotation) {
                return { status: 404, success: false, message: 'Quotation not found' };
            }

            if (quotation.status !== 'Approved' && quotation.status !== 'Design Approved') {
                return { status: 400, success: false, message: 'Only approved quotations can be assigned to tasks. Please wait for client approval.' };
            }

            // Find associated project
            const Project = require('../models/Project');
            const project = await Project.findOne({ quotation: reqData.body.quotation });
            if (project) {
                reqData.body.project = project._id;
            }
        }

        // Build timeline entries
        const timelineUpdates = [];

        if (reqData.body.status && reqData.body.status !== oldStatus) {
            let action = 'updated';
            if (reqData.body.status === 'In Progress') action = 'started';
            else if (reqData.body.status === 'Completed') action = 'completed';
            else if (reqData.body.status === 'To Do' && oldStatus === 'Completed') action = 'reopened';

            timelineUpdates.push({
                action,
                performedBy: reqData.user.id,
                details: `Status changed from "${oldStatus}" to "${reqData.body.status}"`,
                oldValue: oldStatus,
                newValue: reqData.body.status,
                timestamp: new Date()
            });
        }

        if (reqData.body.assignedTo && reqData.body.assignedTo !== oldAssignedTo) {
            timelineUpdates.push({
                action: 'reassigned',
                performedBy: reqData.user.id,
                details: `Task reassigned`,
                oldValue: oldAssignedTo,
                newValue: reqData.body.assignedTo,
                timestamp: new Date()
            });
        }

        // Merge updates
        Object.keys(reqData.body).forEach(key => {
            if (key !== 'timeline' && key !== 'lastStatusUpdate') {
                task[key] = reqData.body[key];
            }
        });

        if (timelineUpdates.length > 0) {
            task.timeline.push(...timelineUpdates);
            task.lastStatusUpdate = new Date();
        }

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name role email phone')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount')
            .populate('comments.user', 'fullName email role');

        // Fire-and-forget notifications
        if (reqData.body.status && reqData.body.status !== oldStatus) {
            createNotification({
                title: `Task Status: ${reqData.body.status}`,
                description: `Task "${task.title}" status changed from "${oldStatus}" to "${reqData.body.status}".`,
                type: reqData.body.status === 'Completed' ? 'Success' : 'Task',
                relatedModel: 'Task',
                relatedId: task._id,
                createdBy: reqData.user.id
            });

            if (task.assignedTo?.email) {
                notifyStaffUser(task.assignedTo.email, {
                    title: `Your Task Updated`,
                    description: `Task "${task.title}" status changed to "${reqData.body.status}".`,
                    type: reqData.body.status === 'Completed' ? 'Success' : 'Task',
                    relatedModel: 'Task',
                    relatedId: task._id,
                    createdBy: reqData.user.id
                });
            }

            if (reqData.body.status === 'Completed') {
                logAction({
                    userId: reqData.user.id,
                    action: 'Task Completed',
                    module: 'Task',
                    referenceId: task._id,
                    referenceModel: 'Task',
                    oldValue: { status: oldStatus },
                    newValue: { status: 'Completed', completedAt: new Date() },
                    description: `Task "${task.title}" marked as completed`
                });
            }
        }

        if (reqData.body.assignedTo && reqData.body.assignedTo !== oldAssignedTo) {
            notifyStaffUser(task.assignedTo?.email, {
                title: 'Task Reassigned to You',
                description: `You have been assigned "${task.title}". Priority: ${task.priority}.`,
                type: 'Task',
                relatedModel: 'Task',
                relatedId: task._id,
                createdBy: reqData.user.id
            });

            logAction({
                userId: reqData.user.id,
                action: 'Task Reassigned',
                module: 'Task',
                referenceId: task._id,
                referenceModel: 'Task',
                oldValue: { assignedTo: oldAssignedTo },
                newValue: { assignedTo: reqData.body.assignedTo },
                description: `Task "${task.title}" reassigned`
            });
        }

        return { status: 200, success: true, data: updatedTask, message: 'Task updated successfully' };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.deleteTask = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id);
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }
        await task.deleteOne();
        return { status: 200, success: true, message: 'Task deleted', data: {} };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.submitTask = async (reqData) => {
    try {
        const { staffNotes, files, designItems } = reqData.body;
        const task = await Task.findById(reqData.params.id);

        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        const Staff = require('../models/Staff');
        const staffMember = await Staff.findOne({ email: reqData.user.email });

        const submission = {
            files: files || [],
            staffNotes,
            designItems: designItems || [],
            submittedBy: staffMember ? staffMember._id : null,
            submittedAt: new Date(),
            status: 'Pending Review'
        };

        task.submissions.push(submission);
        task.status = 'Review Pending';
        task.timeline.push({
            action: 'submitted',
            performedBy: reqData.user.id,
            details: `Design files submitted by ${staffMember ? staffMember.name : reqData.user.fullName}`,
            timestamp: new Date()
        });

        // Sanitize potentially corrupted fields that cause casting errors
        const fieldsToFix = ['project', 'quotation', 'client', 'team'];
        fieldsToFix.forEach(field => {
            if (task[field] === '' || (task[field] && typeof task[field] === 'string' && task[field].trim() === '')) {
                console.log(`Fixing corrupted ${field} field for task ${task._id}`);
                task[field] = undefined;
            }
        });

        await task.save();

        return { status: 200, success: true, data: task, message: 'Task submitted for review' };

        createNotification({
            title: 'Task Submitted',
            description: `Design files submitted for task "${task.title}" by ${staffMember ? staffMember.name : reqData.user.fullName}.`,
            type: 'Info',
            relatedModel: 'Task',
            relatedId: task._id,
            createdBy: reqData.user.id
        });
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.reviewSubmission = async (reqData) => {
    try {
        const { submissionId, status, managerFeedback } = reqData.body;
        const task = await Task.findById(reqData.params.id);

        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        const submission = task.submissions.id(submissionId);
        if (!submission) {
            return { status: 404, success: false, message: 'Submission not found' };
        }

        submission.status = status;
        submission.managerFeedback = managerFeedback;
        submission.reviewedAt = new Date();
        submission.reviewedBy = reqData.user.id;

        if (status === 'Approved' || status === 'Pending Sales Review') {
            task.status = 'Pending Sales Review';
            task.timeline.push({
                action: 'approved',
                performedBy: reqData.user.id,
                details: 'Design approved by manager',
                timestamp: new Date()
            });
        } else if (status === 'Revision Required') {
            task.status = 'Revision Required';
            task.timeline.push({
                action: 'revisionRequested',
                performedBy: reqData.user.id,
                details: `Revision requested: ${managerFeedback}`,
                timestamp: new Date()
            });
        }

        await task.save();

        // Notify assignees
        const Staff = require('../models/Staff');
        const assignees = await Staff.find({ _id: { $in: task.assignedTo } });

        assignees.forEach(staff => {
            notifyStaffUser(staff.email, {
                title: `Task ${status}`,
                description: `Manager has ${status.toLowerCase()} your submission for "${task.title}".${managerFeedback ? ` Feedback: ${managerFeedback}` : ''}`,
                type: status === 'Approved' ? 'Success' : 'Warning',
                relatedModel: 'Task',
                relatedId: task._id,
                createdBy: reqData.user.id
            });
        });

        if (status === 'Approved' || status === 'Pending Sales Review') {
            const designerNames = assignees.map(a => a.name).join(', ') || 'the design team';
            notifyByRole('Sales', {
                title: '🎨 New Design for Review',
                description: `Design approved by manager for "${task.title}". Submitted by: ${designerNames}. Please review and present to client.`,
                type: 'Info',
                relatedModel: 'Task',
                relatedId: task._id
            });
        }

        return { status: 200, success: true, data: task, message: `Submission ${status.toLowerCase()} successfully` };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.pushToProcurement = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id).populate('quotation');
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        // If project is missing on task, try to get it from the associated Project model
        if (!task.project && task.quotation) {
            const Project = require('../models/Project');
            const project = await Project.findOne({ quotation: task.quotation._id });
            if (project) {
                task.project = project._id;
            }
        }

        if (!task.project) {
            return { status: 400, success: false, message: 'Task is not associated with a project. Please link a project before pushing to procurement.' };
        }

        if (task.status !== 'Approved') {
            return { status: 400, success: false, message: 'Only approved designs can be pushed to procurement' };
        }

        task.status = 'Pushed to Procurement';
        task.timeline.push({
            action: 'pushed',
            performedBy: reqData.user.id,
            details: 'Finalized design pushed to procurement team',
            timestamp: new Date()
        });

        let materialRequest = null;
        // Map items if quotation exists, otherwise start with empty items
        const materialRequestItems = (task.quotation && task.quotation.items)
            ? task.quotation.items.map(item => ({
                itemName: item.itemName,
                description: item.description,
                quantity: item.quantity,
                unit: item.unit || 'SCM',
                specifications: item.material ? `${item.material} - ${item.finish || 'Standard'}` : null,
                status: 'Pending'
            }))
            : [];

        materialRequest = await MaterialRequest.create({
            project: task.project,
            quotation: task.quotation ? task.quotation._id : null,
            items: materialRequestItems,
            priority: 'Medium',
            status: 'Pending',
            requestedBy: reqData.user.id,
            createdBy: reqData.user.id,
            isPushedFromDesign: true,
            notes: `Design handoff from task: ${task.title}. ${materialRequestItems.length === 0 ? 'PLEASE REVIEW AND ADD MATERIALS.' : ''}`
        });

        await Project.findByIdAndUpdate(task.project, {
            stage: 'Procurement'
        });

        if (task.quotation) {
            task.quotation.status = 'Sent to Procurement';
            await task.quotation.save();
        }

        if (task.project) {
            const Project = require('../models/Project');
            const project = await Project.findById(task.project);
            if (project && project.stage !== 'Procurement') {
                project.stage = 'Procurement';
                project.designComplete = true;
                await project.save();
            }
        }

        await task.save();

        return { status: 200, success: true, data: task, materialRequest, message: 'Design pushed to procurement successfully' };

        createNotification({
            title: 'Design Pushed to Procurement',
            description: `Design for project "${task.title}" has been moved to procurement phase.`,
            type: 'Success',
            relatedModel: 'Task',
            relatedId: task._id,
            createdBy: reqData.user.id
        });

        const { notifyByRole } = require('../utils/notificationHelper');
        notifyByRole('Procurement Manager', {
            title: 'New Material Request',
            description: materialRequest
                ? `New material request "${materialRequest.requestNumber}" created from design.`
                : `Design "${task.title}" pushed to procurement for processing.`,
            type: 'Info',
            relatedModel: materialRequest ? 'MaterialRequest' : 'Task',
            relatedId: materialRequest ? materialRequest._id : task._id
        });
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.salesApproveTask = async (reqData) => {
    try {
        const { approved, salesNotes } = reqData.body;
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };

        if (task.status !== 'Pending Sales Review') {
            return { status: 400, success: false, message: 'Task is not pending sales review' };
        }

        task.status = approved ? 'Sales Approved' : 'Revision Required';
        task.timeline.push({
            action: 'salesApproved',
            performedBy: reqData.user.id,
            details: approved
                ? `Sales approved design. Notes: ${salesNotes || 'None'}`
                : `Sales rejected design. Reason: ${salesNotes || 'None'}`,
            timestamp: new Date()
        });
        await task.save();

        return { status: 200, success: true, data: task, message: approved ? 'Design approved by Sales' : 'Design sent back for revision' };

        // Notify Design Manager
        const { notifyByRole } = require('../utils/notificationHelper');
        notifyByRole('Design Manager', {
            title: approved ? '✅ Sales Approved Design' : '⚠️ Sales Rejected Design',
            description: approved
                ? `Sales team approved design for "${task.title}". Please push to Admin for final review.`
                : `Sales team rejected design for "${task.title}". Reason: ${salesNotes}. Please coordinate revision.`,
            type: approved ? 'Success' : 'Warning',
            relatedModel: 'Task',
            relatedId: task._id
        });
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.managerSendToAdmin = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };

        if (task.status !== 'Sales Approved') {
            return { status: 400, success: false, message: 'Design must be Sales Approved before sending to Admin' };
        }

        task.status = 'Pending Admin Review';
        task.timeline.push({
            action: 'sentToAdmin',
            performedBy: reqData.user.id,
            details: 'Design and item list forwarded to Superadmin for final approval',
            timestamp: new Date()
        });
        await task.save();

        return { status: 200, success: true, data: task, message: 'Design sent to Superadmin for review' };

        // Notify Superadmin
        const { notifyByRole } = require('../utils/notificationHelper');
        notifyByRole('Superadmin', {
            title: '📋 Design Pending Your Approval',
            description: `Design Manager submitted "${task.title}" for final approval. Review the design and item list to push to procurement.`,
            type: 'Info',
            relatedModel: 'Task',
            relatedId: task._id
        });
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.adminReviewDesign = async (reqData) => {
    try {
        const { approved, rejectionReason, approvedBudget, advancePercentage, paymentDueDate, adminPaymentNotes } = reqData.body;
        const task = await Task.findById(reqData.params.id).populate('quotation');
        if (!task) return { status: 404, success: false, message: 'Task not found' };

        if (task.status !== 'Pending Admin Review') {
            return { status: 400, success: false, message: 'Task is not pending admin review' };
        }

        if (!approved) {
            // Admin rejects — send back to designer/manager for redo
            task.status = 'Admin Rejected';
            task.timeline.push({
                action: 'adminReviewed',
                performedBy: reqData.user.id,
                details: `Admin rejected design. Reason: ${rejectionReason || 'Not specified'}`,
                timestamp: new Date()
            });
            await task.save();

            const { notifyByRole } = require('../utils/notificationHelper');
            notifyByRole('Design Manager', {
                title: '❌ Admin Rejected Design',
                description: `Superadmin rejected "${task.title}". Reason: ${rejectionReason || 'Not specified'}. Please coordinate with your team to redo.`,
                type: 'Error',
                relatedModel: 'Task',
                relatedId: task._id
            });

            return { status: 200, success: true, data: task, message: 'Design rejected and sent back for revision' };
        }

        // --- ADMIN APPROVES ---
        // Resolve project reference
        const ProjectModel = require('../models/Project');
        if (!task.project && task.quotation) {
            const project = await ProjectModel.findOne({ quotation: task.quotation._id });
            if (project) task.project = project._id;
        }

        // Calculate advance amount from quotation total
        const quotationTotal = task.quotation?.totalAmount || 0;
        const pct = Number(advancePercentage) || 30;
        const calcAdvanceAmount = Math.round((quotationTotal * pct) / 100);

        // Update task status
        task.status = 'Pushed to Procurement';
        task.timeline.push({
            action: 'adminReviewed',
            performedBy: reqData.user.id,
            details: `Admin approved design. Advance payment ${pct}% (₹${calcAdvanceAmount}) sent to Accounts for collection.`,
            timestamp: new Date()
        });

        // Build material request from designItems — kept On Hold until payment cleared
        const latestSubmission = task.submissions?.[task.submissions.length - 1];
        const designItems = latestSubmission?.designItems || [];
        const materialRequestItems = designItems.map(item => ({
            itemName: item.name,
            description: `Size: ${item.size || 'N/A'}`,
            quantity: item.quantity || 1,
            unit: item.unit || 'pcs',
            status: 'Pending'
        }));

        let materialRequest = null;
        if (task.project) {
            materialRequest = await MaterialRequest.create({
                project: task.project,
                quotation: task.quotation ? task.quotation._id : null,
                items: materialRequestItems,
                priority: 'Medium',
                status: 'Pending',  // Concurrent: Procurement can process while Accounts collects payment
                requestedBy: reqData.user.id,
                createdBy: reqData.user.id,
                approvedBudget: approvedBudget || 0,
                isPushedFromDesign: true,
                notes: `Design approved by admin. Advance payment collection pending (${pct}% = ₹${calcAdvanceAmount}).`
            });

            // Update project: move to 'Procurement' stage so PM can see it, save payment details for Accounts
            await ProjectModel.findByIdAndUpdate(task.project, {
                stage: 'Procurement',
                designComplete: true,
                advancePercentage: pct,
                advanceAmount: calcAdvanceAmount,
                paymentDueDate: paymentDueDate ? new Date(paymentDueDate) : null,
                adminPaymentNotes: adminPaymentNotes || '',
                paymentCollectionStatus: 'Pending Assignment',
                paymentStatus: 'Pending Advance'
            });
        }

        // Update quotation status
        if (task.quotation) {
            task.quotation.status = 'Approved';
            await task.quotation.save();
        }

        await task.save();

        // Notify ALL Accounts Managers in-app
        const { notifyByRole, notifyByRole: notifyDesign } = require('../utils/notificationHelper');
        notifyByRole('Accounts Manager', {
            title: '💰 New Payment Collection Request',
            description: `Admin approved design "${task.title}". Collect ${pct}% advance (₹${calcAdvanceAmount.toLocaleString('en-IN')}) by ${paymentDueDate ? new Date(paymentDueDate).toLocaleDateString('en-IN') : 'TBD'}. Assign a staff member to proceed.`,
            type: 'Info',
            relatedModel: 'Project',
            relatedId: task.project
        });

        // Notify Design Manager of approval
        notifyDesign('Design Manager', {
            title: '✅ Design Approved — Awaiting Payment',
            description: `Admin approved "${task.title}". Project is now pending advance payment collection before procurement begins.`,
            type: 'Success',
            relatedModel: 'Task',
            relatedId: task._id
        });

        return {
            status: 200,
            success: true,
            data: task,
            materialRequest,
            message: `Design approved. Payment collection request (${pct}% = ₹${calcAdvanceAmount}) sent to Accounts Manager.`
        };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};


exports.addComment = async (reqData) => {
    try {
        const { text } = reqData.body;
        if (!text || text.trim() === '') {
            return { status: 400, success: false, message: 'Comment text is required' };
        }

        const task = await Task.findById(reqData.params.id);
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        const comment = {
            user: reqData.user.id,
            text: text.trim(),
            createdAt: new Date()
        };

        task.comments.push(comment);
        task.timeline.push({
            action: 'commented',
            performedBy: reqData.user.id,
            details: `Comment added: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
            timestamp: new Date()
        });

        await task.save();

        const updatedTask = await Task.findById(reqData.params.id)
            .populate('assignedTo', 'name role email phone')
            .populate('comments.user', 'fullName email role');

        return { status: 201, success: true, data: updatedTask, message: 'Comment added successfully' };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTaskComments = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id)
            .select('comments')
            .populate('comments.user', 'fullName email role');

        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        return { status: 200, success: true, count: task.comments.length, data: task.comments };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTaskTimeline = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id)
            .select('timeline')
            .populate('timeline.performedBy', 'fullName email role');

        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        return { status: 200, success: true, count: task.timeline.length, data: task.timeline };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.reassignTask = async (reqData) => {
    try {
        const { assignedTo, staffIds, reason } = reqData.body;
        // Support both single 'assignedTo' or array 'staffIds'
        const newAssignees = staffIds || (Array.isArray(assignedTo) ? assignedTo : [assignedTo]);

        if (!newAssignees || newAssignees.length === 0 || !newAssignees[0]) {
            return { status: 400, success: false, message: 'At least one assignee is required' };
        }

        const task = await Task.findById(reqData.params.id);
        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        const oldAssignees = task.assignedTo;
        const Staff = require('../models/Staff');
        const staffMembers = await Staff.find({ _id: { $in: newAssignees } });

        if (staffMembers.length === 0) {
            return { status: 404, success: false, message: 'No valid assignees found' };
        }

        await Task.findByIdAndUpdate(reqData.params.id, {
            $set: {
                assignedTo: newAssignees,
                lastStatusUpdate: new Date()
            },
            $push: {
                timeline: {
                    action: 'reassigned',
                    performedBy: reqData.user.id,
                    details: reason || `Task reassigned to ${staffMembers.map(s => s.name).join(', ')}`,
                    oldValue: oldAssignees,
                    newValue: newAssignees,
                    timestamp: new Date()
                }
            }
        });

        const updatedTask = await Task.findById(reqData.params.id)
            .populate('assignedTo', 'name role email phone')
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount');

        return { status: 200, success: true, data: updatedTask, message: 'Task reassigned successfully' };

        // Notify new assignees
        staffMembers.forEach(staff => {
            if (staff.email) {
                notifyStaffUser(staff.email, {
                    title: 'Task Reassigned to You',
                    description: `You have been assigned "${task.title}". Priority: ${task.priority}. Due: ${new Date(task.dueDate).toLocaleDateString('en-IN')}.${reason ? ` Reason: ${reason}` : ''}`,
                    type: 'Task',
                    relatedModel: 'Task',
                    relatedId: task._id,
                    createdBy: reqData.user.id
                });
            }
        });

        logAction({
            userId: reqData.user.id,
            action: 'Task Reassigned',
            module: 'Task',
            referenceId: task._id,
            referenceModel: 'Task',
            oldValue: { assignedTo: oldAssignees },
            newValue: { assignedTo: newAssignees, reason },
            description: `Task "${task.title}" reassigned to ${staffMembers.map(s => s.name).join(', ')}`
        });
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.getTaskStats = async (reqData) => {
    try {
        const total = await Task.countDocuments();
        const todo = await Task.countDocuments({ status: 'To Do' });
        const inProgress = await Task.countDocuments({ status: 'In Progress' });
        const completed = await Task.countDocuments({ status: 'Completed' });
        const blocked = await Task.countDocuments({ status: 'Blocked' });

        const overdue = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'Completed' }
        });

        const urgent = await Task.countDocuments({ priority: 'Critical' });

        return { status: 200, success: true, data: { total, todo, inProgress, completed, blocked, overdue, urgent } };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

exports.addDailyUpdate = async (reqData) => {
    try {
        const { update, emergencies, extensionRequest } = reqData.body;
        const task = await Task.findById(reqData.params.id);

        if (!task) {
            return { status: 404, success: false, message: 'Task not found' };
        }

        const Staff = require('../models/Staff');
        const staff = await Staff.findOne({ email: reqData.user.email });

        task.dailyUpdates.push({
            staff: staff ? staff._id : null,
            update,
            emergencies,
            extensionRequest: extensionRequest && extensionRequest.requestedDate ? {
                requestedDate: extensionRequest.requestedDate,
                reason: extensionRequest.reason,
                status: 'Pending'
            } : undefined
        });

        task.timeline.push({
            action: 'updated',
            performedBy: reqData.user.id,
            details: `Daily update submitted by ${staff?.name || reqData.user.fullName}`
        });

        await task.save();

        return { status: 200, success: true, data: task };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};