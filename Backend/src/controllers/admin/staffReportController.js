import StaffReport from '../../models/admin/StaffReport.js';
import Notification from '../../models/shared/Notification.js';
import User from '../../models/admin/User.js';
import Project from '../../models/design/Project.js';

// @desc    Submit a new staff report
// @route   POST /api/staff-reports
// @access  Private
export const submitStaffReport = async (req, res) => {
    try {
        const { title, description, type, priority, project, isAssignedToMe, reportDate, image, images } = req.body;

        const report = await StaffReport.create({
            title,
            description,
            type,
            priority,
            project: project || null,
            isAssignedToMe: isAssignedToMe || false,
            reportDate: reportDate || Date.now(),
            image,
            images,
            submittedBy: req.user._id
        });

        const populatedReport = await StaffReport.findById(report._id)
            .populate('submittedBy', 'fullName role avatar department')
            .populate('project', 'name projectNumber');

        // Determine who to notify
        let recipients = [];
        
        if (project) {
            const projectData = await Project.findById(project);
            if (projectData) {
                // Determine user department
                const role = req.user.role?.toLowerCase() || '';
                const dept = req.user.department || 
                            (role.includes('design') ? 'Design' : 
                             role.includes('procurement') ? 'Procurement' : 
                             role.includes('accounts') ? 'Accounts' : 
                             (role.includes('production') || role.includes('site') || role.includes('project')) ? 'Production' : 'Sales');
                
                let managerId = null;
                switch(dept) {
                    case 'Design': managerId = projectData.assignedDesignManager; break;
                    case 'Procurement': managerId = projectData.assignedProcurementManager; break;
                    case 'Accounts': managerId = projectData.assignedAccountsStaff; break;
                    case 'Production': managerId = projectData.assignedProductionManager; break;
                }
                
                if (managerId) {
                    recipients.push(managerId);
                }
            }
        }
        
        // Always include Super Admins
        const superAdmins = await User.find({ role: { $in: ['Super Admin', 'super admin', 'superadmin'] } }).select('_id');
        recipients = [...recipients, ...superAdmins.map(a => a._id)];
        
        // If no project or no specific manager found, fallback to all managers/admins
        if (recipients.length === superAdmins.length) {
            const allAdmins = await User.find({ role: { $in: ['Admin', 'Manager', 'admin', 'manager'] } }).select('_id');
            recipients = [...recipients, ...allAdmins.map(a => a._id)];
        }
        
        // Remove duplicates
        recipients = [...new Set(recipients.map(id => id.toString()))];

        const notifications = recipients.map(recipientId => ({
            title: `New Staff Report: ${type}`,
            description: `${req.user.fullName} submitted a new ${type} report${project ? ' for project ' + populatedReport.project?.projectNumber : ''}: ${title}`,
            type: priority === 'Critical' ? 'Error' : 'Info',
            recipient: recipientId,
            createdBy: req.user._id
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            success: true,
            data: populatedReport,
            message: 'Report submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting staff report:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get staff reports (Admins see all, staff see their own)
// @route   GET /api/staff-reports
// @access  Private
export const getStaffReports = async (req, res) => {
    try {
        const isAdmin = ['admin', 'super admin', 'superadmin', 'manager', 'design manager', 'procurement manager', 'project manager', 'accounts manager'].includes(req.user.role?.toLowerCase());
        
        let query = {};
        if (!isAdmin) {
            query.submittedBy = req.user._id;
        }

        // Apply filters if provided
        if (req.query.status) query.status = req.query.status;
        if (req.query.type) query.type = req.query.type;
        if (req.query.priority) query.priority = req.query.priority;

        const reports = await StaffReport.find(query)
            .populate('submittedBy', 'fullName role avatar department')
            .populate('project', 'name projectNumber')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error('Error fetching staff reports:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update staff report status (Admin only)
// @route   PATCH /api/staff-reports/:id/status
// @access  Private (Admin)
export const updateStaffReportStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        
        const report = await StaffReport.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
 
        if (status) report.status = status;
        if (adminNotes) report.adminNotes = adminNotes;
 
        await report.save();
 
        const updatedReport = await StaffReport.findById(report._id)
            .populate('submittedBy', 'fullName role avatar department')
            .populate('project', 'name projectNumber');

        res.status(200).json({
            success: true,
            data: updatedReport,
            message: 'Report updated successfully'
        });
    } catch (error) {
        console.error('Error updating staff report:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
