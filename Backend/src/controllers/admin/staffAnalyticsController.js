import Staff from '../../models/admin/Staff.js';
import Task from '../../models/design/Task.js';

const COMPLETED_STATUSES = [
    'Completed',
    'Approved',
    'Sales Approved',
    'Pending Payment',
    'Pushed to Procurement',
    'Assigned to Procurement',
    'Procurement Approved'
];

const REVISION_STATUSES = ['Revision Required', 'Rejected', 'Admin Rejected'];

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const roundScore = (value) => Math.round((Number.isFinite(value) ? value : 0) * 10) / 10;

const isCompletedTask = (task) => COMPLETED_STATUSES.includes(task.status);

const isOnTimeTask = (task) => {
    if (!isCompletedTask(task)) return false;
    if (task.isOnTime === true) return true;
    if (task.isOnTime === false) return false;
    if (!task.completedAt || !task.dueDate) return false;
    return new Date(task.completedAt) <= new Date(task.dueDate);
};

const isOverdueTask = (task, now = new Date()) => {
    if (isCompletedTask(task)) return false;
    if (task.isOverdue) return true;
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < now;
};

const getStaffSubmissions = (task, staffId) => {
    const id = String(staffId);
    return (task.submissions || []).filter((submission) => {
        if (!submission.submittedBy) return false;
        return String(submission.submittedBy) === id;
    });
};

const getEligibility = (score) => {
    if (score >= 90) {
        return {
            band: 'Outstanding',
            decision: 'High hike + reward',
            hikeRange: '12-15%',
            reward: 'Quarterly bonus or public recognition',
            tone: 'excellent'
        };
    }
    if (score >= 80) {
        return {
            band: 'Excellent',
            decision: 'Hike + reward eligible',
            hikeRange: '8-12%',
            reward: 'Performance reward eligible',
            tone: 'strong'
        };
    }
    if (score >= 70) {
        return {
            band: 'Good',
            decision: 'Standard hike eligible',
            hikeRange: '5-8%',
            reward: 'Recognition if budget allows',
            tone: 'good'
        };
    }
    if (score >= 60) {
        return {
            band: 'Average',
            decision: 'Improvement plan before reward',
            hikeRange: '0-3%',
            reward: 'No reward this cycle',
            tone: 'watch'
        };
    }
    return {
        band: 'Needs Improvement',
        decision: 'No hike; performance review required',
        hikeRange: '0%',
        reward: 'No reward this cycle',
        tone: 'risk'
    };
};

const calculateConsistencyScore = (tasks) => {
    const now = new Date();
    const buckets = [];

    for (let i = 5; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const monthlyTasks = tasks.filter((task) => {
            const createdAt = task.createdAt ? new Date(task.createdAt) : null;
            return createdAt && createdAt >= start && createdAt <= end;
        });
        const completed = monthlyTasks.filter(isCompletedTask).length;
        const rate = monthlyTasks.length > 0 ? (completed / monthlyTasks.length) * 100 : null;
        buckets.push(rate);
    }

    const activeBuckets = buckets.filter((rate) => rate !== null);
    if (activeBuckets.length === 0) return { score: 0, monthsTracked: 0 };

    const average = activeBuckets.reduce((sum, rate) => sum + rate, 0) / activeBuckets.length;
    const variance = activeBuckets.reduce((sum, rate) => sum + Math.pow(rate - average, 2), 0) / activeBuckets.length;
    const stability = clamp(1 - (Math.sqrt(variance) / 100), 0, 1);

    return {
        score: roundScore(clamp((average / 100) * 6 + stability * 4, 0, 10)),
        monthsTracked: activeBuckets.length
    };
};

