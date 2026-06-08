import express from 'express';
import { getClientProjectsList, getClientProject, getClientQuotations, getClientInvoices, getClientPayments, getClientWorkingMembers, getClientGroupUpdates, getClientDocuments } from '../../controllers/shared/clientPortalController.js';
import { protectClient } from '../../middleware/clientAuth.js';

const router = express.Router();

// Apply client protection middleware to all routes in this file
router.use(protectClient);

router.get('/projects-list', getClientProjectsList);
router.get('/project', getClientProject);
router.get('/quotations', getClientQuotations);
router.get('/invoices', getClientInvoices);
router.get('/payments', getClientPayments);
router.get('/members', getClientWorkingMembers);
router.get('/updates', getClientGroupUpdates);
router.get('/documents', getClientDocuments);

export default router;
