import * as staffService from '../../services/production/productionStaffService.js';

export const getTeamOverview = async (req, res) => {
    try {
        const result = await staffService.getTeamOverview({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getSiteTeam = async (req, res) => {
    try {
        const result = await staffService.getSiteTeam({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getSupervisors = async (req, res) => {
    try {
        const result = await staffService.getSupervisors({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getProductionStaff = async (req, res) => {
    try {
        const result = await staffService.getProductionStaff({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const createReplacementRequest = async (req, res) => {
    try {
        const result = await staffService.createReplacementRequest({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getReplacementRequests = async (req, res) => {
    try {
        const result = await staffService.getReplacementRequests({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const actionReplacementRequest = async (req, res) => {
    try {
        const result = await staffService.actionReplacementRequest({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};
