import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Import Models
import Project from '../models/design/Project.js';
import Payment from '../models/accounts/Payment.js';
import Expense from '../models/accounts/Expense.js';
import User from '../models/admin/User.js';

import Account from '../models/accounts/Account.js';
import Ledger from '../models/accounts/Ledger.js';
import Program from '../models/accounts/Program.js';
import Voucher from '../models/accounts/Voucher.js';
import Transaction from '../models/accounts/Transaction.js';

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const dryRun = process.argv.includes('--dry-run');
        if (dryRun) console.log('--- DRY RUN MODE ---');

        const systemUser = await User.findOne({ role: 'Admin' });
        if (!systemUser) throw new Error('No Admin user found for createdBy refs');

        // Create Default Bank Account
        let defaultAccount = await Account.findOne({ name: 'Main Corporate Bank' });
        if (!defaultAccount) {
            defaultAccount = new Account({
                name: 'Main Corporate Bank',
                type: 'Bank',
                currency: 'INR',
                createdBy: systemUser._id
            });
            if (!dryRun) await defaultAccount.save();
            console.log(`Created Default Bank Account: ${defaultAccount.name}`);
        }

        // Migrate Projects -> Programs
        const projects = await Project.find().populate('client');
        console.log(`Found ${projects.length} Projects to migrate to Programs...`);
        let programsCreated = 0;

        for (const proj of projects) {
            let program = await Program.findOne({ project: proj._id });
            if (!program) {
                program = new Program({
                    project: proj._id,
                    client: proj.client?._id || null, // client might be null if legacy
                    clientAmountPaid: proj.collectedAmount || 0,
                    projectExpenses: proj.spent || 0, // 'spent' might not exist, but mapping to expenses
                    balanceDue: proj.advanceAmount ? (proj.advanceAmount - (proj.collectedAmount || 0)) : 0,
                    status: proj.status === 'Completed' ? 'Completed' : 'Active',
                    clearanceStatus: proj.paymentStatus === 'Cleared' ? 'Cleared For Procurement' : 'Pending',
                    createdBy: systemUser._id
                });
                if (!dryRun) await program.save();
                programsCreated++;
            }
        }
        console.log(`Programs created: ${programsCreated}`);

        // Migrate Payments -> Receipt Vouchers
        const payments = await Payment.find().populate('project').populate('client');
        console.log(`Found ${payments.length} Payments to migrate to Receipt Vouchers...`);
        let receiptsCreated = 0;

        for (const pmt of payments) {
            // Find/Create Ledger for Client
            let ledger = null;
            if (pmt.client) {
                ledger = await Ledger.findOne({ linkedClient: pmt.client._id });
                if (!ledger) {
                    ledger = new Ledger({
                        name: `${pmt.client.name} (Client)`,
                        type: 'Customer',
                        linkedClient: pmt.client._id,
                        createdBy: systemUser._id
                    });
                    if (!dryRun) await ledger.save();
                }
            } else {
                // Legacy payments without a client -> general ledger
                ledger = await Ledger.findOne({ name: 'General Customer Ledger' });
                if (!ledger) {
                    ledger = new Ledger({
                        name: 'General Customer Ledger',
                        type: 'Customer',
                        createdBy: systemUser._id
                    });
                    if (!dryRun) await ledger.save();
                }
            }

            const program = await Program.findOne({ project: pmt.project?._id });

            const voucher = new Voucher({
                type: 'Receipt',
                ledger: ledger._id,
                program: program?._id,
                account: defaultAccount._id,
                amount: pmt.amount,
                paymentMode: pmt.paymentMethod,
                reference: pmt.reference || pmt.transactionId,
                notes: pmt.notes,
                date: pmt.paymentDate,
                status: 'Posted',
                createdBy: pmt.receivedBy || systemUser._id
            });

            if (!dryRun) {
                await voucher.save();
                
                // Create Transaction
                await Transaction.create({
                    account: defaultAccount._id,
                    voucher: voucher._id,
                    type: 'Debit',
                    amount: pmt.amount,
                    reference: pmt.reference,
                    description: `Migrated Payment: ${pmt.notes || ''}`,
                    date: pmt.paymentDate,
                    createdBy: pmt.receivedBy || systemUser._id
                });
                
                // Update Ledger balance
                ledger.balanceDue = (ledger.balanceDue || 0) - pmt.amount;
                await ledger.save();
                
                // Update Default Account balance
                defaultAccount.currentBalance = (defaultAccount.currentBalance || 0) + pmt.amount;
                await defaultAccount.save();
            }
            receiptsCreated++;
        }
        console.log(`Receipts created: ${receiptsCreated}`);

        // Migrate Expenses -> Purchase Vouchers (and Payment Vouchers if paid)
        const expenses = await Expense.find().populate('vendor');
        console.log(`Found ${expenses.length} Expenses to migrate to Purchase Vouchers...`);
        let purchasesCreated = 0;

        for (const exp of expenses) {
            let ledger = null;
            if (exp.vendor) {
                ledger = await Ledger.findOne({ linkedVendor: exp.vendor._id });
                if (!ledger) {
                    ledger = new Ledger({
                        name: `${exp.vendor.name} (Vendor)`,
                        type: 'Vendor',
                        linkedVendor: exp.vendor._id,
                        createdBy: systemUser._id
                    });
                    if (!dryRun) await ledger.save();
                }
            } else {
                // General Vendor Ledger
                ledger = await Ledger.findOne({ name: 'General Vendor Ledger' });
                if (!ledger) {
                    ledger = new Ledger({
                        name: 'General Vendor Ledger',
                        type: 'Vendor',
                        createdBy: systemUser._id
                    });
                    if (!dryRun) await ledger.save();
                }
            }

            const program = exp.project ? await Program.findOne({ project: exp.project }) : null;

            // Create Purchase Voucher (The Expense Booking)
            const purchaseVoucher = new Voucher({
                type: 'Purchase',
                ledger: ledger._id,
                program: program?._id,
                amount: exp.amount,
                expenseCategory: exp.type,
                notes: exp.description,
                date: exp.expenseDate,
                status: 'Posted',
                createdBy: exp.createdBy || systemUser._id
            });

            if (!dryRun) {
                await purchaseVoucher.save();
                ledger.balanceDue = (ledger.balanceDue || 0) + exp.amount;
                await ledger.save();
            }
            purchasesCreated++;

            // Create Payment Voucher if paid
            if (exp.paymentStatus === 'Paid' || exp.paidAmount > 0) {
                const paidAmount = exp.paymentStatus === 'Paid' ? exp.amount : exp.paidAmount;
                const paymentVoucher = new Voucher({
                    type: 'Payment',
                    ledger: ledger._id,
                    program: program?._id,
                    account: defaultAccount._id,
                    amount: paidAmount,
                    notes: `Payment for Expense ${exp.description}`,
                    date: exp.paymentDate || exp.expenseDate,
                    status: 'Posted',
                    createdBy: exp.createdBy || systemUser._id
                });

                if (!dryRun) {
                    await paymentVoucher.save();
                    
                    // Create Transaction
                    await Transaction.create({
                        account: defaultAccount._id,
                        voucher: paymentVoucher._id,
                        type: 'Credit',
                        amount: paidAmount,
                        description: `Migrated Expense Payment: ${exp.description}`,
                        date: exp.paymentDate || exp.expenseDate,
                        createdBy: exp.createdBy || systemUser._id
                    });
                    
                    // Update Ledger balance
                    ledger.balanceDue = (ledger.balanceDue || 0) - paidAmount;
                    await ledger.save();
                    
                    // Update Default Account balance
                    defaultAccount.currentBalance = (defaultAccount.currentBalance || 0) - paidAmount;
                    await defaultAccount.save();
                }
            }
        }
        console.log(`Purchases created: ${purchasesCreated}`);

        console.log('Migration Completed.');
        mongoose.disconnect();

    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
