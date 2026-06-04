import Task from '../../models/design/Task.js';
import Staff from '../../models/admin/Staff.js';

export const getStaffDashboard = async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        let staffId = req.user._id;
        const staffMember = await Staff.findOne({ email: req.user.email });
        if (staffMember) staffId = staffMember._id;

        const allTasks = await Task.find({ assignedTo: staffId });

        const myTasks = allTasks.length;
        const pending = allTasks.filter(t => t.status === 'To Do').length;
        const inProgress = allTasks.filter(t => t.status === 'In Progress').length;
        const completed = allTasks.filter(t => t.status === 'Completed').length;
        const blocked = allTasks.filter(t => t.status === 'Blocked').length;
        const overdue = allTasks.filter(t => t.dueDate < now && t.status !== 'Completed').length;
        const dueToday = allTasks.filter(t => {
            const dueDate = new Date(t.dueDate);
            return dueDate >= todayStart && dueDate < todayEnd && t.status !== 'Completed';
        }).length;

        const recentNotifications = await (await import('../../models/shared/Notification.js')).default.find({
            recipient: req.user._id, createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: -1 }).limit(10).populate('createdBy', 'fullName');

        const unreadCount = await (await import('../../models/shared/Notification.js')).default.countDocuments({
            recipient: req.user._id, isRead: false
        });

        const upcomingTasks = await Task.find({
            assignedTo: staffId, status: { $nin: ['Completed'] },
            dueDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) }
        }).sort({ dueDate: 1 }).limit(5).populate('project', 'name');

        res.status(200).json({
            success: true,
            data: {
                myTasks: { total: myTasks, pending, inProgress, completed, blocked, overdue, dueToday },
                pending, inProgress, completed, overdue, dueToday, recentNotifications, unreadCount, upcomingTasks
            }
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getOverdueTasks = async (req, res) => {
    try {
        const now = new Date();
        const overdueTasks = await Task.find({ dueDate: { $lt: now }, status: { $nin: ['Completed'] } })
            .populate('assignedTo', 'name email role').populate('project', 'name').sort({ dueDate: 1 });

        const updatedTasks = [];
        for (const task of overdueTasks) {
            if (!task.isOverdue) { task.isOverdue = true; await task.save(); }
            updatedTasks.push(task);
        }

        res.status(200).json({ success: true, count: updatedTasks.length, data: updatedTasks });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getStaffPerformance = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const daysAgo = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        const designStaff = await Staff.find({ role: { $regex: /design/i, $options: 'i' }, status: 'Active' });
        const performanceData = [];

        for (const staff of designStaff) {
            const tasks = await Task.find({ assignedTo: staff._id, createdAt: { $gte: startDate } });
            const completedInPeriod = tasks.filter(t => t.status === 'Completed' && t.completedAt && t.completedAt >= startDate).length;
            const overdueCount = tasks.filter(t => t.dueDate < new Date() && t.status !== 'Completed').length;

            performanceData.push({
                staffId: staff._id, name: staff.name, role: staff.role,
                totalTasks: tasks.length, completedTasks: completedInPeriod, overdueTasks: overdueCount,
                onTimeCompletionRate: completedInPeriod > 0 ? Math.round((tasks.filter(t => t.isOnTime === true).length / completedInPeriod) * 100) : 0
            });
        }

        performanceData.sort((a, b) => b.completedTasks - a.completedTasks);
        res.status(200).json({ success: true, data: performanceData });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
