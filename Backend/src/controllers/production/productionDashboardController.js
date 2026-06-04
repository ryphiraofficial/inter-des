import * as dashboardService from '../../services/production/productionDashboardService.js';

export const getBudgetOverview = async (req, res) => {
    try {
        const result = await dashboardService.getBudgetOverview({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getEngineerDashboard = async (req, res) => {
    try {
        const result = await dashboardService.getEngineerDashboard({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getEngineerTasks = async (req, res) => {
    try {
        const result = await dashboardService.getEngineerTasks({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getBudgetAnalytics = async (req, res) => {
    try {
        const result = await dashboardService.getBudgetAnalytics({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getGanttData = async (req, res) => {
    try {
        const result = await dashboardService.getGanttData({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};
