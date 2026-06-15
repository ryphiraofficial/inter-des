import SiteProgressReport from '../../models/production/SiteProgressReport.js';
import SupervisorDailyReport from '../../models/production/SupervisorDailyReport.js';
import ProductionProject from '../../models/production/ProductionProject.js';

// @desc    Submit daily site progress report
// @route   POST /api/production/site/reports
// @access  Private (SE, SS)
export const submitDailyReport = async (req, res) => {
    try {
        const { projectId, reportDate, workStatus, weather, workDone, workersPresent, issues, nextDayPlan, sendToRole, sendToUser } = req.body;

        const project = await ProductionProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const report = await SiteProgressReport.create({
            project: projectId,
            date: reportDate || new Date(),
            submittedBy: req.user._id,
            workStatus,
            weather,
            workDone,
            workersPresent,
            issues,
            nextDayPlan,
            sendToRole,
            sendToUser
        });

        const populatedReport = await SiteProgressReport.findById(report._id)
            .populate('submittedBy', 'fullName role')
            .populate('project', 'projectName');

        res.status(201).json({ success: true, data: populatedReport });
    } catch (error) {
        console.error('Error submitting daily report:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get daily progress reports for a project
// @route   GET /api/production/site/reports/:projectId
// @access  Private
export const getProjectReports = async (req, res) => {
    try {
        const query = req.params.projectId === 'all' ? {} : { project: req.params.projectId };
        const reports = await SiteProgressReport.find(query)
            .populate('submittedBy', 'fullName role')
            .populate('project', 'projectName')
            .sort({ date: -1 });

        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error('Error fetching project reports:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ==========================================
// SUPERVISOR REPORTS
// ==========================================

// @desc    Submit supervisor daily report
// @route   POST /api/production/site/supervisor-reports
// @access  Private (SS)
export const submitSupervisorReport = async (req, res) => {
    try {
        const { projectId, reportDate, materialReceived, materialUsed, equipmentStatus, laborCount, comments } = req.body;

        const project = await ProductionProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const report = await SupervisorDailyReport.create({
            project: projectId,
            date: reportDate || new Date(),
            submittedBy: req.user._id,
            materialReceived,
            materialUsed,
            equipmentStatus,
            laborCount,
            comments
        });

        const populatedReport = await SupervisorDailyReport.findById(report._id)
            .populate('submittedBy', 'fullName role')
            .populate('project', 'projectName');

        res.status(201).json({ success: true, data: populatedReport });
    } catch (error) {
        console.error('Error submitting supervisor report:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get supervisor reports for a project
// @route   GET /api/production/site/supervisor-reports/:projectId
// @access  Private
export const getSupervisorReports = async (req, res) => {
    try {
        const query = req.params.projectId === 'all' ? {} : { project: req.params.projectId };
        const reports = await SupervisorDailyReport.find(query)
            .populate('submittedBy', 'fullName role')
            .populate('project', 'projectName')
            .sort({ date: -1 });

        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error('Error fetching supervisor reports:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
