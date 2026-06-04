import Expense from '../../models/accounts/Expense.js';
import Payment from '../../models/accounts/Payment.js';
import Invoice from '../../models/sales/Invoice.js';
import Project from '../../models/design/Project.js';

export const getProjectFinancials = async (req, res) => {
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
                project: { name: project?.name, budget: project?.budget || 0, spent: project?.spent || 0 },
                expenses: { total: totalExpenses, byType: expenses.reduce((acc, e) => { acc[e.type] = (acc[e.type] || 0) + e.amount; return acc; }, {}), count: expenses.length },
                invoices: { total: totalInvoiced, received: totalReceived, pending: totalInvoiced - totalReceived, count: invoices.length },
                payments: { total: totalPayments, count: payments.length },
                profit: { value: profit, margin: parseFloat(profitMargin) }
            }
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getAccountsStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        if (startDate && endDate) dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };

        const expensesResult = await Expense.aggregate([{ $match: dateFilter }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const paymentsResult = await Payment.aggregate([{ $match: dateFilter }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const invoicesResult = await Invoice.aggregate([{ $match: dateFilter }, { $group: { _id: null, grandTotal: { $sum: '$grandTotal' }, amountPaid: { $sum: '$amountPaid' } } }]);

        const totalExpenses = expensesResult[0]?.total || 0;
        const totalPayments = paymentsResult[0]?.total || 0;
        const totalInvoiced = invoicesResult[0]?.grandTotal || 0;
        const paidAmount = invoicesResult[0]?.amountPaid || 0;
        const pendingAmount = totalInvoiced - paidAmount;
        const cashBalance = totalPayments - totalExpenses;
        const outstandingPayablesAmount = 0; 

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentMonthRevenue = await Payment.aggregate([{ $match: { createdAt: { $gte: currentMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0);
        const previousMonthRevenue = await Payment.aggregate([{ $match: { createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0);
        const revenueTrend = previousMonthRevenue === 0 ? (currentMonthRevenue > 0 ? 100 : 0) : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

        const currentMonthExpenses = await Expense.aggregate([{ $match: { createdAt: { $gte: currentMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0);
        const previousMonthExpenses = await Expense.aggregate([{ $match: { createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0);
        const expenseTrend = previousMonthExpenses === 0 ? (currentMonthExpenses > 0 ? 100 : 0) : ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

        const invoiceStatusCounts = await Invoice.aggregate([{ $match: dateFilter }, { $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$grandTotal' } } }]);
        const pendingInvoices = invoiceStatusCounts.filter(i => ['Unpaid', 'Partially Paid', 'Overdue'].includes(i._id)).reduce((acc, curr) => acc + curr.count, 0);
        const paidInvoicesCount = invoiceStatusCounts.find(i => i._id === 'Paid')?.count || 0;

        const cashFlowData = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const monthName = start.toLocaleString('default', { month: 'short' });
            const inflow = await Payment.aggregate([{ $match: { createdAt: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0);
            const outflow = await Expense.aggregate([{ $match: { createdAt: { $gte: start, $lte: end } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).then(res => res[0]?.total || 0);
            cashFlowData.push({ name: monthName, inflow, outflow });
        }

        const recentInvoices = await Invoice.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('client', 'name').lean();
        const recentPayments = await Payment.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('client', 'name').lean();
        const recentExpenses = await Expense.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate('vendor', 'name').lean();

        const activityFeed = [
            ...recentInvoices.map(i => ({ _id: i._id, type: 'Invoice', title: `Invoice ${i.invoiceNumber} created`, amount: i.grandTotal, date: i.createdAt, status: i.status, entity: i.client?.name })),
            ...recentPayments.map(p => ({ _id: p._id, type: 'Payment', title: `Payment received`, amount: p.amount, date: p.createdAt, status: 'Completed', entity: p.client?.name })),
            ...recentExpenses.map(e => ({ _id: e._id, type: 'Expense', title: `Expense: ${e.type || 'General'}`, amount: e.amount, date: e.createdAt, status: e.paymentStatus || 'Paid', entity: e.vendor?.name }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        const upcomingInvoices = await Invoice.find({ status: { $in: ['Unpaid', 'Partially Paid'] }, dueDate: { $gte: new Date() } }).sort({ dueDate: 1 }).limit(5).populate('client', 'name').lean();
        
        const topClients = await Invoice.aggregate([{ $group: { _id: '$client', totalRevenue: { $sum: '$amountPaid' }, totalInvoiced: { $sum: '$grandTotal' } } }, { $sort: { totalRevenue: -1 } }, { $limit: 5 }, { $lookup: { from: 'clients', localField: '_id', foreignField: '_id', as: 'clientInfo' } }, { $unwind: { path: '$clientInfo', preserveNullAndEmptyArrays: true } }, { $project: { name: '$clientInfo.name', totalRevenue: 1, totalInvoiced: 1 } }]);
        const expensesByType = await Expense.aggregate([{ $match: dateFilter }, { $group: { _id: '$type', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]);
        
        res.status(200).json({
            success: true,
            data: {
                totalExpenses, totalPayments, totalInvoiced, paidAmount, pendingAmount, cashBalance, outstandingPayablesAmount, pendingInvoices, paidInvoices: paidInvoicesCount, expensesByType, trends: { revenue: revenueTrend.toFixed(1), expenses: expenseTrend.toFixed(1) }, cashFlowData, invoiceStatusCounts, activityFeed, upcomingDues: upcomingInvoices.map(i => ({ _id: i._id, title: `Invoice ${i.invoiceNumber}`, entity: i.client?.name, amount: i.grandTotal - (i.amountPaid || 0), dueDate: i.dueDate })), topClients
            }
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
