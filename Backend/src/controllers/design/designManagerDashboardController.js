import Project from '../../models/design/Project.js';
import Task from '../../models/design/Task.js';
import Quotation from '../../models/sales/Quotation.js';
import MaterialRequest from '../../models/procurement/MaterialRequest.js';

export const getManagerDashboard = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const designProjects = await Project.find({ stage: 'Design' });
        const designProjectIds = designProjects.map(p => p._id);

        const totalProjects = await Project.countDocuments({ stage: 'Design' });
        const inDesign = await Project.countDocuments({ stage: 'Design', designStatus: 'In Design' });
        const underReview = await Project.countDocuments({ stage: 'Design', designStatus: 'Under Review' });
        const completed = await Project.countDocuments({ stage: 'Procurement', designComplete: true });

        const pendingTasks = await Task.countDocuments({ project: { $in: designProjectIds }, status: { $nin: ['Completed'] } });
        const overdueTasks = await Task.countDocuments({ project: { $in: designProjectIds }, dueDate: { $lt: now }, status: { $nin: ['Completed'] } });
        const pendingBOQ = await Quotation.countDocuments({ status: { $in: ['Under Review', 'Revision'] } });
        const pendingMaterials = await MaterialRequest.countDocuments({ project: { $in: designProjectIds }, status: 'Pending' });

        const staffPerformance = await Task.aggregate([
            { $match: { project: { $in: designProjectIds } } },
            {
                $group: {
                    _id: '$assignedTo',
                    totalTasks: { $sum: 1 },
                    completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
                    overdueTasks: {
                        $sum: { $cond: [{ $and: [{ $lt: ['$dueDate', now] }, { $ne: ['$status', 'Completed'] }] }, 1, 0] }
                    }
                }
            },
            { $lookup: { from: 'staffs', localField: '_id', foreignField: '_id', as: 'staff' } },
            { $unwind: { path: '$staff', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    staffId: '$_id',
                    name: { $ifNull: ['$staff.name', 'Unknown'] },
                    role: { $ifNull: ['$staff.role', 'Unknown'] },
                    totalTasks: 1, completedTasks: 1, overdueTasks: 1,
                    completionRate: {
                        $cond: [
                            { $gt: ['$totalTasks', 0] },
                            { $round: [{ $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] }, 0] },
                            0
                        ]
                    }
                }
            },
            { $sort: { completionRate: -1 } },
            { $limit: 10 }
        ]);

        const monthlyCompletion = await Task.aggregate([
            { $match: { project: { $in: designProjectIds }, status: 'Completed', completedAt: { $gte: startOfLastMonth } } },
            { $group: { _id: { month: { $month: '$completedAt' }, year: { $year: '$completedAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 6 }
        ]);

        const projectsByStatus = await Project.aggregate([
            { $match: { stage: 'Design' } },
            { $group: { _id: { $ifNull: ['$designStatus', 'Not Started'] }, count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalProjects, inDesign, underReview, completed, pendingBOQ, overdueTasks,
                pendingMaterials, pendingTasks, staffPerformance,
                monthlyCompletion: monthlyCompletion.map(m => ({ month: m._id.month, year: m._id.year, count: m.count })),
                projectsByStatus: projectsByStatus.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {})
            }
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
