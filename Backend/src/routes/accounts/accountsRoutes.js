import express from 'express';
const router = express.Router();
import { protect, authorize } from '../../middleware/auth.js';

import { getExpenses, createExpense, updateExpense, deleteExpense } from '../../controllers/accounts/accountsExpenseController.js';
import { getPayments, createPayment, getPendingAccountsProjects, assignAccountsStaff, clearProjectPayment, verifyPaymentAndRelease, submitPaymentCollection } from '../../controllers/accounts/accountsPaymentController.js';
import { generateAdvanceInvoice } from '../../controllers/accounts/accountsInvoiceController.js';
import { getProjectFinancials, getAccountsStats } from '../../controllers/accounts/accountsStatsController.js';
import { getAccountsPerformance } from '../../controllers/accounts/accountsPerformanceController.js';

router.use(protect);

router.route('/performance')
    .get(getAccountsPerformance);

router.route('/projects/pending')
    .get(getPendingAccountsProjects);

router.route('/projects/assign')
    .post(authorize('Admin', 'Accounts Manager'), assignAccountsStaff);

router.route('/projects/invoice/advance')
    .post(authorize('Admin', 'Accounts Manager', 'Accounts Staff'), generateAdvanceInvoice);

router.route('/projects/clear')
    .post(authorize('Admin', 'Accounts Manager'), clearProjectPayment);

router.route('/projects/verify-payment')
    .post(authorize('Admin', 'Accounts Manager'), verifyPaymentAndRelease);

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
    .get(getAccountsStats);

export default router;
