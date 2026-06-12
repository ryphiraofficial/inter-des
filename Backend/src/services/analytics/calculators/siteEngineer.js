import SiteVisit from '../../../models/production/SiteVisit.js';
import SiteProgressReport from '../../../models/production/SiteProgressReport.js';
import SafetyLog from '../../../models/production/SafetyLog.js';
import ProductionTask from '../../../models/production/ProductionTask.js';

export const calculateSiteEngineer = async (employee, user) => {
    // 1. Fetch site visits completed by this employee
    const visits = await SiteVisit.find({ staff: employee._id });

    // 2. Fetch progress reports submitted by this user
    let reports = [];
    let safetyLogs = [];
    let assignedTasks = [];

    if (user) {
        reports = await SiteProgressReport.find({ submittedBy: user._id });
        safetyLogs = await SafetyLog.find({ reportedBy: user._id });
        assignedTasks = await ProductionTask.find({ assignedTo: user._id });
    }

    // Handle activity threshold
    if (visits.length === 0 && reports.length === 0 && safetyLogs.length === 0 && assignedTasks.length === 0) {
        return null;
    }

    // KPI 1: Site Visits Completed (Weight 25)
    // Expected site visits based on assigned tasks or a baseline of 3
    const expectedVisits = Math.max(3, assignedTasks.length * 2);
    const siteVisitsCompletedRate = Math.min(100, (visits.length / expectedVisits) * 100);

    // KPI 2: Progress Reporting (Weight 25)
    // Progress reports submitted compared to site visits completed (expecting at least 1 report per visit)
    const progressReportingRate = Math.min(100, (reports.length / (visits.length || 1)) * 100);

    // KPI 3: Issue Resolution (Weight 25)
    // Resolved safety/site logs reported by this Site Engineer vs total
    const resolvedSafetyLogs = safetyLogs.filter(log => log.status === 'Resolved');
    const issueResolutionRate = safetyLogs.length > 0 ? (resolvedSafetyLogs.length / safetyLogs.length) * 100 : 100;

    // KPI 4: Inspection Quality (Weight 15)
    // Measures safety check quality based on presence of critical incidents
    const criticalIncidents = safetyLogs.filter(log => log.type === 'Incident' && (log.severity === 'Critical' || log.severity === 'High'));
    const inspectionQualityRate = Math.max(0, 100 - criticalIncidents.length * 25);

    // KPI 5: Timeliness (Weight 10)
    // Percentage of completed production tasks that were on-time
    const completedTasks = assignedTasks.filter(t => t.status === 'Completed');
    let onTimeCount = 0;

    completedTasks.forEach(task => {
        if (task.dueDate && task.updatedAt) {
            if (new Date(task.updatedAt) <= new Date(task.dueDate)) {
                onTimeCount++;
            }
        } else {
            onTimeCount++; // If no due date, count as on time
        }
    });

    const timelinessRate = completedTasks.length > 0 ? (onTimeCount / completedTasks.length) * 100 : 100;

    // Weighted Scores
    const wSiteVisits = Math.round(siteVisitsCompletedRate * 0.25);
    const wProgressReporting = Math.round(progressReportingRate * 0.25);
    const wIssueResolution = Math.round(issueResolutionRate * 0.25);
    const wInspectionQuality = Math.round(inspectionQualityRate * 0.15);
    const wTimeliness = Math.round(timelinessRate * 0.1);

    const score = Math.min(100, Math.max(0, wSiteVisits + wProgressReporting + wIssueResolution + wInspectionQuality + wTimeliness));

    return {
        score,
        evidence: {
            completedVisits: visits.length,
            expectedVisits,
            reportsSubmitted: reports.length,
            resolvedIssues: resolvedSafetyLogs.length,
            reportedIssues: safetyLogs.length,
            criticalSafetyIncidents: criticalIncidents.length
        },
        breakdown: {
            siteVisitsCompleted: wSiteVisits,
            progressReporting: wProgressReporting,
            issueResolution: wIssueResolution,
            inspectionQuality: wInspectionQuality,
            timeliness: wTimeliness
        },
        scoreBreakdown: [
            { key: 'siteVisitsCompleted', label: 'Site Visits', score: wSiteVisits, max: 25 },
            { key: 'progressReporting', label: 'Reporting', score: wProgressReporting, max: 25 },
            { key: 'issueResolution', label: 'Issue Resolution', score: wIssueResolution, max: 25 },
            { key: 'inspectionQuality', label: 'Inspection Quality', score: wInspectionQuality, max: 15 },
            { key: 'timeliness', label: 'Timeliness', score: wTimeliness, max: 10 }
        ]
    };
};
