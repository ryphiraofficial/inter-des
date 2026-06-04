import * as queryService from '../../services/production/productionQueryService.js';

export const getProjects = async (req, res) => {
    try {
        const result = await queryService.getProjects({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getProjectById = async (req, res) => {
    try {
        const result = await queryService.getProjectById({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getTasksByProject = async (req, res) => {
    try {
        const result = await queryService.getTasksByProject({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getAllTasks = async (req, res) => {
    try {
        const result = await queryService.getAllTasks({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getMyProjects = async (req, res) => {
    try {
        const result = await queryService.getMyProjects({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getTaskById = async (req, res) => {
    try {
        const result = await queryService.getTaskById({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getHandoffProjects = async (req, res) => {
    try {
        const result = await queryService.getHandoffProjects({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getCompletedProductionProjects = async (req, res) => {
    try {
        const result = await queryService.getCompletedProductionProjects({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getUnlockRequests = async (req, res) => {
    try {
        const result = await queryService.getUnlockRequests({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};
