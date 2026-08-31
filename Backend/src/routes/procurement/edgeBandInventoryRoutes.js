import express from 'express';
import {
    getBrands,
    createBrand,
    getLaminates,
    createLaminate,
    updateLaminate,
    deleteLaminate,
    getEdgeBands,
    getEdgeBand,
    createEdgeBand,
    bulkCreateEdgeBands,
    updateEdgeBand,
    deleteEdgeBand,
    adjustEdgeBandStock,
    getLaminateMatches,
    addOrUpdateMatch,
    setPrimaryMatch,
    deleteMatch
} from '../../controllers/procurement/edgeBandInventoryController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Brands
router.route('/brands')
    .get(getBrands)
    .post(createBrand);

// Laminates
router.route('/laminates')
    .get(getLaminates)
    .post(createLaminate);

router.route('/laminates/:id')
    .put(updateLaminate)
    .delete(authorize('Super Admin', 'Admin', 'Procurement Manager'), deleteLaminate);

// Laminate Matches
router.route('/laminates/:laminateId/matches')
    .get(getLaminateMatches)
    .post(addOrUpdateMatch);

router.patch('/laminates/:laminateId/matches/:matchId/primary', setPrimaryMatch);
router.delete('/laminates/:laminateId/matches/:matchId', deleteMatch);

// Edge Bands
router.post('/edge-bands/bulk', bulkCreateEdgeBands);

router.route('/edge-bands')
    .get(getEdgeBands)
    .post(createEdgeBand);

router.route('/edge-bands/:id')
    .get(getEdgeBand)
    .put(updateEdgeBand)
    .delete(authorize('Super Admin', 'Admin', 'Procurement Manager'), deleteEdgeBand);

router.patch('/edge-bands/:id/stock', adjustEdgeBandStock);

export default router;