const buildRewardAnalytics = (staff, allTasks, currentTask = null) => {
    const now = new Date();
    const completedTasks = allTasks.filter(isCompletedTask);
    const onTimeTasks = completedTasks.filter(isOnTimeTask);
    const pendingTasks = allTasks.filter((task) => !isCompletedTask(task));
    const activeTasks = allTasks.filter((task) => task.status === 'In Progress');
    const overdueTasks = allTasks.filter((task) => isOverdueTask(task, now));

    const totalTasks = allTasks.length;
    const completedCount = completedTasks.length;
    const onTimeCount = onTimeTasks.length;

    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const onTimeRate = completedCount > 0 ? Math.round((onTimeCount / completedCount) * 100) : 0;

    const staffSubmissions = allTasks.flatMap((task) => getStaffSubmissions(task, staff._id));
    const approvedSubmissions = staffSubmissions.filter((submission) => submission.status === 'Approved').length;
    const revisionSubmissions = staffSubmissions.filter((submission) => submission.status === 'Revision Required').length;
    const revisionTasks = allTasks.filter((task) => REVISION_STATUSES.includes(task.status)).length;

    const qualityEvents = completedCount + approvedSubmissions + revisionSubmissions + revisionTasks;
    const approvedQualityEvents = completedCount + approvedSubmissions;
    const qualityRate = qualityEvents > 0 ? approvedQualityEvents / qualityEvents : 0;

    const tasksWithUpdates = allTasks.filter((task) =>
        (task.dailyUpdates || []).some((update) => update.staff && String(update.staff) === String(staff._id))
    ).length;
    const activeTasksWithProgress = activeTasks.filter((task) => Number(task.progress || 0) > 0).length;

    const deliveryScore = roundScore((completionRate / 100) * 30);
    const qualityScore = roundScore(clamp((qualityRate * 20) - (revisionSubmissions * 1) - (revisionTasks * 1.5), 0, 20));
    const timelinessScore = roundScore(clamp((onTimeRate / 100) * 15 - (overdueTasks.length * 1.5), 0, 15));
    const ownershipScore = roundScore(clamp(
        (totalTasks > 0 ? (tasksWithUpdates / totalTasks) * 5 : 0) +
        (totalTasks > 0 ? ((tasksWithUpdates + staffSubmissions.length) / totalTasks) * 2.5 : 0) +
        (activeTasks.length > 0 ? (activeTasksWithProgress / activeTasks.length) * 5 : (completedCount > 0 ? 4 : 0)),
        0,
        15
    ));
    const consistency = calculateConsistencyScore(allTasks);
    const consistencyScore = consistency.score;

    // Neutral placeholder until a formal manager-feedback form is added.
    const managerFeedbackScore = totalTasks > 0 && staff.status !== 'Inactive' ? 7 : 0;
    const rewardScore = Math.round(clamp(
        deliveryScore + qualityScore + timelinessScore + ownershipScore + consistencyScore + managerFeedbackScore,
        0,
        100
    ));
    const eligibility = getEligibility(rewardScore);

    let efficiencyTrend = 'new';
    if (totalTasks > 0) {
        if (rewardScore >= 80) efficiencyTrend = 'improving';
        else if (rewardScore >= 65) efficiencyTrend = 'stable';
        else efficiencyTrend = 'needs improvement';
    }

    const scoreBreakdown = [
        { key: 'delivery', label: 'Task Delivery', score: deliveryScore, max: 30 },
        { key: 'quality', label: 'Quality', score: qualityScore, max: 20 },
        { key: 'timeliness', label: 'Timeliness', score: timelinessScore, max: 15 },
        { key: 'ownership', label: 'Ownership', score: ownershipScore, max: 15 },
        { key: 'consistency', label: 'Consistency', score: consistencyScore, max: 10 },
        { key: 'feedback', label: 'Manager Feedback', score: managerFeedbackScore, max: 10 }
    ];

    return {
        _id: staff._id,
        staffName: staff.name,
        name: staff.name,
        role: staff.role,
        status: staff.status,
        currentClient: currentTask?.client?.name || 'No active assignment',
        currentProject: currentTask?.quotation?.projectName || 'No active project',
        performanceScore: completionRate,
        rewardScore,
        eligibilityBand: eligibility.band,
        rewardDecision: eligibility.decision,
        hikeRecommendation: eligibility.hikeRange,
        rewardRecommendation: eligibility.reward,
        eligibilityTone: eligibility.tone,
        tasksCompleted: completedCount,
        totalTasksAssigned: totalTasks,
        onTimeCompletionRate: onTimeRate,
        efficiencyTrend,
        pendingTasks: pendingTasks.length,
        activeTasks: activeTasks.length,
        overdueTasks: overdueTasks.length,
        revisionCount: revisionSubmissions + revisionTasks,
        monthsTracked: consistency.monthsTracked,
        scoreBreakdown,
        evidence: {
            completedTasks: completedCount,
            totalTasks,
            onTimeTasks: onTimeCount,
            overdueTasks: overdueTasks.length,
            approvedSubmissions,
            revisionCount: revisionSubmissions + revisionTasks,
            dailyUpdateCoverage: totalTasks > 0 ? Math.round((tasksWithUpdates / totalTasks) * 100) : 0,
            managerFeedbackMode: managerFeedbackScore > 0 ? 'Neutral default pending admin review' : 'Not rated'
        }
    };
};

export const getStaffAnalytics = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

        const allTasks = await Task.find({ assignedTo: req.params.id })
            .populate('client', 'name')
            .populate('quotation', 'projectName quotationNumber');

        const currentTask = await Task.findOne({
            assignedTo: req.params.id,
            status: { $nin: COMPLETED_STATUSES }
        })
            .populate('client', 'name')
            .populate('quotation', 'projectName')
            .sort({ createdAt: -1 });

        const analytics = buildRewardAnalytics(staff, allTasks, currentTask);

        res.status(200).json({ success: true, data: analytics });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const getAllStaffAnalytics = async (req, res, next) => {
    try {
        const allStaff = await Staff.find();

        const analytics = await Promise.all(allStaff.map(async (staff) => {
            const allTasks = await Task.find({ assignedTo: staff._id });
            return buildRewardAnalytics(staff, allTasks);
        }));

        res.status(200).json({ success: true, count: analytics.length, data: analytics });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
