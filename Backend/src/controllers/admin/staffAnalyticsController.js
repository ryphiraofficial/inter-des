import Staff from '../../models/admin/Staff.js';
import Task from '../../models/design/Task.js';
import Project from '../../models/design/Project.js';
import ProductionProject from '../../models/production/ProductionProject.js';
import User from '../../models/admin/User.js';
import { calculateEmployeeAnalytics } from '../../services/analytics/index.js';

const COMPLETED_STATUSES = [
    'Completed',
    'Approved',
    'Sales Approved',
    'Pending Payment',
    'Pushed to Procurement',
    'Assigned to Procurement',
    'Procurement Approved'
];

export const getStaffAnalytics = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

        const analytics = await calculateEmployeeAnalytics(staff);

        // Fetch active assignments for the UI
        const user = await User.findOne({ staffId: staff.staffId });

        if (staff.role === 'Design Staff') {
            const currentTask = await Task.findOne({
                assignedTo: req.params.id,
                status: { $nin: COMPLETED_STATUSES }
            })
                .populate('client', 'name')
                .populate('quotation', 'projectName')
                .sort({ createdAt: -1 });

            if (currentTask) {
                analytics.currentClient = currentTask.client?.name || 'No active assignment';
                analytics.currentProject = currentTask.quotation?.projectName || 'No active project';
            }
        } else if (user) {
            if (staff.role === 'Design Manager') {
                const activeProj = await Project.findOne({ assignedDesignManager: user._id, status: 'In Progress' });
                if (activeProj) analytics.currentProject = activeProj.name || activeProj.projectNumber;
            } else if (staff.role === 'Procurement Manager') {
                const activeProj = await Project.findOne({ assignedProcurementManager: user._id, status: 'In Progress' });
                if (activeProj) analytics.currentProject = activeProj.name || activeProj.projectNumber;
            } else if (staff.role === 'Production Manager' || staff.role === 'Project Manager') {
                const activeProj = await ProductionProject.findOne({ projectManager: user._id, status: 'Active' });
                if (activeProj) analytics.currentProject = activeProj.projectName;
            } else if (staff.role === 'Site Engineer') {
                const activeProj = await ProductionProject.findOne({ siteEngineer: user._id, status: 'Active' });
                if (activeProj) analytics.currentProject = activeProj.projectName;
            }
        }

        res.status(200).json({ success: true, data: analytics });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getAllStaffAnalytics = async (req, res, next) => {
    try {
        const allStaff = await Staff.find();

        const analytics = await Promise.all(allStaff.map(async (staff) => {
            return await calculateEmployeeAnalytics(staff);
        }));

        res.status(200).json({ success: true, count: analytics.length, data: analytics });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
