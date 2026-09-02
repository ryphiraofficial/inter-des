import express from 'express';
const router = express.Router();
import { protect, authorize } from '../../middleware/auth.js';

// Import new controllers
import {
    addAccount, fetchAccounts,
    addLedger, fetchLedgers,
    addVoucher, fetchVouchers, cancelVoucherRecord,
    fetchPrograms, syncProjectToProgram, clearProgramForProcurement,
    fetchStats
} from '../../controllers/accounts/accountsController.js';

// Import old controllers for backwards compatibility and integration as requested by user
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../../controllers/accounts/accountsExpenseController.js';
import { getPayments, createPayment, getPendingAccountsProjects, assignAccountsStaff, clearProjectPayment, verifyPaymentAndRelease, submitPaymentCollection } from '../../controllers/accounts/accountsPaymentController.js';
import { generateAdvanceInvoice } from '../../controllers/accounts/accountsInvoiceController.js';
import { getProjectFinancials, getAccountsStats as oldGetAccountsStats } from '../../controllers/accounts/accountsStatsController.js';
import { getAccountsPerformance } from '../../controllers/accounts/accountsPerformanceController.js';

router.use(protect);

// --- NEW V2 ROUTES (Ledgers, Vouchers, Accounts, Programs) ---
router.route('/v2/accounts')
    .get(fetchAccounts)
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), addAccount);

router.route('/v2/ledgers')
    .get(fetchLedgers)
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), addLedger);

router.route('/v2/vouchers')
    .get(fetchVouchers)
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), addVoucher);

router.route('/v2/vouchers/:id/cancel')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), cancelVoucherRecord);

router.route('/v2/programs')
    .get(fetchPrograms)
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), syncProjectToProgram);

router.route('/v2/programs/:id/clear')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), clearProgramForProcurement);

router.route('/v2/stats')
    .get(fetchStats);

// --- OLD ROUTES (Retained for compatibility) ---
router.route('/performance')
    .get(getAccountsPerformance);

router.route('/projects/pending')
    .get(getPendingAccountsProjects);

router.route('/projects/assign')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), assignAccountsStaff);

router.route('/projects/invoice/advance')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), generateAdvanceInvoice);

router.route('/projects/clear')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), clearProjectPayment);

router.route('/projects/verify-payment')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), verifyPaymentAndRelease);

router.route('/projects/collect')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), submitPaymentCollection);

router.route('/expenses')
    .get(getExpenses)
    .post(createExpense);

router.route('/expenses/:id')
    .put(updateExpense)
    .delete(deleteExpense);

router.route('/payments')
    .get(getPayments)
    .post(createPayment);

router.route('/project/:projectId/financials')
    .get(getProjectFinancials);

router.route('/stats')
    .get(oldGetAccountsStats);

export default router;
