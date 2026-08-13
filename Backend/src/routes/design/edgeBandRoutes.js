import express from 'express';
import { protect } from '../../middleware/auth.js';
import {
    getBrands,
    searchEdgeBands,
    getEdgeBandById,
    saveSelections,
    getProjectSelections,
    deleteSelection
} from '../../controllers/design/edgeBandController.js';

const router = express.Router();

router.use(protect);

router.get('/brands', getBrands);
router.get('/search', searchEdgeBands);
router.get('/selections/:projectId', getProjectSelections);
router.get('/:id', getEdgeBandById);
router.post('/selections', saveSelections);
router.delete('/selections/:id', deleteSelection);

export default router;
