import * as taskService from '../../services/production/productionTaskService.js';

export const createTask = async (req, res) => {
    try {
        const result = await taskService.createTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const assignTask = async (req, res) => {
    try {
        const result = await taskService.assignTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const result = await taskService.updateTaskStatus({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const approveTask = async (req, res) => {
    try {
        const result = await taskService.approveTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const addComment = async (req, res) => {
    try {
        const result = await taskService.addComment({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createSubtask = async (req, res) => {
    try {
        const result = await taskService.createSubtask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};
