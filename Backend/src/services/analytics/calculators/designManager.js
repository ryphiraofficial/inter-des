import Task from '../../../models/design/Task.js';
import Project from '../../../models/design/Project.js';
import Staff from '../../../models/admin/Staff.js';
import { calculateDesignStaff } from './designStaff.js';

const COMPLETED_STATUSES = [
    'Completed',
    'Approved',
    'Sales Approved',
    'Pending Payment',
    'Pushed to Procurement',
    'Assigned to Procurement',
    'Procurement Approved'
];

export const calculateDesignManager = async (employee, user) => {
    if (!user) {
        return null; // Requires user account to fetch manager actions
    }

    // 1. Fetch projects managed by this design manager
    const managedProjects = await Project.find({ assignedDesignManager: user._id });
    const projectIds = managedProjects.map(p => p._id);

    // 2. Fetch tasks in scope (associated with managed projects, created by manager, or reviewed by manager)
    const scopeTasks = await Task.find({
        $or: [
            { project: { $in: projectIds } },
            { createdBy: user._id },
            { 'submissions.reviewedBy': user._id }
        ]
    });

    // We consider it active if there are managed projects or tasks in scope
    if (managedProjects.length === 0 && scopeTasks.length === 0) {
        return null;
    }

    // KPI 1: Reviews Processed (Weight 25)
    let reviewsCompleted = 0;
    let totalSubmissions = 0;
    let totalTurnaroundTime = 0;
    let approvedSubmissions = 0;

    scopeTasks.forEach(task => {
        if (task.submissions && Array.isArray(task.submissions)) {
            task.submissions.forEach(sub => {
                totalSubmissions++;
                if (sub.reviewedBy && String(sub.reviewedBy) === String(user._id)) {
                    reviewsCompleted++;
                    if (sub.status === 'Approved') {
                        approvedSubmissions++;
                    }
                    if (sub.reviewedAt && sub.submittedAt) {
                        const duration = new Date(sub.reviewedAt) - new Date(sub.submittedAt);
                        totalTurnaroundTime += Math.max(0, duration);
                    }
                }
            });
        }
    });

    const reviewsProcessedRate = totalSubmissions > 0 ? (reviewsCompleted / totalSubmissions) * 100 : 100;

    // KPI 2: Approval Turnaround (Weight 25)
    let approvalSpeed = 100;
    if (reviewsCompleted > 0) {
        const avgTurnaroundHours = (totalTurnaroundTime / reviewsCompleted) / (1000 * 60 * 60);
        if (avgTurnaroundHours <= 12) approvalSpeed = 100;
        else if (avgTurnaroundHours <= 24) approvalSpeed = 90;
        else if (avgTurnaroundHours <= 48) approvalSpeed = 75;
        else if (avgTurnaroundHours <= 72) approvalSpeed = 60;
        else approvalSpeed = Math.max(0, 100 - avgTurnaroundHours);
    }

    // KPI 3: Team Performance (Weight 25)
    // Find design staff assigned to tasks in the manager's scope
    const staffIds = new Set();
    scopeTasks.forEach(task => {
        if (task.assignedTo && Array.isArray(task.assignedTo)) {
            task.assignedTo.forEach(id => staffIds.add(String(id)));
        }
    });

    let teamPerformanceRate = 75; // Default neutral if no team
    let teamMemberCount = 0;
    if (staffIds.size > 0) {
        const teamStaff = await Staff.find({ _id: { $in: Array.from(staffIds) } });
        let totalTeamScore = 0;
        let ratedCount = 0;

        for (const staff of teamStaff) {
            // Avoid recursive infinite loop: calculate design staff performance
            const result = await calculateDesignStaff(staff, null);
            if (result && result.score !== null) {
                totalTeamScore += result.score;
                ratedCount++;
            }
        }
        if (ratedCount > 0) {
            teamPerformanceRate = totalTeamScore / ratedCount;
        }
        teamMemberCount = teamStaff.length;
    }

    // KPI 4: Review Quality (Weight 15)
    // Percentage of approved submissions vs total reviewed by manager
    const reviewQualityRate = reviewsCompleted > 0 ? (approvedSubmissions / reviewsCompleted) * 100 : 100;

    // KPI 5: Escalation Handling (Weight 10)
    // Resolve blocked or critical tasks
    const criticalTasks = scopeTasks.filter(t => t.priority === 'Critical' || t.priority === 'High' || t.status === 'Blocked');
    const resolvedCriticalTasks = criticalTasks.filter(t => COMPLETED_STATUSES.includes(t.status));
    const escalationHandlingRate = criticalTasks.length > 0 ? (resolvedCriticalTasks.length / criticalTasks.length) * 100 : 100;

    // Weighted Scores
    const wReviewsProcessed = Math.round(reviewsProcessedRate * 0.25);
    const wApprovalSpeed = Math.round(approvalSpeed * 0.25);
    const wTeamPerformance = Math.round(teamPerformanceRate * 0.25);
    const wReviewQuality = Math.round(reviewQualityRate * 0.15);
    const wEscalationHandling = Math.round(escalationHandlingRate * 0.1);

    const score = Math.min(100, Math.max(0, wReviewsProcessed + wApprovalSpeed + wTeamPerformance + wReviewQuality + wEscalationHandling));

    return {
        score,
        evidence: {
            reviewsCompleted,
            expectedReviews: totalSubmissions,
            averageTurnaroundHours: reviewsCompleted > 0 ? Math.round((totalTurnaroundTime / reviewsCompleted) / (1000 * 60 * 60) * 10) / 10 : 0,
            teamMemberCount,
            criticalTasksCount: criticalTasks.length,
            resolvedCriticalTasksCount: resolvedCriticalTasks.length,
            approvedSubmissions
        },
        breakdown: {
            reviewsProcessed: wReviewsProcessed,
            approvalSpeed: wApprovalSpeed,
            teamPerformance: wTeamPerformance,
            reviewQuality: wReviewQuality,
            escalationHandling: wEscalationHandling
        },
        scoreBreakdown: [
            { key: 'reviewsProcessed', label: 'Reviews Processed', score: wReviewsProcessed, max: 25 },
            { key: 'approvalSpeed', label: 'Approval Speed', score: wApprovalSpeed, max: 25 },
            { key: 'teamPerformance', label: 'Team Performance', score: wTeamPerformance, max: 25 },
            { key: 'reviewQuality', label: 'Review Quality', score: wReviewQuality, max: 15 },
            { key: 'escalationHandling', label: 'Escalation Handling', score: wEscalationHandling, max: 10 }
        ]
    };
};
