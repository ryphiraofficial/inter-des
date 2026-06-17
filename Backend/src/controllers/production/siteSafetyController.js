import SafetyLog from '../../models/production/SafetyLog.js';
import ProductionProject from '../../models/production/ProductionProject.js';

// @desc    Report a safety incident or hazard
// @route   POST /api/production/site/safety
// @access  Private (SE, SS)
export const reportSafetyIssue = async (req, res) => {
    try {
        const { projectId, type, severity, description, actionTaken, attachments, date } = req.body;

        const project = await ProductionProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const safetyLog = await SafetyLog.create({
            project: projectId,
            date: date || new Date(),
            reportedBy: req.user._id,
            type,
            severity,
            description,
            actionTaken,
            attachments
        });

        res.status(201).json({ success: true, data: safetyLog });
    } catch (error) {
        console.error('Error reporting safety issue:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get safety logs for a project
// @route   GET /api/production/site/safety/:projectId
// @access  Private
export const getProjectSafetyLogs = async (req, res) => {
    try {
        const query = req.params.projectId === 'all' ? {} : { project: req.params.projectId };
        const logs = await SafetyLog.find(query)
            .populate('reportedBy', 'fullName role')
            .sort({ date: -1 });

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error('Error fetching safety logs:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update safety log status (e.g. mark Resolved)
// @route   PATCH /api/production/site/safety/:logId
// @access  Private (SE, SS, PM)
export const updateSafetyLogStatus = async (req, res) => {
    try {
        const { status, actionTaken } = req.body;
        
        const log = await SafetyLog.findById(req.params.logId);
        if (!log) {
            return res.status(404).json({ success: false, message: 'Safety log not found' });
        }

        if (status) log.status = status;
        if (actionTaken) log.actionTaken = actionTaken;

        await log.save();

        res.status(200).json({ success: true, data: log });
    } catch (error) {
        console.error('Error updating safety log:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
