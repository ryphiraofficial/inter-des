const Expense = require('../models/Expense');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const { createNotification } = require('../utils/notificationHelper');

exports.getExpenses = async (req, res) => {
    try {
        const { project, type, status, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (project) query.project = project;
        if (type) query.type = type;
        if (status) query.paymentStatus = status;
        
        const skip = (page - 1) * limit;
        
        const expenses = await Expense.find(query)
            .populate('project', 'name projectNumber')
            .populate('vendor', 'name')
            .populate('createdBy', 'fullName')
            .sort({ expenseDate: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Expense.countDocuments(query);
        
        res.status(200).json({
            success: true,
            count: expenses.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createExpense = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        
        const expense = await Expense.create(req.body);
        
        await Project.findByIdAndUpdate(req.body.project, {
            $inc: { spent: req.body.amount }
        });
        
        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const oldExpense = await Expense.findById(req.params.id);
        
        if (!oldExpense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }
        
        const amountDiff = (req.body.amount || oldExpense.amount) - oldExpense.amount;
        
        if (amountDiff !== 0) {
            await Project.findByIdAndUpdate(oldExpense.project, {
                $inc: { spent: amountDiff }
            });
        }
        
        Object.assign(oldExpense, req.body);
        await oldExpense.save();
        
        res.status(200).json({
            success: true,
            data: oldExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }
        
        if (expense.project) {
            await Project.findByIdAndUpdate(expense.project, {
                $inc: { spent: -expense.amount }
            });
        }
        
        await expense.remove();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getPayments = async (req, res) => {
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
        
        res.status(200).json({
            success: true,
            count: payments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createPayment = async (req, res) => {
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
        
        await createNotification({
            title: 'Payment Received',
            description: `Payment of ₹${req.body.amount.toLocaleString('en-IN')} received.`,
            type: 'Invoice',
            relatedModel: 'Payment',
            relatedId: payment._id,
            createdBy: req.user.id
        });
        
        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProjectFinancials = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        
        const expenses = await Expense.find({ project: projectId });
        const payments = await Payment.find({ project: projectId });
        const invoices = await Invoice.find({ project: projectId });
        const project = await Project.findById(projectId);
        
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalInvoiced = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
        const totalReceived = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
        
        const profit = totalReceived - totalExpenses;
        const profitMargin = totalReceived > 0 ? ((profit / totalReceived) * 100).toFixed(2) : 0;
        
        res.status(200).json({
            success: true,
            data: {
                project: {
                    name: project?.name,
                    budget: project?.budget || 0,
                    spent: project?.spent || 0
                },
                expenses: {
                    total: totalExpenses,
                    byType: expenses.reduce((acc, e) => {
                        acc[e.type] = (acc[e.type] || 0) + e.amount;
                        return acc;
                    }, {}),
                    count: expenses.length
                },
                invoices: {
                    total: totalInvoiced,
                    received: totalReceived,
                    pending: totalInvoiced - totalReceived,
                    count: invoices.length
                },
                payments: {
                    total: totalPayments,
                    count: payments.length
                },
                profit: {
                    value: profit,
                    margin: parseFloat(profitMargin)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAccountsStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
        }

        // 1. Overall Totals
        const expensesResult = await Expense.aggregate([{ $match: dateFilter }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const paymentsResult = await Payment.aggregate([{ $match: dateFilter }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const invoicesResult = await Invoice.aggregate([{ $match: dateFilter }, { $group: { _id: null, grandTotal: { $sum: '$grandTotal' }, amountPaid: { $sum: '$amountPaid' } } }]);

        const totalExpenses = expensesResult[0]?.total || 0;
        const totalPayments = paymentsResult[0]?.total || 0;
        const totalInvoiced = invoicesResult[0]?.grandTotal || 0;
        const paidAmount = invoicesResult[0]?.amountPaid || 0;
        const pendingAmount = totalInvoiced - paidAmount;
        const cashBalance = totalPayments - totalExpenses;
        
        // Let's assume outstanding payables is some percentage or tracked by unpaid expenses if we had them. We'll default to 0 for now.
        const outstandingPayablesAmount = 0; 

        // 2. Trends (Current Month vs Last Month)
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentMonthRevenue = await Payment.aggregate([
            { $match: { createdAt: { $gte: currentMonthStart } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(res => res[0]?.total || 0);

        const previousMonthRevenue = await Payment.aggregate([
            { $match: { createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(res => res[0]?.total || 0);

        const revenueTrend = previousMonthRevenue === 0 ? (currentMonthRevenue > 0 ? 100 : 0) : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

        const currentMonthExpenses = await Expense.aggregate([
            { $match: { createdAt: { $gte: currentMonthStart } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(res => res[0]?.total || 0);

        const previousMonthExpenses = await Expense.aggregate([
            { $match: { createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(res => res[0]?.total || 0);

        const expenseTrend = previousMonthExpenses === 0 ? (currentMonthExpenses > 0 ? 100 : 0) : ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

        // 3. Invoice Status Counts
        const invoiceStatusCounts = await Invoice.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$grandTotal' } } }
        ]);
        
        const pendingInvoices = invoiceStatusCounts.filter(i => ['Unpaid', 'Partially Paid', 'Overdue'].includes(i._id)).reduce((acc, curr) => acc + curr.count, 0);
        const paidInvoicesCount = invoiceStatusCounts.find(i => i._id === 'Paid')?.count || 0;

        // 4. Cash Flow Data (Last 6 Months)
        const cashFlowData = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const monthName = start.toLocaleString('default', { month: 'short' });
            
            const inflow = await Payment.aggregate([
                { $match: { createdAt: { $gte: start, $lte: end } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).then(res => res[0]?.total || 0);
            
            const outflow = await Expense.aggregate([
                { $match: { createdAt: { $gte: start, $lte: end } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).then(res => res[0]?.total || 0);
            
            cashFlowData.push({ name: monthName, inflow, outflow });
        }

        // 5. Activity Feed
        const recentInvoices = await Invoice.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('client', 'name').lean();
        const recentPayments = await Payment.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('client', 'name').lean();
        const recentExpenses = await Expense.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('vendor', 'name').lean();

        const activityFeed = [
            ...recentInvoices.map(i => ({ _id: i._id, type: 'Invoice', title: `Invoice ${i.invoiceNumber} created`, amount: i.grandTotal, date: i.createdAt, status: i.status, entity: i.client?.name })),
            ...recentPayments.map(p => ({ _id: p._id, type: 'Payment', title: `Payment received`, amount: p.amount, date: p.createdAt, status: 'Completed', entity: p.client?.name })),
            ...recentExpenses.map(e => ({ _id: e._id, type: 'Expense', title: `Expense: ${e.type || 'General'}`, amount: e.amount, date: e.createdAt, status: e.paymentStatus || 'Paid', entity: e.vendor?.name }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        // 6. Upcoming Dues
        const upcomingInvoices = await Invoice.find({ status: { $in: ['Unpaid', 'Partially Paid'] }, dueDate: { $gte: new Date() } }).sort({ dueDate: 1 }).limit(5).populate('client', 'name').lean();

        // 7. Top Clients
        const topClients = await Invoice.aggregate([
            { $group: { _id: '$client', totalRevenue: { $sum: '$amountPaid' }, totalInvoiced: { $sum: '$grandTotal' } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'clients', localField: '_id', foreignField: '_id', as: 'clientInfo' } },
            { $unwind: { path: '$clientInfo', preserveNullAndEmptyArrays: true } },
            { $project: { name: '$clientInfo.name', totalRevenue: 1, totalInvoiced: 1 } }
        ]);

        const expensesByType = await Expense.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$type', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                totalExpenses,
                totalPayments,
                totalInvoiced,
                paidAmount,
                pendingAmount,
                cashBalance,
                outstandingPayablesAmount,
                pendingInvoices,
                paidInvoices: paidInvoicesCount,
                expensesByType,
                trends: {
                    revenue: revenueTrend.toFixed(1),
                    expenses: expenseTrend.toFixed(1)
                },
                cashFlowData,
                invoiceStatusCounts,
                activityFeed,
                upcomingDues: upcomingInvoices.map(i => ({ _id: i._id, title: `Invoice ${i.invoiceNumber}`, entity: i.client?.name, amount: i.grandTotal - (i.amountPaid || 0), dueDate: i.dueDate })),
                topClients
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPendingAccountsProjects = async (req, res) => {
    try {
        // Get projects in 'Accounts' stage OR any project needing payment collection
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

exports.assignAccountsStaff = async (req, res) => {
    try {
        const { projectId, staffId } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        const Staff = require('../models/Staff');
        const User = require('../models/User');

        let targetUserId = staffId;
        const staff = await Staff.findById(staffId);
        if (staff) {
            const userDoc = await User.findOne({
                $or: [
                    { staffId: staff.staffId },
                    { email: staff.email.toLowerCase() }
                ]
            });
            if (userDoc) {
                targetUserId = userDoc._id;
            }
        }

        project.assignedAccountsStaff = targetUserId;
        project.paymentCollectionStatus = 'Assigned';
        await project.save();
        
        // Notify the assigned staff
        const { notifyUser } = require('../utils/notificationHelper');
        notifyUser(targetUserId, {
            title: '💰 New Payment Collection Task',
            description: `You have been assigned to collect the advance payment (₹${project.advanceAmount?.toLocaleString('en-IN') || 'N/A'}) for project "${project.name}". Due: ${project.paymentDueDate ? new Date(project.paymentDueDate).toLocaleDateString('en-IN') : 'TBD'}.`,
            type: 'Info',
            relatedModel: 'Project',
            relatedId: project._id
        });
        
        await createNotification({
            title: 'Staff Assigned for Payment Collection',
            description: `Staff assigned to collect advance payment for Project "${project.name}".`,
            type: 'Info',
            relatedModel: 'Project',
            relatedId: project._id,
            createdBy: req.user.id
        });
        
        res.status(200).json({ success: true, data: project, message: 'Staff assigned and notified' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.generateAdvanceInvoice = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        const invoice = await Invoice.findOne({ project: projectId, status: 'Draft' });
        if (!invoice) return res.status(404).json({ success: false, message: 'Draft invoice not found' });
        
        invoice.status = 'Sent';
        await invoice.save();
        
        project.paymentStatus = 'Invoice Sent';
        await project.save();
        
        res.status(200).json({ success: true, message: 'Invoice marked as sent', data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.clearProjectPayment = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        project.paymentStatus = 'Cleared';
        project.stage = 'Design'; // Proceed to design
        await project.save();
        
        await createNotification({
            title: 'Payment Cleared',
            description: `Advance payment cleared for Project "${project.name}". Ready for Design.`,
            type: 'Success',
            relatedModel: 'Project',
            relatedId: project._id,
            createdBy: req.user.id
        });
        
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// NEW: Accounts Manager verifies advance payment received and releases project to Procurement
exports.verifyPaymentAndRelease = async (req, res) => {
    try {
        const { projectId, collectedAmount, paymentNotes } = req.body;

        const project = await Project.findById(projectId).populate('quotation');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        // Relax stage check to allow clearance when paymentCollectionStatus is 'Collected'
        if (project.stage !== 'Pending Payment' && project.stage !== 'Accounts' && project.paymentCollectionStatus !== 'Collected') {
            return res.status(400).json({ success: false, message: 'Project is not in a valid stage for payment verification' });
        }

        // Retrieve collection details from tempCollectionDetails if present, fallback to body params or advanceAmount
        const tempDetails = project.tempCollectionDetails || {};
        const paid = tempDetails.amount || Number(collectedAmount) || project.advanceAmount || 0;
        const pMode = tempDetails.paymentMode || 'Bank Transfer';
        const ref = tempDetails.referenceNumber || '';
        const notes = tempDetails.paymentNotes || '';
        const staffId = tempDetails.collectedBy || req.user.id;

        // 1. Find or create an invoice for this project so the Payment record can link to it
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
                items: [{
                    description: `Advance Payment Collection for ${project.name}`,
                    quantity: 1,
                    rate: paid,
                    tax: 0,
                    amount: paid
                }],
                subtotal: paid,
                totalTax: 0,
                grandTotal: paid,
                amountPaid: 0,
                status: 'Draft',
                createdBy: staffId
            });
        }

        // 2. Map payment mode string to PaymentSchema enum option
        let pModeVal = 'Other';
        if (pMode) {
            const lowerMode = pMode.toLowerCase();
            if (lowerMode.includes('cash')) pModeVal = 'Cash';
            else if (lowerMode.includes('transfer') || lowerMode.includes('bank') || lowerMode.includes('neft') || lowerMode.includes('rtgs')) pModeVal = 'Bank Transfer';
            else if (lowerMode.includes('cheque')) pModeVal = 'Cheque';
            else if (lowerMode.includes('upi') || lowerMode.includes('gpay') || lowerMode.includes('phone') || lowerMode.includes('paytm')) pModeVal = 'UPI';
            else if (lowerMode.includes('card')) pModeVal = 'Card';
        }

        // 3. Create the official Payment document
        await Payment.create({
            project: project._id,
            invoice: invoice._id,
            client: project.client,
            amount: paid,
            paymentDate: new Date(),
            paymentMethod: pModeVal,
            transactionId: ref,
            reference: ref,
            notes: notes || 'Advance payment verified by manager',
            receivedBy: staffId
        });

        // 4. Update project collection status and stage
        project.collectedAmount = (project.collectedAmount || 0) + paid;
        project.paymentStatus = project.collectedAmount >= project.budget ? 'Cleared' : (project.collectedAmount >= project.advanceAmount ? 'Cleared' : 'Partial Payment');
        project.paymentCollectionStatus = 'Verified';
        
        const originalStage = project.stage;
        if (originalStage === 'Accounts') {
            project.stage = 'Design';
        } else if (originalStage === 'Pending Payment') {
            project.stage = 'Procurement';
        } // if stage is Procurement/etc., keep it as is

        // Clear the temporary collection details
        project.tempCollectionDetails = undefined;

        if (paymentNotes) {
            project.notes = (project.notes || '') + `\n[Payment Verified by Manager: ${req.user.fullName || 'Accounts Manager'}]\nNotes: ${paymentNotes}`;
        } else {
            project.notes = (project.notes || '') + `\n[Payment Verified by Manager: ${req.user.fullName || 'Accounts Manager'}]`;
        }

        await project.save();

        // 5. Update Invoice status
        invoice.amountPaid = paid;
        invoice.status = paid >= invoice.grandTotal ? 'Paid' : 'Partially Paid';
        invoice.paymentDate = new Date();
        await invoice.save();

        // Notify respective department based on stage transition
        const { notifyByRole } = require('../utils/notificationHelper');
        if (originalStage === 'Accounts') {
            notifyByRole('Design Manager', {
                title: '🎨 Onboarding Payment Cleared',
                description: `Advance onboarding payment confirmed for "${project.name}". Ready for Design.`,
                type: 'Success',
                relatedModel: 'Project',
                relatedId: project._id
            });
        } else {
            notifyByRole('Procurement Manager', {
                title: '🚀 Advance Payment Cleared',
                description: `Advance payment confirmed for "${project.name}". Procurement can proceed without holds.`,
                type: 'Success',
                relatedModel: 'Project',
                relatedId: project._id
            });
        }

        await createNotification({
            title: '✅ Advance Payment Verified',
            description: `Accounts Manager confirmed advance payment for "${project.name}". Project moved to ${originalStage === 'Accounts' ? 'Design' : 'Procurement'}.`,
            type: 'Success',
            relatedModel: 'Project',
            relatedId: project._id,
            createdBy: req.user.id
        });

        res.status(200).json({ success: true, data: project, message: 'Payment verified. Project released.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Submit payment collection details by Accounts Staff
// @route   POST /api/accounts/projects/collect
// @access  Private (Staff, Accounts Manager, Admin)
exports.submitPaymentCollection = async (req, res) => {
    try {
        const { projectId, collectedAmount, paymentMode, referenceNumber, paymentNotes } = req.body;
        const project = await Project.findById(projectId).populate('assignedAccountsStaff');
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        project.paymentCollectionStatus = 'Collected';
        project.collectedAmount = Number(collectedAmount) || project.advanceAmount;
        
        // Save collection details temporarily on the project
        project.tempCollectionDetails = {
            amount: Number(collectedAmount) || project.advanceAmount || 0,
            paymentMode: paymentMode,
            referenceNumber: referenceNumber || '',
            paymentNotes: paymentNotes || '',
            collectedBy: req.user.id,
            collectedAt: new Date()
        };
        
        const noteDetails = `\n[Payment Collected by Staff: ${req.user.fullName || 'Accounts Staff'}]\nMode: ${paymentMode || 'N/A'}\nReference: ${referenceNumber || 'N/A'}\nNotes: ${paymentNotes || 'None'}`;
        project.notes = (project.notes || '') + noteDetails;
        
        await project.save();
        
        // Notify Accounts Managers & Admins
        const User = require('../models/User');
        const managers = await User.find({ role: 'Accounts Manager', status: 'Active' });
        const { notifyUser } = require('../utils/notificationHelper');
        
        const notificationText = `Payment of ₹${Number(collectedAmount).toLocaleString('en-IN')} collected for project "${project.name}" by ${req.user.fullName}. Ready for your verification and release.`;
        
        for (const manager of managers) {
            notifyUser(manager._id, {
                title: '💰 Payment Collected - Verify',
                description: notificationText,
                type: 'Success',
                relatedModel: 'Project',
                relatedId: project._id
            });
        }
        
        await createNotification({
            title: 'Payment Collection Recorded',
            description: notificationText,
            type: 'Success',
            relatedModel: 'Project',
            relatedId: project._id,
            createdBy: req.user.id
        });
        
        res.status(200).json({ success: true, data: project, message: 'Payment collection submitted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
