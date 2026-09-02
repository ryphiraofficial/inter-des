import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });
if (!process.env.MONGO_URI) dotenv.config();

import User from '../models/admin/User.js';
import Account from '../models/accounts/Account.js';
import Ledger from '../models/accounts/Ledger.js';
import Voucher from '../models/accounts/Voucher.js';
import Transaction from '../models/accounts/Transaction.js';

import Client from '../models/sales/Client.js';
import Project from '../models/design/Project.js';
import Program from '../models/accounts/Program.js';

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://ryphira:ryphira@cluster0.vhnowt2.mongodb.net/InteriorSoftware?appName=Cluster0';

const seed = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for Seeding Accounts Test Data...');

        const adminUser = await User.findOne({ role: { $in: ['Admin', 'Super Admin', 'Accounts Manager'] } });
        if (!adminUser) {
            console.error('No admin user found to link createdBy');
            process.exit(1);
        }

        // Seed Clients
        console.log('Seeding Clients...');
        let apexClient = await Client.findOne({ name: 'Apex Interior Solutions' });
        if (!apexClient) {
            apexClient = await Client.create({
                name: 'Apex Interior Solutions',
                email: 'contact@apexinteriors.com',
                phone: '9876543210',
                createdBy: adminUser._id
            });
        }

        let greenfieldClient = await Client.findOne({ name: 'Greenfield Heights Residency' });
        if (!greenfieldClient) {
            greenfieldClient = await Client.create({
                name: 'Greenfield Heights Residency',
                email: 'info@greenfieldheights.com',
                phone: '9876543211',
                createdBy: adminUser._id
            });
        }

        // 0. Seed Test Programs
        console.log('Seeding Test Programs...');
        await Program.deleteMany({});
        let projects = await Project.find();

        for (let i = 0; i < projects.length; i++) {
            const proj = projects[i];
            await Program.create({
                programNumber: `PRG-2026-0000${i + 1}`,
                project: proj._id,
                client: proj.client || null,
                clientAmountPaid: proj.collectedAmount || (i === 0 ? 250000 : 180000),
                projectExpenses: i === 0 ? 120000 : 45000,
                balanceDue: proj.advanceAmount ? Math.max(0, proj.advanceAmount - (proj.collectedAmount || 0)) : 0,
                clearanceStatus: i === 0 ? 'Pending' : 'Cleared For Procurement',
                createdBy: adminUser._id
            });
        }

        // 1. Seed Accounts
        console.log('Seeding Accounts...');
        await Account.deleteMany({});
        const hdfc = await Account.create({
            accountNumber: 'ACC-0001',
            name: 'HDFC Corporate Main Bank',
            type: 'Bank',
            bankDetails: { accountNumber: '50100293849182', ifscCode: 'HDFC0001294', branchName: 'MG Road Branch' },
            openingBalance: 1550000,
            currentBalance: 1550000,
            status: 'Active',
            createdBy: adminUser._id
        });

        const icici = await Account.create({
            accountNumber: 'ACC-0002',
            name: 'ICICI Operations Account',
            type: 'Bank',
            bankDetails: { accountNumber: '002910482910', ifscCode: 'ICIC0000291', branchName: 'Indiranagar' },
            openingBalance: 820000,
            currentBalance: 820000,
            status: 'Active',
            createdBy: adminUser._id
        });

        const pettyCash = await Account.create({
            accountNumber: 'ACC-0003',
            name: 'Office Petty Cash Drawer',
            type: 'Cash',
            openingBalance: 45000,
            currentBalance: 45000,
            status: 'Active',
            createdBy: adminUser._id
        });

        // 2. Seed Ledgers
        console.log('Seeding Ledgers...');
        await Ledger.deleteMany({});
        const client1 = await Ledger.create({
            ledgerNumber: 'LDG-0001',
            name: 'Apex Interior Solutions (Client)',
            type: 'Customer',
            linkedClient: apexClient._id,
            openingBalance: 350000, // Initial invoice bill of 3,50,000 Dr
            balanceDue: 350000,
            status: 'Active',
            createdBy: adminUser._id
        });

        const client2 = await Ledger.create({
            ledgerNumber: 'LDG-0002',
            name: 'Greenfield Heights Residency',
            type: 'Customer',
            linkedClient: greenfieldClient._id,
            openingBalance: 300000, // Initial invoice bill of 3,00,000 Dr
            balanceDue: 300000,
            status: 'Active',
            createdBy: adminUser._id
        });

        const vendor1 = await Ledger.create({
            ledgerNumber: 'LDG-0003',
            name: 'Supreme Plywoods Ltd',
            type: 'Vendor',
            balanceDue: 85000,
            status: 'Active',
            createdBy: adminUser._id
        });

        const vendor2 = await Ledger.create({
            ledgerNumber: 'LDG-0004',
            name: 'Rehau Laminates & EdgeBands',
            type: 'Vendor',
            balanceDue: 45000,
            status: 'Active',
            createdBy: adminUser._id
        });

        // 3. Seed Vouchers & Transactions
        console.log('Seeding Vouchers & Transactions...');
        await Voucher.deleteMany({});
        await Transaction.deleteMany({});

        // Voucher 1: Receipt from Apex
        const v1 = await Voucher.create({
            voucherNumber: 'RCP-2026-00001',
            type: 'Receipt',
            ledger: client1._id,
            account: hdfc._id,
            amount: 250000,
            paymentMode: 'Bank Transfer',
            reference: 'UTR9482019482',
            notes: 'Advance receipt for commercial interior phase 1',
            date: new Date('2026-08-15'),
            status: 'Posted',
            createdBy: adminUser._id
        });

        await Transaction.create({
            transactionNumber: 'TRX-2026-00001',
            account: hdfc._id,
            voucher: v1._id,
            type: 'Debit',
            amount: 250000,
            reference: 'UTR9482019482',
            description: 'Advance receipt for commercial interior phase 1',
            date: new Date('2026-08-15'),
            status: 'Completed',
            createdBy: adminUser._id
        });

        // Voucher 2: Receipt from Greenfield
        const v2 = await Voucher.create({
            voucherNumber: 'RCP-2026-00002',
            type: 'Receipt',
            ledger: client2._id,
            account: icici._id,
            amount: 180000,
            paymentMode: 'UPI',
            reference: 'UPI/6192849182/Apex',
            notes: 'Part payment for modular kitchen',
            date: new Date('2026-08-20'),
            status: 'Posted',
            createdBy: adminUser._id
        });

        await Transaction.create({
            transactionNumber: 'TRX-2026-00002',
            account: icici._id,
            voucher: v2._id,
            type: 'Debit',
            amount: 180000,
            reference: 'UPI/6192849182/Apex',
            description: 'Part payment for modular kitchen',
            date: new Date('2026-08-20'),
            status: 'Completed',
            createdBy: adminUser._id
        });

        // Voucher 3: Purchase from Supreme Plywoods
        const v3 = await Voucher.create({
            voucherNumber: 'PUR-2026-00001',
            type: 'Purchase',
            ledger: vendor1._id,
            amount: 120000,
            expenseCategory: 'Material',
            notes: 'Plywood sheets 18mm Commercial Grade - 100 Units',
            date: new Date('2026-08-22'),
            status: 'Posted',
            createdBy: adminUser._id
        });

        // Voucher 4: Payment to Supreme Plywoods
        const v4 = await Voucher.create({
            voucherNumber: 'PMT-2026-00001',
            type: 'Payment',
            ledger: vendor1._id,
            account: hdfc._id,
            amount: 120000,
            paymentMode: 'Bank Transfer',
            reference: 'NEFT-HDFC-99182',
            notes: 'Full payment for plywood PO #1092',
            date: new Date('2026-08-25'),
            status: 'Posted',
            createdBy: adminUser._id
        });

        await Transaction.create({
            transactionNumber: 'TRX-2026-00003',
            account: hdfc._id,
            voucher: v4._id,
            type: 'Credit',
            amount: 120000,
            reference: 'NEFT-HDFC-99182',
            description: 'Full payment for plywood PO #1092',
            date: new Date('2026-08-25'),
            status: 'Completed',
            createdBy: adminUser._id
        });

        // Voucher 5: Purchase from Rehau
        const v5 = await Voucher.create({
            voucherNumber: 'PUR-2026-00002',
            type: 'Purchase',
            ledger: vendor2._id,
            amount: 45000,
            expenseCategory: 'Material',
            notes: 'Rehau EdgeBands 22x2mm White Oak - 5 Rolls',
            date: new Date('2026-08-28'),
            status: 'Posted',
            createdBy: adminUser._id
        });

        console.log('Seeding completed successfully!');
        mongoose.disconnect();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();
