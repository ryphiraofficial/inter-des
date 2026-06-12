import Task from '../../../models/design/Task.js';

const COMPLETED_STATUSES = [
    'Completed',
    'Approved',
    'Sales Approved',
    'Pending Payment',
    'Pushed to Procurement',
    'Assigned to Procurement',
    'Procurement Approved'
];

export const calculateDesignStaff = async (employee, user) => {
    // 1. Fetch all tasks assigned to the employee
    // assignedTo can be an array of ObjectIds in the Task schema (where designer is in assignedTo)
    const assignedTasks = await Task.find({ assignedTo: employee._id });

    // Handle activity threshold
    if (assignedTasks.length === 0) {
        return null;
    }

    const completedTasks = assignedTasks.filter(task => COMPLETED_STATUSES.includes(task.status));

    // KPI 1: Completion Rate (Weight 30)
    const completionRate = (completedTasks.length / assignedTasks.length) * 100;

    // KPI 2: Quality Rate (Weight 25)
    // approvedSubmissions / submissions (where submittedBy === employee._id)
    let totalSubmissions = 0;
    let approvedSubmissions = 0;
    let revisionCount = 0;

    assignedTasks.forEach(task => {
        if (task.submissions && Array.isArray(task.submissions)) {
            task.submissions.forEach(sub => {
                if (sub.submittedBy && String(sub.submittedBy) === String(user?._id || employee._id)) {
                    totalSubmissions++;
                    if (sub.status === 'Approved') {
                        approvedSubmissions++;
                    } else if (sub.status === 'Revision Required' || sub.status === 'Rejected') {
                        revisionCount++;
                    }
                }
            });
        }
    });

    const qualityRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 100;

    // KPI 3: On-Time Rate (Weight 20)
    let onTimeCount = 0;
    completedTasks.forEach(task => {
        if (task.isOnTime === true) {
            onTimeCount++;
        } else if (task.isOnTime === false) {
            // not on time
        } else if (task.completedAt && task.dueDate) {
            if (new Date(task.completedAt) <= new Date(task.dueDate)) {
                onTimeCount++;
            }
        } else {
            // Assume on-time if no dates (or fallback to on-time so we don't penalize)
            onTimeCount++;
        }
    });

    const onTimeRate = completedTasks.length > 0 ? (onTimeCount / completedTasks.length) * 100 : 100;

    // KPI 4: Ownership / Daily Updates (Weight 15)
    // tasks with updates / assigned tasks
    let tasksWithUpdates = 0;
    assignedTasks.forEach(task => {
        let hasUpdate = false;
        if (task.dailyUpdates && Array.isArray(task.dailyUpdates)) {
            hasUpdate = task.dailyUpdates.some(up => up.staff && String(up.staff) === String(employee._id));
        }
        if (hasUpdate) {
            tasksWithUpdates++;
        }
    });

    const ownershipRate = (tasksWithUpdates / assignedTasks.length) * 100;

    // KPI 5: Consistency Rate (Weight 10)
    const consistencyRate = calculateConsistencyRate(assignedTasks);

    // Weighted Scores
    const wCompletion = Math.round(completionRate * 0.3);
    const wQuality = Math.round(qualityRate * 0.25);
    const wTimeliness = Math.round(onTimeRate * 0.2);
    const wOwnership = Math.round(ownershipRate * 0.15);
    const wConsistency = Math.round(consistencyRate * 0.1);

    const score = Math.min(100, Math.max(0, wCompletion + wQuality + wTimeliness + wOwnership + wConsistency));

    // Calculate other metrics for frontend backwards-compatibility
    const pendingTasks = assignedTasks.filter(task => !COMPLETED_STATUSES.includes(task.status)).length;
    const overdueTasks = assignedTasks.filter(task => {
        if (COMPLETED_STATUSES.includes(task.status)) return false;
        return task.dueDate && new Date(task.dueDate) < new Date();
    }).length;

    return {
        score,
        evidence: {
            assignedTasks: assignedTasks.length,
            completedTasks: completedTasks.length,
            onTime: onTimeCount,
            approved: approvedSubmissions,
            totalSubmissions,
            dailyUpdateCoverage: Math.round(ownershipRate),
            revisionCount,
            overdueTasks,
            pendingTasks
        },
        breakdown: {
            completion: wCompletion,
            quality: wQuality,
            timeliness: wTimeliness,
            ownership: wOwnership,
            consistency: wConsistency
        },
        scoreBreakdown: [
            { key: 'completion', label: 'Task Completion', score: wCompletion, max: 30 },
            { key: 'quality', label: 'Quality', score: wQuality, max: 25 },
            { key: 'timeliness', label: 'Timeliness', score: wTimeliness, max: 20 },
            { key: 'ownership', label: 'Ownership', score: wOwnership, max: 15 },
            { key: 'consistency', label: 'Consistency', score: wConsistency, max: 10 }
        ]
    };
};

const calculateConsistencyRate = (tasks) => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const monthlyTasks = tasks.filter((task) => {
            const createdAt = task.createdAt ? new Date(task.createdAt) : null;
            return createdAt && createdAt >= start && createdAt <= end;
        });
        const completed = monthlyTasks.filter(t => COMPLETED_STATUSES.includes(t.status)).length;
        const rate = monthlyTasks.length > 0 ? (completed / monthlyTasks.length) * 100 : null;
        buckets.push(rate);
    }
    const activeBuckets = buckets.filter((rate) => rate !== null);
    if (activeBuckets.length === 0) return 0;
    const average = activeBuckets.reduce((sum, rate) => sum + rate, 0) / activeBuckets.length;
    const variance = activeBuckets.reduce((sum, rate) => sum + Math.pow(rate - average, 2), 0) / activeBuckets.length;
    const stability = Math.max(0, Math.min(1, 1 - (Math.sqrt(variance) / 100)));
    return (average / 100) * 60 + stability * 40;
};
