import express from 'express';
import { 
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
 } from '../../controllers/admin/userController.js';

const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(authorize('Super Admin', 'Admin', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager', 'Manager'), getUsers)
    .post(authorize('Super Admin', 'Admin'), createUser);

router.get('/stats', authorize('Super Admin', 'Admin', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager', 'Manager'), getUserStats);

router.route('/:id')
    .get(getUser)
    .put(authorize('Super Admin', 'Admin'), updateUser)
    .delete(authorize('Super Admin'), deleteUser);

export default router;
