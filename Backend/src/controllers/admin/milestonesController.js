import Project from '../../models/design/Project.js';
import Task from '../../models/design/Task.js';
import Staff from '../../models/admin/Staff.js';
import User from '../../models/admin/User.js';
import Quotation from '../../models/sales/Quotation.js';

const COMPLETED_STATUSES = [
    'Completed',
    'Approved',
    'Sales Approved',
    'Pending Payment',
    'Pushed to Procurement',
    'Assigned to Procurement',
    'Procurement Approved'
];

export const getMilestonesData = async (req, res) => {
    try {
        // --- 1. COMPANY STATS & MILESTONES ---
        const totalProjectsCount = await Project.countDocuments();
        const completedProjectsCount = await Project.countDocuments({ 
            $or: [
                { status: 'Completed' },
                { stage: 'Completed' },
                { handoverComplete: true }
            ]
        });
        const activeProjectsCount = await Project.countDocuments({
            stage: { $in: ['Design', 'Procurement', 'Production'] },
            status: { $ne: 'Cancelled' }
        });

        // Milestones: Bronze (10), Silver (50), Gold (100), Diamond (500)
        const milestoneThresholds = [
            { key: 'bronze', label: 'Bronze Milestone', target: 10, description: '10 Projects Completed' },
            { key: 'silver', label: 'Silver Milestone', target: 50, description: '50 Projects Completed' },
            { key: 'gold', label: 'Gold Milestone', target: 100, description: '100 Projects Completed' },
            { key: 'diamond', label: 'Diamond Milestone', target: 500, description: '500 Projects Completed' }
        ];

        let nextMilestone = milestoneThresholds[milestoneThresholds.length - 1]; // default to diamond
        const companyMilestones = milestoneThresholds.map(threshold => {
            const unlocked = completedProjectsCount >= threshold.target;
            if (!unlocked && threshold.target < nextMilestone.target) {
                nextMilestone = threshold;
            }
            return {
                ...threshold,
                unlocked,
                progress: Math.min(100, Math.round((completedProjectsCount / threshold.target) * 100))
            };
        });

        // If all unlocked, set target to diamond
        if (completedProjectsCount >= 500) {
            nextMilestone = { key: 'legendary', label: 'Legendary Milestone', target: 1000, description: '1000 Projects Completed' };
        } else {
            // Find the active next milestone
            const activeNext = companyMilestones.find(m => !m.unlocked);
            if (activeNext) {
                nextMilestone = activeNext;
            }
        }

        // --- 2. STAFF ACHIVEMENTS & BADGES ---
        const allStaff = await Staff.find({ status: { $ne: 'Inactive' } });
        const staffList = await Promise.all(allStaff.map(async (staff) => {
            const totalTasks = await Task.countDocuments({ assignedTo: staff._id });
            const completedTasks = await Task.countDocuments({ 
                assignedTo: staff._id, 
                status: { $in: COMPLETED_STATUSES }
            });
            const onTimeTasks = await Task.countDocuments({
                assignedTo: staff._id,
                status: { $in: COMPLETED_STATUSES },
                $or: [
                    { isOnTime: true },
                    { completedAt: { $exists: true }, dueDate: { $exists: true }, $expr: { $lte: ['$completedAt', '$dueDate'] } }
                ]
            });

            const onTimeRate = completedTasks > 0 ? Math.round((onTimeTasks / completedTasks) * 100) : 0;

            // Compute badges
            const badges = [];
            if (completedTasks >= 5) {
                badges.push({ title: 'Rookie Achiever', icon: '🥉', color: '#b45309', description: 'Completed 5+ tasks' });
            }
            if (completedTasks >= 20) {
                badges.push({ title: 'Rising Star', icon: '🥈', color: '#4b5563', description: 'Completed 20+ tasks' });
            }
            if (completedTasks >= 100) {
                badges.push({ title: 'Century Maker', icon: '🥇', color: '#eab308', description: 'Completed 100+ tasks' });
            }
            if (completedTasks >= 10 && onTimeRate >= 90) {
                badges.push({ title: 'On-Time Champion', icon: '⚡', color: '#06b6d4', description: '90%+ On-Time Rate' });
            }

            return {
                _id: staff._id,
                name: staff.name,
                role: staff.role,
                totalTasks,
                completedTasks,
                onTimeRate,
                badges
            };
        }));

        // --- 3. LEADERBOARD HIGHLIGHTS ---
        
        // A. Staff Podium (Top 3 completed tasks)
        const staffPodium = [...staffList]
            .filter(s => s.completedTasks > 0)
            .sort((a, b) => b.completedTasks - a.completedTasks)
            .slice(0, 5); // top 5, top 3 for podium, 4th/5th for mentions

        // B. Top Managers (Design, Procurement, Production, Project)
        const allManagers = await User.find({ 
            role: { $in: ['Admin', 'Super Admin', 'Design Manager', 'Procurement Manager', 'Production Manager', 'Project Manager', 'Accounts Manager'] },
            status: { $ne: 'Inactive' }
        });

        const managerStats = await Promise.all(allManagers.map(async (manager) => {
            const managedProjectsCount = await Project.countDocuments({
                $or: [
                    { assignedDesignManager: manager._id },
                    { assignedProcurementManager: manager._id },
                    { assignedProductionManager: manager._id }
                ]
            });

            return {
                _id: manager._id,
                name: manager.fullName || manager.name,
                role: manager.role,
                projectCount: managedProjectsCount
            };
        }));

        const topManagers = managerStats
            .filter(m => m.projectCount > 0)
            .sort((a, b) => b.projectCount - a.projectCount)
            .slice(0, 3);

        // C. Quotation King (Sales Performance)
        const quotations = await Quotation.find({ status: 'Approved' });
        const salesStats = {};

        quotations.forEach(q => {
            if (q.createdBy) {
                const salesId = String(q.createdBy);
                if (!salesStats[salesId]) {
                    salesStats[salesId] = {
                        count: 0,
                        totalValue: 0
                    };
                }
                salesStats[salesId].count += 1;
                salesStats[salesId].totalValue += (q.totalAmount || q.subtotal || 0);
            }
        });

        const salesLeaderboard = await Promise.all(Object.entries(salesStats).map(async ([userId, stats]) => {
            const user = await User.findById(userId);
            return {
                _id: userId,
                name: user ? (user.fullName || user.name) : 'Unknown Seller',
                role: user ? user.role : 'Sales',
                quotationCount: stats.count,
                totalValue: stats.totalValue
            };
        }));

        const topSales = salesLeaderboard
            .filter(s => s.totalValue > 0)
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, 3);

        res.status(200).json({
            success: true,
            data: {
                company: {
                    totalProjects: totalProjectsCount,
                    completedProjects: completedProjectsCount,
                    activeProjects: activeProjectsCount,
                    milestones: companyMilestones,
                    nextMilestone: {
                        ...nextMilestone,
                        remaining: Math.max(0, nextMilestone.target - completedProjectsCount),
                        progress: Math.min(100, Math.round((completedProjectsCount / nextMilestone.target) * 100))
                    }
                },
                staffList: staffList.sort((a, b) => b.completedTasks - a.completedTasks),
                podium: staffPodium,
                topManagers,
                topSales
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
