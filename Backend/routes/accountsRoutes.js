const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getExpenses, createExpense, updateExpense, getPayments, createPayment, getProjectFinancials, getAccountsStats, getPendingAccountsProjects, assignAccountsStaff, generateAdvanceInvoice, clearProjectPayment, verifyPaymentAndRelease, submitPaymentCollection } = require('../controllers/accountsController');

router.use(protect);

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
    .put(updateExpense);

router.route('/payments')
    .get(getPayments)
    .post(createPayment);

router.route('/project/:projectId/financials')
    .get(getProjectFinancials);

router.route('/stats')
    .get(getAccountsStats);

module.exports = router;
