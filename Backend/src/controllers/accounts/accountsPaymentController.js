import Payment from '../../models/accounts/Payment.js';
import Invoice from '../../models/sales/Invoice.js';
import Project from '../../models/design/Project.js';
import Staff from '../../models/admin/Staff.js';
import User from '../../models/admin/User.js';
import { createNotification, notifyUser, notifyByRole } from '../../utils/notificationHelper.js';

export const getPayments = async (req, res) => {
    try {
        const { project, invoice, client, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (project) query.project = project;
        if (invoice) query.invoice = invoice;
        if (client) query.client = client;
        
        const skip = (page - 1) * limit;
        const payments = await Payment.find(query)
            .populate('project', 'name projectNumber')
            .populate('invoice', 'invoiceNumber grandTotal')
            .populate('client', 'name')
            .populate('receivedBy', 'fullName')
            .sort({ paymentDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Payment.countDocuments(query);
        
        res.status(200).json({ success: true, count: payments.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPayment = async (req, res) => {
    try {
        req.body.receivedBy = req.user.id;
        const payment = await Payment.create(req.body);
        
        const invoice = await Invoice.findById(req.body.invoice);
        if (invoice) {
            invoice.amountPaid += req.body.amount;
            if (invoice.amountPaid >= invoice.grandTotal) {
                invoice.status = 'Paid';
                invoice.paymentDate = new Date();
            } else {
                invoice.status = 'Partially Paid';
            }
            await invoice.save();
        }
        
        await createNotification({ title: 'Payment Received', description: `Payment of ₹${req.body.amount.toLocaleString('en-IN')} received.`, type: 'Invoice', relatedModel: 'Payment', relatedId: payment._id, createdBy: req.user.id });
        
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingAccountsProjects = async (req, res) => {
    try {
        const projects = await Project.find({ 
            $or: [
                { stage: 'Accounts' },
                { stage: 'Pending Payment' },
                { paymentCollectionStatus: { $in: ['Pending Assignment', 'Assigned', 'Collected'] } }
            ]
        })
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber projectName totalAmount')
            .populate('assignedAccountsStaff', 'fullName email role staffId')
            .sort({ paymentDueDate: 1, createdAt: -1 });
        
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const assignAccountsStaff = async (req, res) => {
    try {
        const { projectId, staffId } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        let targetUserId = staffId;
        const staff = await Staff.findById(staffId);
        if (staff) {
            const userDoc = await User.findOne({ $or: [{ staffId: staff.staffId }, { email: staff.email.toLowerCase() }] });
            if (userDoc) targetUserId = userDoc._id;
        }

        project.assignedAccountsStaff = targetUserId;
        project.paymentCollectionStatus = 'Assigned';
        await project.save();
        
        notifyUser(targetUserId, { title: '💰 New Payment Collection Task', description: `You have been assigned to collect the advance payment (₹${project.advanceAmount?.toLocaleString('en-IN') || 'N/A'}) for project "${project.name}". Due: ${project.paymentDueDate ? new Date(project.paymentDueDate).toLocaleDateString('en-IN') : 'TBD'}.`, type: 'Info', relatedModel: 'Project', relatedId: project._id });
        
        await createNotification({ title: 'Staff Assigned for Payment Collection', description: `Staff assigned to collect advance payment for Project "${project.name}".`, type: 'Info', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });
        
        res.status(200).json({ success: true, data: project, message: 'Staff assigned and notified' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const clearProjectPayment = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        project.paymentStatus = 'Cleared';
        project.stage = 'Design';
        await project.save();
        
        await createNotification({ title: 'Payment Cleared', description: `Advance payment cleared for Project "${project.name}". Ready for Design.`, type: 'Success', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });
        
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPaymentAndRelease = async (req, res) => {
    try {
        const { projectId, collectedAmount, paymentNotes } = req.body;

        const project = await Project.findById(projectId).populate('quotation');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        if (project.stage !== 'Pending Payment' && project.stage !== 'Accounts' && project.paymentCollectionStatus !== 'Collected') {
            return res.status(400).json({ success: false, message: 'Project is not in a valid stage for payment verification' });
        }

        const tempDetails = project.tempCollectionDetails || {};
        const paid = tempDetails.amount || Number(collectedAmount) || project.advanceAmount || 0;
        const pMode = tempDetails.paymentMode || 'Bank Transfer';
        const ref = tempDetails.referenceNumber || '';
        const notes = tempDetails.paymentNotes || '';
        const staffId = tempDetails.collectedBy || req.user.id;

        let invoice = await Invoice.findOne({ project: projectId });
        if (!invoice) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            invoice = await Invoice.create({
                invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                client: project.client,
                project: project._id,
                quotation: project.quotation,
                dueDate: dueDate,
                items: [{ description: `Advance Payment Collection for ${project.name}`, quantity: 1, rate: paid, tax: 0, amount: paid }],
                subtotal: paid,
                totalTax: 0,
                grandTotal: paid,
                amountPaid: 0,
                status: 'Draft',
                createdBy: staffId
            });
        }

        let pModeVal = 'Other';
        if (pMode) {
            const lowerMode = pMode.toLowerCase();
            if (lowerMode.includes('cash')) pModeVal = 'Cash';
            else if (lowerMode.includes('transfer') || lowerMode.includes('bank') || lowerMode.includes('neft') || lowerMode.includes('rtgs')) pModeVal = 'Bank Transfer';
            else if (lowerMode.includes('cheque')) pModeVal = 'Cheque';
            else if (lowerMode.includes('upi') || lowerMode.includes('gpay') || lowerMode.includes('phone') || lowerMode.includes('paytm')) pModeVal = 'UPI';
            else if (lowerMode.includes('card')) pModeVal = 'Card';
        }

        await Payment.create({ project: project._id, invoice: invoice._id, client: project.client, amount: paid, paymentDate: new Date(), paymentMethod: pModeVal, transactionId: ref, reference: ref, notes: notes || 'Advance payment verified by manager', receivedBy: staffId });

        project.collectedAmount = (project.collectedAmount || 0) + paid;
        project.paymentStatus = project.collectedAmount >= project.budget ? 'Cleared' : (project.collectedAmount >= project.advanceAmount ? 'Cleared' : 'Partial Payment');
        project.paymentCollectionStatus = 'Verified';
        
        const originalStage = project.stage;
        if (originalStage === 'Accounts') project.stage = 'Design';
        else if (originalStage === 'Pending Payment') project.stage = 'Procurement';

        project.tempCollectionDetails = undefined;
        project.notes = (project.notes || '') + `\n[Payment Verified by Manager: ${req.user.fullName || 'Accounts Manager'}]${paymentNotes ? `\nNotes: ${paymentNotes}` : ''}`;
        await project.save();

        invoice.amountPaid = paid;
        invoice.status = paid >= invoice.grandTotal ? 'Paid' : 'Partially Paid';
        invoice.paymentDate = new Date();
        await invoice.save();

        if (originalStage === 'Accounts') {
            notifyByRole('Design Manager', { title: '🎨 Onboarding Payment Cleared', description: `Advance onboarding payment confirmed for "${project.name}". Ready for Design.`, type: 'Success', relatedModel: 'Project', relatedId: project._id });
        } else {
            notifyByRole('Procurement Manager', { title: '🚀 Advance Payment Cleared', description: `Advance payment confirmed for "${project.name}". Procurement can proceed without holds.`, type: 'Success', relatedModel: 'Project', relatedId: project._id });
        }

        await createNotification({ title: '✅ Advance Payment Verified', description: `Accounts Manager confirmed advance payment for "${project.name}". Project moved to ${originalStage === 'Accounts' ? 'Design' : 'Procurement'}.`, type: 'Success', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });

        res.status(200).json({ success: true, data: project, message: 'Payment verified. Project released.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const submitPaymentCollection = async (req, res) => {
    try {
        const { projectId, collectedAmount, paymentMode, referenceNumber, paymentNotes } = req.body;
        const project = await Project.findById(projectId).populate('assignedAccountsStaff');
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        project.paymentCollectionStatus = 'Collected';
        project.tempCollectionDetails = { amount: Number(collectedAmount) || project.advanceAmount || 0, paymentMode: paymentMode, referenceNumber: referenceNumber || '', paymentNotes: paymentNotes || '', collectedBy: req.user.id, collectedAt: new Date() };
        
        project.notes = (project.notes || '') + `\n[Payment Collected by Staff: ${req.user.fullName || 'Accounts Staff'}]\nMode: ${paymentMode || 'N/A'}\nReference: ${referenceNumber || 'N/A'}\nNotes: ${paymentNotes || 'None'}`;
        await project.save();
        
        const managers = await User.find({ role: 'Accounts Manager', status: 'Active' });
        const notificationText = `Payment of ₹${Number(collectedAmount).toLocaleString('en-IN')} collected for project "${project.name}" by ${req.user.fullName}. Ready for your verification and release.`;
        
        for (const manager of managers) {
            notifyUser(manager._id, { title: '💰 Payment Collected - Verify', description: notificationText, type: 'Success', relatedModel: 'Project', relatedId: project._id });
        }
        
        await createNotification({ title: 'Payment Collection Recorded', description: notificationText, type: 'Success', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });
        
        res.status(200).json({ success: true, data: project, message: 'Payment collection submitted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
