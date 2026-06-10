import ProductionTask from '../../../models/production/ProductionTask.js';
import SiteProgressReport from '../../../models/production/SiteProgressReport.js';
import SupervisorDailyReport from '../../../models/production/SupervisorDailyReport.js';
import SiteAttendance from '../../../models/production/SiteAttendance.js';

export const calculateProductionStaff = async (employee, user) => {
    if (!user) {
        return null; // Requires user account to fetch production actions
    }

    // Fetch primary objects
    const assignedTasks = await ProductionTask.find({ assignedTo: user._id });
    const progressReports = await SiteProgressReport.find({ submittedBy: user._id });
    const dailyReports = await SupervisorDailyReport.find({ submittedBy: user._id });

    // Find attendance records for the employee by name
    const attendanceSheets = await SiteAttendance.find({ 'records.workerName': employee.name });
    let totalAttendanceCount = 0;
    let presentCount = 0;

    attendanceSheets.forEach(sheet => {
        if (sheet.records && Array.isArray(sheet.records)) {
            sheet.records.forEach(rec => {
                if (rec.workerName === employee.name) {
                    totalAttendanceCount++;
                    if (rec.status === 'Present') {
                        presentCount++;
                    } else if (rec.status === 'Half-Day') {
                        presentCount += 0.5;
                    }
                }
            });
        }
    });

    const totalReports = progressReports.length + dailyReports.length;

    // Handle activity threshold
    if (assignedTasks.length === 0 && totalReports === 0 && totalAttendanceCount === 0) {
        return null;
    }

    // KPI 1: Task Completion (Weight 35)
    const completedTasks = assignedTasks.filter(t => t.status === 'Completed');
    const taskCompletionRate = assignedTasks.length > 0 ? (completedTasks.length / assignedTasks.length) * 100 : 100;

    // KPI 2: Quality Compliance (Weight 25)
    // Percentage of progress reports that are 'On Track' or 'Completed' vs total progress reports
    const onTrackReports = progressReports.filter(r => r.workStatus === 'On Track' || r.workStatus === 'Completed');
    const qualityComplianceRate = progressReports.length > 0 ? (onTrackReports.length / progressReports.length) * 100 : 100;

    // KPI 3: Attendance (Weight 15)
    const attendanceRate = totalAttendanceCount > 0 ? (presentCount / totalAttendanceCount) * 100 : 100;

    // KPI 4: Reporting (Weight 15)
    // Reports submitted vs completed tasks (expecting at least 1 report per completed task)
    const reportingRate = Math.min(100, (totalReports / (completedTasks.length || 1)) * 100);

    // KPI 5: Consistency (Weight 10)
    const consistencyRate = calculateProdTaskConsistency(assignedTasks);

    // Weighted Scores
    const wTaskCompletion = Math.round(taskCompletionRate * 0.35);
    const wQualityCompliance = Math.round(qualityComplianceRate * 0.25);
    const wAttendance = Math.round(attendanceRate * 0.15);
    const wReporting = Math.round(reportingRate * 0.15);
    const wConsistency = Math.round(consistencyRate * 0.1);

    const score = Math.min(100, Math.max(0, wTaskCompletion + wQualityCompliance + wAttendance + wReporting + wConsistency));

    return {
        score,
        evidence: {
            completedTasks: completedTasks.length,
            totalTasks: assignedTasks.length,
            onTrackReports: onTrackReports.length,
            totalReports,
            presentDays: presentCount,
            totalDays: totalAttendanceCount
        },
        breakdown: {
            taskCompletion: wTaskCompletion,
            qualityCompliance: wQualityCompliance,
            attendance: wAttendance,
            reporting: wReporting,
            consistency: wConsistency
        },
        scoreBreakdown: [
            { key: 'taskCompletion', label: 'Task Completion', score: wTaskCompletion, max: 35 },
            { key: 'qualityCompliance', label: 'Quality Compliance', score: wQualityCompliance, max: 25 },
            { key: 'attendance', label: 'Attendance', score: wAttendance, max: 15 },
            { key: 'reporting', label: 'Reporting', score: wReporting, max: 15 },
            { key: 'consistency', label: 'Consistency', score: wConsistency, max: 10 }
        ]
    };
};

const calculateProdTaskConsistency = (tasks) => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const monthlyTasks = tasks.filter((t) => {
            const createdAt = t.createdAt ? new Date(t.createdAt) : null;
            return createdAt && createdAt >= start && createdAt <= end;
        });
        const completed = monthlyTasks.filter(t => t.status === 'Completed').length;
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
