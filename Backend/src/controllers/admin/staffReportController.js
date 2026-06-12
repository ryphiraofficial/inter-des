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
        const role = req.user.role?.toLowerCase() || '';
        const isSuperAdmin = ['admin', 'super admin', 'superadmin'].includes(role);
        const isManager = ['manager', 'design manager', 'procurement manager', 'project manager', 'accounts manager'].includes(role);
        const isAdmin = isSuperAdmin || isManager;
        
        let query = {};
        if (!isAdmin) {
            // Staff only see their own
            query.submittedBy = req.user._id;
        } else if (isSuperAdmin) {
            // Top-level admins only see reports that have been forwarded by managers
            query.forwardedToAdmin = true;
            // Admin should only see the aggregated bundles to prevent dashboard clutter
            query.type = 'Weekly Bundle';
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

// @desc    Forward last 7 days of reports to Admin
// @route   POST /api/staff-reports/forward-weekly
// @access  Private (Manager)
export const forwardWeeklyReports = async (req, res) => {
    try {
        let { startDate, endDate } = req.body;
        
        let start = new Date();
        let end = new Date();
        
        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        } else {
            end.setHours(23, 59, 59, 999);
            start.setDate(end.getDate() - 7);
            start.setHours(0, 0, 0, 0);
        }

        const dateQuery = {
            $or: [
                { createdAt: { $gte: start, $lte: end } },
                { reportDate: { $gte: start, $lte: end } }
            ]
        };

        // We only bundle reports that are individual reports (not bundles themselves) and haven't been forwarded
        const bundleQuery = {
            ...dateQuery,
            forwardedToAdmin: { $ne: true },
            type: { $ne: 'Weekly Bundle' }
        };

        const reportsToBundle = await StaffReport.find(bundleQuery)
            .populate('submittedBy', 'fullName role department')
            .populate('project', 'name projectNumber');
        
        if (reportsToBundle.length === 0) {
            const totalReportsInTimeframe = await StaffReport.countDocuments({ ...dateQuery, type: { $ne: 'Weekly Bundle' } });
            let message = 'No reports found in the selected date range to forward.';
            if (totalReportsInTimeframe > 0) {
                message = `All ${totalReportsInTimeframe} reports from this date range were already forwarded!`;
            }
            return res.status(200).json({
                success: true,
                message,
                forwardedCount: 0
            });
        }

        // Enforce verification constraint
        const unverifiedReports = reportsToBundle.filter(r => r.status !== 'Resolved' && r.status !== 'Approved');
        if (unverifiedReports.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot send bundle: There are ${unverifiedReports.length} reports in this timeframe that are still pending. Please verify (Resolve) all reports before forwarding to Admin.`
            });
        }

        // Create dailyEntries from the individual reports
        const dailyEntries = reportsToBundle.map(r => ({
            date: r.reportDate || r.createdAt,
            content: r.description,
            originalReportId: r._id,
            status: r.status,
            image: r.image,
            images: r.images,
            type: r.type,
            priority: r.priority,
            projectStr: r.project ? `${r.project.projectNumber} - ${r.project.name}` : '',
            submittedBy: {
                fullName: r.submittedBy?.fullName,
                role: r.submittedBy?.role,
                _id: r.submittedBy?._id
            }
        }));

        // Determine department based on the manager forwarding it, or fallback to reports' data
        let department = req.user.department;
        if (!department) {
             const role = req.user.role || '';
             if (role.includes('Sales')) department = 'Sales';
             else if (role.includes('Procurement')) department = 'Procurement';
             else if (role.includes('Accounts')) department = 'Accounts';
             else if (role.includes('Design')) department = 'Design';
             else if (role.includes('Production') || role.includes('Project')) department = 'Production';
             else department = 'General';
        }

        // Create the master bundle report
        const bundleTitle = `Weekly Staff Reports Bundle (${start.toLocaleDateString('en-GB')} - ${end.toLocaleDateString('en-GB')})`;
        const masterBundle = await StaffReport.create({
            title: bundleTitle,
            description: `Aggregated staff reports from ${dailyEntries.length} submissions in the selected timeframe.`,
            type: 'Weekly Bundle',
            department: department,
            submittedBy: req.user._id,
            dailyEntries: dailyEntries,
            status: 'Pending',
            reportDate: new Date(),
            forwardedToAdmin: true // It's already the forwarded bundle
        });

        // Mark the individual reports as forwarded
        const reportIds = reportsToBundle.map(r => r._id);
        await StaffReport.updateMany(
            { _id: { $in: reportIds } },
            { $set: { forwardedToAdmin: true } }
        );

        // Notify super admins
        const superAdmins = await User.find({ role: { $in: ['Super Admin', 'super admin', 'superadmin', 'Admin', 'admin'] } }).select('_id');
        const notifications = superAdmins.map(admin => ({
            title: 'Weekly Staff Reports Bundle',
            description: `${req.user.fullName || 'A manager'} has submitted a new report bundle with ${reportsToBundle.length} entries for your review.`,
            type: 'Info',
            recipient: admin._id,
            createdBy: req.user._id
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(200).json({
            success: true,
            message: `Successfully bundled and forwarded ${reportsToBundle.length} reports to the Admin`,
            forwardedCount: reportsToBundle.length,
            bundle: masterBundle
        });
    } catch (error) {
        console.error('Error forwarding reports:', error);
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

        // Sync status to any Weekly Bundle that embedded this report
        if (status) {
            await StaffReport.updateMany(
                { 'dailyEntries.originalReportId': report._id },
                { $set: { 'dailyEntries.$.status': status } }
            );
        }
 
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

// @desc    Update staff report (Staff only for their own, or Admin)
// @route   PUT /api/staff-reports/:id
// @access  Private
export const updateStaffReport = async (req, res) => {
    try {
        const { title, description, type, priority, project, isAssignedToMe, reportDate, image, images } = req.body;
        
        let report = await StaffReport.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        
        const isAdmin = ['admin', 'super admin', 'superadmin', 'manager', 'design manager', 'procurement manager', 'project manager', 'accounts manager'].includes(req.user.role?.toLowerCase());
        
        if (report.submittedBy.toString() !== req.user._id.toString() && !isAdmin) {
             return res.status(403).json({ success: false, message: 'Not authorized to update this report' });
        }
        
        if (report.status === 'Resolved' && !isAdmin) {
             return res.status(400).json({ success: false, message: 'Cannot edit a resolved report' });
        }

        report.title = title || report.title;
        report.description = description || report.description;
        report.type = type || report.type;
        report.priority = priority || report.priority;
        report.project = project || report.project;
        report.isAssignedToMe = isAssignedToMe !== undefined ? isAssignedToMe : report.isAssignedToMe;
        report.reportDate = reportDate || report.reportDate;
        if (image !== undefined) report.image = image;
        if (images !== undefined) report.images = images;

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
