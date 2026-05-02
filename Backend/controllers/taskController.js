const taskService = require('../services/taskService');


exports.getTasks = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.getTasks(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.getTask(reqData);
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
        const result = await taskService.createTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.updateTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.deleteTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.submitTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.submitTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.reviewSubmission = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.reviewSubmission(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.pushToProcurement = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.pushToProcurement(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.salesApproveTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.salesApproveTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.managerSendToAdmin = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.managerSendToAdmin(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.adminReviewDesign = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.adminReviewDesign(reqData);
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
        const result = await taskService.addComment(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTaskComments = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.getTaskComments(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTaskTimeline = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.getTaskTimeline(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.reassignTask = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.reassignTask(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.getTaskStats = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.getTaskStats(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

exports.addDailyUpdate = async (req, res) => {
    try {
        const reqData = { user: req.user, body: req.body, params: req.params, query: req.query };
        const result = await taskService.addDailyUpdate(reqData);
        if (result && result.status) {
            return res.status(result.status).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};