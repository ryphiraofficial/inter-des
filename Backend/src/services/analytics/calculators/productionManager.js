import ProductionProject from '../../../models/production/ProductionProject.js';
import SiteProgressReport from '../../../models/production/SiteProgressReport.js';
import SupervisorDailyReport from '../../../models/production/SupervisorDailyReport.js';
import Staff from '../../../models/admin/Staff.js';
import User from '../../../models/admin/User.js';
import { calculateProductionStaff } from './productionStaff.js';

export const calculateProductionManager = async (employee, user) => {
    if (!user) {
        return null; // Requires user account to fetch manager actions
    }

    // 1. Fetch production projects managed by this PM
    const managedProjects = await ProductionProject.find({ projectManager: user._id });
    const projectIds = managedProjects.map(p => p._id);

    if (managedProjects.length === 0) {
        return null;
    }

    // 2. Fetch supervisor reports and progress reports linked to managed projects
    const supervisorReports = await SupervisorDailyReport.find({ project: { $in: projectIds } });
    const progressReports = await SiteProgressReport.find({ project: { $in: projectIds } });

    // KPI 1: Project Completion (Weight 30)
    const completedProjects = managedProjects.filter(p => p.status === 'Completed' || p.status === 'Admin Approved');
    const projectCompletionRate = (completedProjects.length / managedProjects.length) * 100;

    // KPI 2: Resource Utilization (Weight 20)
    // Based on labor count reported in Supervisor Daily Reports
    let totalLaborCount = 0;
    let reportCount = 0;
    supervisorReports.forEach(r => {
        if (typeof r.laborCount === 'number') {
            totalLaborCount += r.laborCount;
            reportCount++;
        }
    });

    let resourceUtilizationRate = 100;
    let avgLabor = 0;
    if (reportCount > 0) {
        avgLabor = totalLaborCount / reportCount;
        if (avgLabor >= 5) resourceUtilizationRate = 100;
        else if (avgLabor >= 3) resourceUtilizationRate = 85;
        else if (avgLabor >= 1) resourceUtilizationRate = 70;
        else resourceUtilizationRate = 50;
    }

    // KPI 3: Delay Reduction (Weight 20)
    // Percentage of progress reports that are NOT 'Delayed'
    const delayedReports = progressReports.filter(r => r.workStatus === 'Delayed');
    const delayReductionRate = progressReports.length > 0 ? (1 - (delayedReports.length / progressReports.length)) * 100 : 100;

    // KPI 4: Team Productivity (Weight 20)
    // Average score of production staff
    let teamProductivityRate = 75; // Default neutral
    const productionStaffList = await Staff.find({ role: 'Production Staff' });
    if (productionStaffList.length > 0) {
        let totalStaffScore = 0;
        let staffCount = 0;
        for (const staff of productionStaffList) {
            const staffUser = await User.findOne({ staffId: staff.staffId });
            const result = await calculateProductionStaff(staff, staffUser);
            if (result && result.score !== null) {
                totalStaffScore += result.score;
                staffCount++;
            }
        }
        if (staffCount > 0) {
            teamProductivityRate = totalStaffScore / staffCount;
        }
    }

    // KPI 5: Reporting Accuracy (Weight 10)
    // Percentage of progress reports that do not log any issues
    const reportsWithIssues = progressReports.filter(r => r.issues && r.issues.trim().length > 0);
    const reportingAccuracyRate = progressReports.length > 0 ? (1 - (reportsWithIssues.length / progressReports.length)) * 100 : 100;

    // Weighted Scores
    const wProjCompletion = Math.round(projectCompletionRate * 0.3);
    const wResUtilization = Math.round(resourceUtilizationRate * 0.2);
    const wDelayReduction = Math.round(delayReductionRate * 0.2);
    const wTeamProd = Math.round(teamProductivityRate * 0.2);
    const wReportingAcc = Math.round(reportingAccuracyRate * 0.1);

    const score = Math.min(100, Math.max(0, wProjCompletion + wResUtilization + wDelayReduction + wTeamProd + wReportingAcc));

    return {
        score,
        evidence: {
            completedProjects: completedProjects.length,
            totalProjects: managedProjects.length,
            averageLaborCount: Math.round(avgLabor * 10) / 10,
            delayedReportsCount: delayedReports.length,
            totalReportsCount: progressReports.length
        },
        breakdown: {
            projectCompletion: wProjCompletion,
            resourceUtilization: wResUtilization,
            delayReduction: wDelayReduction,
            teamProductivity: wTeamProd,
            reportingAccuracy: wReportingAcc
        },
        scoreBreakdown: [
            { key: 'projectCompletion', label: 'Project Completion', score: wProjCompletion, max: 30 },
            { key: 'resourceUtilization', label: 'Resource Util', score: wResUtilization, max: 20 },
            { key: 'delayReduction', label: 'Delay Reduction', score: wDelayReduction, max: 20 },
            { key: 'teamProductivity', label: 'Team Productivity', score: wTeamProd, max: 20 },
            { key: 'reportingAccuracy', label: 'Reporting Accuracy', score: wReportingAcc, max: 10 }
        ]
    };
};
