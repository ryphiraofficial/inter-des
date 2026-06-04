import Task from '../../models/design/Task.js';
import Staff from '../../models/admin/Staff.js';
import Project from '../../models/design/Project.js';
import Quotation from '../../models/sales/Quotation.js';
import MaterialRequest from '../../models/procurement/MaterialRequest.js';
import Invoice from '../../models/sales/Invoice.js';
import Checklist from '../../models/design/Checklist.js';
import { createNotification, notifyStaffUser, notifyByRole as notifyDesign, notifyUser, notifyByRole } from '../../utils/notificationHelper.js';
import { healTaskReferences } from './taskHelper.js';

export const reviewSubmission = async (reqData) => {
    try {
        const { submissionId, status, managerFeedback } = reqData.body;
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };

        const submission = task.submissions.id(submissionId);
        if (!submission) return { status: 404, success: false, message: 'Submission not found' };

        submission.status = status;
        submission.managerFeedback = managerFeedback;
        submission.reviewedAt = new Date();
        submission.reviewedBy = reqData.user.id;

        if (status === 'Approved' || status === 'Pending Sales Review') {
            task.status = 'Pending Sales Review';
            task.timeline.push({ action: 'approved', performedBy: reqData.user.id, details: 'Design approved by manager', timestamp: new Date() });
        } else if (status === 'Revision Required') {
            task.status = 'Revision Required';
            task.timeline.push({ action: 'revisionRequested', performedBy: reqData.user.id, details: `Revision requested: ${managerFeedback}`, timestamp: new Date() });
        }

        await task.save();

        const assignees = await Staff.find({ _id: { $in: task.assignedTo } });
        assignees.forEach(staff => {
            notifyStaffUser(staff.email, { title: `Task ${status}`, description: `Manager has ${status.toLowerCase()} your submission for "${task.title}".${managerFeedback ? ` Feedback: ${managerFeedback}` : ''}`, type: status === 'Approved' ? 'Success' : 'Warning', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
        });

        if (status === 'Approved' || status === 'Pending Sales Review') {
            const designerNames = assignees.map(a => a.name).join(', ') || 'the design team';
            notifyByRole('Sales', { title: '🎨 New Design for Review', description: `Design approved by manager for "${task.title}". Submitted by: ${designerNames}. Please review and present to client.`, type: 'Info', relatedModel: 'Task', relatedId: task._id });
        }

        return { status: 200, success: true, data: task, message: `Submission ${status.toLowerCase()} successfully` };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const pushToProcurement = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id).populate('quotation');
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        await healTaskReferences(task);

        if (!task.project && task.quotation) {
            const project = await Project.findOne({ quotation: task.quotation._id });
            if (project) task.project = project._id;
        }
        if (!task.project) return { status: 400, success: false, message: 'Task is not associated with a project. Please link a project before pushing to procurement.' };
        if (task.status !== 'Approved') return { status: 400, success: false, message: 'Only approved designs can be pushed to procurement' };

        task.status = 'Pushed to Procurement';
        task.timeline.push({ action: 'pushed', performedBy: reqData.user.id, details: 'Finalized design pushed to procurement team', timestamp: new Date() });

        const materialRequestItems = (task.quotation && task.quotation.items) ? task.quotation.items.map(item => ({ itemName: item.itemName, description: item.description, quantity: item.quantity, unit: item.unit || 'SCM', specifications: item.material ? `${item.material} - ${item.finish || 'Standard'}` : null, status: 'Pending' })) : [];
        const materialRequest = await MaterialRequest.create({ project: task.project, quotation: task.quotation ? task.quotation._id : null, items: materialRequestItems, priority: 'Medium', status: 'Pending', requestedBy: reqData.user.id, createdBy: reqData.user.id, isPushedFromDesign: true, notes: `Design handoff from task: ${task.title}. ${materialRequestItems.length === 0 ? 'PLEASE REVIEW AND ADD MATERIALS.' : ''}` });

        await Project.findByIdAndUpdate(task.project, { stage: 'Procurement' });
        if (task.quotation) { task.quotation.status = 'Sent to Procurement'; await task.quotation.save(); }
        if (task.project) {
            const project = await Project.findById(task.project);
            if (project && project.stage !== 'Procurement') { project.stage = 'Procurement'; project.designComplete = true; await project.save(); }
        }

        await task.save();

        createNotification({ title: 'Design Pushed to Procurement', description: `Design for project "${task.title}" has been moved to procurement phase.`, type: 'Success', relatedModel: 'Task', relatedId: task._id, createdBy: reqData.user.id });
        notifyByRole('Procurement Manager', { title: 'New Material Request', description: materialRequest ? `New material request "${materialRequest.requestNumber}" created from design.` : `Design "${task.title}" pushed to procurement for processing.`, type: 'Info', relatedModel: materialRequest ? 'MaterialRequest' : 'Task', relatedId: materialRequest ? materialRequest._id : task._id });

        return { status: 200, success: true, data: task, materialRequest, message: 'Design pushed to procurement successfully' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const salesApproveTask = async (reqData) => {
    try {
        const { approved, salesNotes } = reqData.body;
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        if (task.status !== 'Pending Sales Review') return { status: 400, success: false, message: 'Task is not pending sales review' };

        task.status = approved ? 'Sales Approved' : 'Revision Required';
        task.timeline.push({ action: 'salesApproved', performedBy: reqData.user.id, details: approved ? `Sales approved design. Notes: ${salesNotes || 'None'}` : `Sales rejected design. Reason: ${salesNotes || 'None'}`, timestamp: new Date() });
        await task.save();

        notifyByRole('Design Manager', { title: approved ? '✅ Sales Approved Design' : '⚠️ Sales Rejected Design', description: approved ? `Sales team approved design for "${task.title}". Please push to Admin for final review.` : `Sales team rejected design for "${task.title}". Reason: ${salesNotes}. Please coordinate revision.`, type: approved ? 'Success' : 'Warning', relatedModel: 'Task', relatedId: task._id });

        return { status: 200, success: true, data: task, message: approved ? 'Design approved by Sales' : 'Design sent back for revision' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const managerSendToAdmin = async (reqData) => {
    try {
        const task = await Task.findById(reqData.params.id);
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        if (task.status !== 'Sales Approved') return { status: 400, success: false, message: 'Design must be Sales Approved before sending to Admin' };

        task.status = 'Pending Admin Review';
        task.timeline.push({ action: 'sentToAdmin', performedBy: reqData.user.id, details: 'Design and item list forwarded to Superadmin for final approval', timestamp: new Date() });
        await task.save();

        notifyByRole('Superadmin', { title: '📋 Design Pending Your Approval', description: `Design Manager submitted "${task.title}" for final approval. Review the design and item list to push to procurement.`, type: 'Info', relatedModel: 'Task', relatedId: task._id });

        return { status: 200, success: true, data: task, message: 'Design sent to Superadmin for review' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const adminReviewDesign = async (reqData) => {
    try {
        const { approved, rejectionReason, approvedBudget, advancePercentage, paymentDueDate, adminPaymentNotes, procurementManagerId } = reqData.body;
        const task = await Task.findById(reqData.params.id).populate('quotation');
        if (!task) return { status: 404, success: false, message: 'Task not found' };
        await healTaskReferences(task);

        if (task.status !== 'Pending Admin Review') return { status: 400, success: false, message: 'Task is not pending admin review' };

        if (!approved) {
            task.status = 'Admin Rejected';
            task.timeline.push({ action: 'adminReviewed', performedBy: reqData.user.id, details: `Admin rejected design. Reason: ${rejectionReason || 'Not specified'}`, timestamp: new Date() });
            await task.save();
            notifyByRole('Design Manager', { title: '❌ Admin Rejected Design', description: `Superadmin rejected "${task.title}". Reason: ${rejectionReason || 'Not specified'}. Please coordinate with your team to redo.`, type: 'Error', relatedModel: 'Task', relatedId: task._id });
            return { status: 200, success: true, data: task, message: 'Design rejected and sent back for revision' };
        }

        if (!task.project && task.quotation) {
            let project = await Project.findOne({ quotation: task.quotation._id });
            if (!project) {
                const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 15);
                const invoiceItems = task.quotation.items.map(item => ({ description: `${item.itemName} ${item.section ? `(${item.section})` : ''}`, quantity: item.quantity, rate: item.rate, tax: task.quotation.taxRate || 18, amount: item.amount }));
                project = await Project.create({ client: task.quotation.client, quotation: task.quotation._id, name: task.quotation.projectName, description: `Project created from quotation ${task.quotation.quotationNumber}`, budget: task.quotation.totalAmount, stage: 'Accounts', status: 'Not Started', paymentStatus: 'Pending Advance', advanceAmount: task.quotation.totalAmount * 0.5, createdBy: reqData.user.id });
                await Invoice.create({ client: task.quotation.client, quotation: task.quotation._id, project: project._id, invoiceDate: new Date(), dueDate: dueDate, items: invoiceItems, subtotal: task.quotation.subtotal, totalTax: task.quotation.taxAmount, grandTotal: task.quotation.totalAmount, status: 'Draft', createdBy: reqData.user.id, notes: task.quotation.notes, termsAndConditions: task.quotation.termsAndConditions });
                const defaultSteps = [ { name: 'Demolition', order: 1 }, { name: 'Cleaning', order: 2 }, { name: 'Installation', order: 3 }, { name: 'Final Handover', order: 4 } ];
                await Checklist.create({ project: project._id, steps: defaultSteps, createdBy: reqData.user.id });
            }
            task.project = project._id;
        }

        const quotationTotal = task.quotation?.totalAmount || 0;
        const pct = Number(advancePercentage) || 30;
        const calcAdvanceAmount = Math.round((quotationTotal * pct) / 100);

        task.status = 'Pushed to Procurement';
        task.timeline.push({ action: 'adminReviewed', performedBy: reqData.user.id, details: `Admin approved design. Advance payment ${pct}% (₹${calcAdvanceAmount}) sent to Accounts for collection.`, timestamp: new Date() });

        const latestSubmission = task.submissions?.[task.submissions.length - 1];
        const designItems = latestSubmission?.designItems || [];
        const materialRequestItems = designItems.map(item => ({ itemName: item.name, description: `Size: ${item.size || 'N/A'}`, quantity: item.quantity || 1, unit: item.unit || 'pcs', status: 'Pending' }));

        let materialRequest = null;
        if (task.project) {
            const projectObj = await Project.findById(task.project);
            materialRequest = await MaterialRequest.create({ project: task.project, quotation: task.quotation ? task.quotation._id : null, items: materialRequestItems, priority: 'Medium', status: 'Pending', requestedBy: reqData.user.id, createdBy: reqData.user.id, approvedBudget: approvedBudget || 0, isPushedFromDesign: true, notes: `Design approved by admin. Advance payment collection pending (${pct}% = ₹${calcAdvanceAmount}).` });
            await Project.findByIdAndUpdate(task.project, { stage: 'Procurement', designComplete: true, advancePercentage: pct, advanceAmount: calcAdvanceAmount, paymentDueDate: paymentDueDate ? new Date(paymentDueDate) : null, adminPaymentNotes: adminPaymentNotes || '', paymentCollectionStatus: 'Pending Assignment', paymentStatus: 'Pending Advance', assignedProcurementManager: procurementManagerId || undefined });
            if (procurementManagerId && projectObj) {
                await notifyUser(procurementManagerId, { title: '📦 New Project Assigned for Procurement', description: `You have been assigned as the Procurement Manager for "${projectObj.name}". The design has been approved and you can start sourcing materials immediately.`, type: 'Info', relatedModel: 'Project', relatedId: task.project, createdBy: reqData.user.id });
            }
        }

        if (task.quotation) { task.quotation.status = 'Approved'; await task.quotation.save(); }
        await task.save();

        notifyByRole('Accounts Manager', { title: '💰 New Payment Collection Request', description: `Admin approved design "${task.title}". Collect ${pct}% advance (₹${calcAdvanceAmount.toLocaleString('en-IN')}) by ${paymentDueDate ? new Date(paymentDueDate).toLocaleDateString('en-IN') : 'TBD'}. Assign a staff member to proceed.`, type: 'Info', relatedModel: 'Project', relatedId: task.project });
        notifyDesign('Design Manager', { title: '✅ Design Approved — Awaiting Payment', description: `Admin approved "${task.title}". Project is now pending advance payment collection before procurement begins.`, type: 'Success', relatedModel: 'Task', relatedId: task._id });

        return { status: 200, success: true, data: task, materialRequest, message: `Design approved. Payment collection request (${pct}% = ₹${calcAdvanceAmount}) sent to Accounts Manager.` };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
