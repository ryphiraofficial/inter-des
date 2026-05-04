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
