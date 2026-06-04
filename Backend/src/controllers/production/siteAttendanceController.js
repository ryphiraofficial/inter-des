import SiteAttendance from '../../models/production/SiteAttendance.js';
import ProductionProject from '../../models/production/ProductionProject.js';

export const submitAttendance = async (req, res) => {
    try {
        const { projectId, date, records } = req.body;

        // Verify project exists
        const project = await ProductionProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Check if attendance already exists for this date
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        let attendance = await SiteAttendance.findOne({
            project: projectId,
            date: {
                $gte: attendanceDate,
                $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (attendance) {
            // Update existing
            attendance.records = records;
            attendance.submittedBy = req.user._id;
            await attendance.save();
        } else {
            // Create new
            attendance = await SiteAttendance.create({
                project: projectId,
                date: attendanceDate,
                submittedBy: req.user._id,
                records
            });
        }

        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error submitting attendance:', error);
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Attendance for this date already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get attendance for a project
// @route   GET /api/production/site/attendance/:projectId
// @access  Private
export const getProjectAttendance = async (req, res) => {
    try {
        const attendance = await SiteAttendance.find({ project: req.params.projectId })
            .populate('submittedBy', 'fullName role')
            .sort({ date: -1 });

        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
