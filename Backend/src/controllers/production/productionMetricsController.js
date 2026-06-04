import * as metricsService from '../../services/production/productionMetricsService.js';

export const getDashboardOverview = async (req, res) => {
    try {
        const result = await metricsService.getDashboardOverview({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getUpcomingDeadlines = async (req, res) => {
    try {
        const result = await metricsService.getUpcomingDeadlines({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getPendingApprovals = async (req, res) => {
    try {
        const result = await metricsService.getPendingApprovals({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getProjectActivity = async (req, res) => {
    try {
        const result = await metricsService.getProjectActivity({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getDashboardCharts = async (req, res) => {
    try {
        const result = await metricsService.getDashboardCharts({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getKPIMetrics = async (req, res) => {
    try {
        const result = await metricsService.getKPIMetrics({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};

export const getProductionReports = async (req, res) => {
    try {
        const result = await metricsService.getProductionReports({ user: req.user, body: req.body, params: req.params, query: req.query });
        res.status(result.status || 200).json(result);
    } catch (error) { res.status(error.status || 500).json({ success: false, message: error.message }); }
};
