import * as taskCreationService from '../../services/task/taskCreationService.js';
import * as taskUpdateService from '../../services/task/taskUpdateService.js';
import * as taskQueryService from '../../services/task/taskQueryService.js';
import * as taskApprovalService from '../../services/task/taskApprovalService.js';

export const getTasks = async (req, res) => {
    try {
        const result = await taskQueryService.getTasks({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getTask = async (req, res) => {
    try {
        const result = await taskQueryService.getTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createTask = async (req, res) => {
    try {
        const result = await taskCreationService.createTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const updateTask = async (req, res) => {
    try {
        const result = await taskUpdateService.updateTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await taskUpdateService.deleteTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const submitTask = async (req, res) => {
    try {
        const result = await taskUpdateService.submitTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const reviewSubmission = async (req, res) => {
    try {
        const result = await taskApprovalService.reviewSubmission({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const pushToProcurement = async (req, res) => {
    try {
        const result = await taskApprovalService.pushToProcurement({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const salesApproveTask = async (req, res) => {
    try {
        const result = await taskApprovalService.salesApproveTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const managerSendToAdmin = async (req, res) => {
    try {
        const result = await taskApprovalService.managerSendToAdmin({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const adminReviewDesign = async (req, res) => {
    try {
        const result = await taskApprovalService.adminReviewDesign({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const addComment = async (req, res) => {
    try {
        const result = await taskUpdateService.addComment({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getTaskComments = async (req, res) => {
    try {
        const result = await taskQueryService.getTaskComments({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getTaskTimeline = async (req, res) => {
    try {
        const result = await taskQueryService.getTaskTimeline({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const reassignTask = async (req, res) => {
    try {
        const result = await taskUpdateService.reassignTask({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getTaskStats = async (req, res) => {
    try {
        const result = await taskQueryService.getTaskStats({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const accountsCollectPayment = async (req, res) => {
    try {
        const result = await taskApprovalService.accountsCollectPayment({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const adminClearPaymentToProcurement = async (req, res) => {
    try {
        const result = await taskApprovalService.adminClearPaymentToProcurement({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const addDailyUpdate = async (req, res) => {
    try {
        const result = await taskUpdateService.addDailyUpdate({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};