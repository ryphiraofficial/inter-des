import Account from '../../models/accounts/Account.js';
import Transaction from '../../models/accounts/Transaction.js';

export const createAccount = async (data, userId) => {
    const account = await Account.create({
        ...data,
        createdBy: userId
    });
    return account;
};

export const getAccounts = async (filters = {}) => {
    return await Account.find(filters).sort({ name: 1 });
};

export const getAccountById = async (accountId) => {
    return await Account.findById(accountId);
};

export const recalculateAccountBalance = async (accountId) => {
    const account = await Account.findById(accountId);
    if (!account) return 0;

    const transactions = await Transaction.find({ account: accountId, status: 'Completed' });
    let balance = account.openingBalance || 0;
    
    // Debit = Money IN, Credit = Money OUT
    for (const trx of transactions) {
        if (trx.type === 'Debit') balance += trx.amount; // Money IN
        if (trx.type === 'Credit') balance -= trx.amount; // Money OUT
    }

    account.currentBalance = balance;
    await account.save();
    return balance;
};
