import Staff from '../../models/admin/Staff.js';
import Task from '../../models/design/Task.js';

export const getStaffAnalytics = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

        const allTasks = await Task.find({ assignedTo: req.params.id })
            .populate('client', 'name')
            .populate('quotation', 'projectName quotationNumber');

        const completedTasks = allTasks.filter(t => t.status === 'Completed');
        const onTimeTasks = completedTasks.filter(t => t.isOnTime === true);
        const pendingTasks = allTasks.filter(t => t.status !== 'Completed');

        const currentTask = await Task.findOne({
            assignedTo: req.params.id,
            status: { $ne: 'Completed' }
        })
            .populate('client', 'name')
            .populate('quotation', 'projectName')
            .sort({ createdAt: -1 });

        const totalTasks = allTasks.length;
        const completedCount = completedTasks.length;
        const onTimeCount = onTimeTasks.length;

        const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
        const onTimeRate = completedCount > 0 ? Math.round((onTimeCount / completedCount) * 100) : 0;

        let efficiencyTrend = 'new';
        if (totalTasks > 0) {
            if (onTimeRate >= 85) efficiencyTrend = 'improving';
            else if (onTimeRate >= 60) efficiencyTrend = 'stable';
            else efficiencyTrend = 'needs improvement';
        }

        const analytics = {
            staffName: staff.name,
            role: staff.role,
            currentClient: currentTask?.client?.name || 'No active assignment',
            currentProject: currentTask?.quotation?.projectName || 'No active project',
            performanceScore: completionRate,
            tasksCompleted: completedCount,
            totalTasksAssigned: totalTasks,
            onTimeCompletionRate: onTimeRate,
            efficiencyTrend,
            pendingTasks: pendingTasks.length,
            activeTasks: allTasks.filter(t => t.status === 'In Progress').length
        };

        res.status(200).json({ success: true, data: analytics });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getAllStaffAnalytics = async (req, res, next) => {
    try {
        const allStaff = await Staff.find();

        const analytics = await Promise.all(allStaff.map(async (staff) => {
            const allTasks = await Task.find({ assignedTo: staff._id });
            const completedTasks = allTasks.filter(t => t.status === 'Completed');
            const onTimeTasks = completedTasks.filter(t => t.isOnTime === true);

            const totalTasks = allTasks.length;
            const completedCount = completedTasks.length;
            const onTimeCount = onTimeTasks.length;

            const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
            const onTimeRate = completedCount > 0 ? Math.round((onTimeCount / completedCount) * 100) : 0;

            let efficiencyTrend = 'new';
            if (totalTasks > 0) {
                if (onTimeRate >= 85) efficiencyTrend = 'improving';
                else if (onTimeRate >= 60) efficiencyTrend = 'stable';
                else efficiencyTrend = 'needs improvement';
            }

            return {
                _id: staff._id,
                name: staff.name,
                role: staff.role,
                status: staff.status,
                performanceScore: completionRate,
                tasksCompleted: completedCount,
                totalTasksAssigned: totalTasks,
                onTimeCompletionRate: onTimeRate,
                efficiencyTrend,
                pendingTasks: totalTasks - completedCount
            };
        }));

        res.status(200).json({ success: true, count: analytics.length, data: analytics });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
