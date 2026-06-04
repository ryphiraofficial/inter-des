import express from 'express';
const router = express.Router();

import { 
    getTasks,
    createTask,
    updateTask,
    deleteTask
 } from '../../controllers/design/kanbanTaskController.js';

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .patch(updateTask)
    .delete(deleteTask);

export default router;
