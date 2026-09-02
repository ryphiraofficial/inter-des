import mongoose from 'mongoose';
import Voucher from '../../models/accounts/Voucher.js';
import Transaction from '../../models/accounts/Transaction.js';
import { recalculateAccountBalance } from './accountService.js';
import { recalculateLedgerBalance } from './ledgerService.js';
import { recalculateProgramBalances } from './programService.js';

export const createVoucher = async (data, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create the voucher
        const voucher = new Voucher({
            ...data,
            createdBy: userId
        });

        await voucher.save({ session });

        // If it involves an account (Receipt / Payment), create a Transaction
        if (data.account && (data.type === 'Receipt' || data.type === 'Payment')) {
            const transactionType = data.type === 'Receipt' ? 'Debit' : 'Credit'; // Debit account for incoming, Credit for outgoing

            const transaction = new Transaction({
                account: data.account,
                voucher: voucher._id,
                type: transactionType,
                amount: data.amount,
                reference: data.reference,
                description: data.notes || `Voucher ${voucher.type}`,
                date: data.date || Date.now(),
                createdBy: userId
            });

            await transaction.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        // Recalculate balances out of transaction for simplicity
        if (data.account) await recalculateAccountBalance(data.account);
        if (data.ledger) await recalculateLedgerBalance(data.ledger);
        if (data.program) await recalculateProgramBalances(data.program);

        return voucher;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getVouchers = async (filters = {}) => {
    return await Voucher.find(filters)
        .populate('ledger', 'name type')
        .populate('program', 'programNumber')
        .populate('account', 'name')
        .sort({ date: -1 });
};

export const cancelVoucher = async (voucherId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const voucher = await Voucher.findById(voucherId);
        if (!voucher || voucher.status === 'Cancelled') {
            throw new Error('Voucher not found or already cancelled');
        }

        voucher.status = 'Cancelled';
        await voucher.save({ session });

        // Reverse transaction if exists
        const transaction = await Transaction.findOne({ voucher: voucherId });
        if (transaction) {
            transaction.status = 'Reversed';
            await transaction.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        if (transaction && transaction.account) await recalculateAccountBalance(transaction.account);
        if (voucher.ledger) await recalculateLedgerBalance(voucher.ledger);
        if (voucher.program) await recalculateProgramBalances(voucher.program);

        return voucher;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
