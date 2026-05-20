const productionManagementService = require('../services/productionManagementService');


exports.createProject = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.createProject(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getProjects(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getProjectById(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.updateProject(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.assignTeam = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.assignTeam(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.createTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.assignTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.assignTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.updateTaskStatus(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getTasksByProject(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.approveTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.approveTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getDashboardOverview = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getDashboardOverview(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getUpcomingDeadlines = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getUpcomingDeadlines(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getBudgetOverview = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getBudgetOverview(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getPendingApprovals = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getPendingApprovals(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getAllTasks(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTeamOverview = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getTeamOverview(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getMyProjects(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getEngineerDashboard = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getEngineerDashboard(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getEngineerTasks = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getEngineerTasks(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getTaskById(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.addComment(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createSubtask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.createSubtask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProjectActivity = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getProjectActivity(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getSiteTeam = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getSiteTeam(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getSupervisors = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getSupervisors(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getHandoffProjects = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getHandoffProjects(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProductionStaff = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getProductionStaff(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.acceptHandoff = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.acceptHandoff(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.createReplacementRequest = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.createReplacementRequest(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getReplacementRequests = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getReplacementRequests(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.actionReplacementRequest = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.actionReplacementRequest(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getDashboardCharts = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getDashboardCharts(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getBudgetAnalytics = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getBudgetAnalytics(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getKPIMetrics = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getKPIMetrics(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getGanttData = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getGanttData(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getProductionReports = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await productionManagementService.getProductionReports(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};