import express from 'express';
import { protect } from '../../middleware/auth.js';
import * as ctrl from '../../controllers/libraryController.js';

const router = express.Router();
router.use(protect);

// Brands
router.get('/brands', ctrl.getBrands);
router.post('/brands', ctrl.createBrand);

// Lamination Items
router.get('/lamination-items', ctrl.getLaminationItems);
router.get('/lamination-items/lookup', ctrl.lookupLamination);
router.post('/lamination-items', ctrl.createLaminationItem);
router.get('/lamination-items/:laminationItemId/matches', ctrl.getMatchedEdgeBands);

// Edge Band Items
router.get('/edgeband-items', ctrl.getEdgeBandItems);
router.post('/edgeband-items', ctrl.createEdgeBandItem);

// Matches
router.post('/matches', ctrl.createMatch);
router.delete('/matches/:id', ctrl.deleteMatch);

export default router;
