import Account from '../../models/accounts/Account.js';
import Voucher from '../../models/accounts/Voucher.js';
import Ledger from '../../models/accounts/Ledger.js';
import Transaction from '../../models/accounts/Transaction.js';

export const getDashboardStats = async () => {
    const accounts = await Account.find({ status: 'Active' });
    const cashBalance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReceipts = await Voucher.aggregate([
        { $match: { type: 'Receipt', status: 'Posted', date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const recentIncome = recentReceipts[0]?.total || 0;

    const recentPayments = await Voucher.aggregate([
        { $match: { type: 'Payment', status: 'Posted', date: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const recentExpenses = recentPayments[0]?.total || 0;

    const ledgers = await Ledger.find();
    const accountsReceivable = ledgers.filter(l => l.type === 'Customer').reduce((sum, l) => sum + (l.balanceDue || 0), 0);
    const accountsPayable = ledgers.filter(l => l.type === 'Vendor').reduce((sum, l) => sum + (l.balanceDue || 0), 0);

    // Get expense categories for charting
    const categoryBreakdown = await Voucher.aggregate([
        { $match: { type: 'Purchase', status: 'Posted' } },
        { $group: { _id: '$expenseCategory', amount: { $sum: '$amount' } } },
        { $sort: { amount: -1 } },
        { $limit: 10 }
    ]);

    return {
        cashBalance,
        recentIncome,
        recentExpenses,
        accountsReceivable,
        accountsPayable,
        categoryBreakdown
    };
};
