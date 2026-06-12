import PurchaseOrder from '../../../models/procurement/PurchaseOrder.js';
import MaterialRequest from '../../../models/procurement/MaterialRequest.js';
import Project from '../../../models/design/Project.js';
import Vendor from '../../../models/procurement/Vendor.js';
import Staff from '../../../models/admin/Staff.js';
import User from '../../../models/admin/User.js';
import { calculateProcurementStaff } from './procurementStaff.js';

export const calculateProcurementManager = async (employee, user) => {
    if (!user) {
        return null; // Requires user account to fetch manager actions
    }

    // 1. Fetch projects managed by this procurement manager
    const managedProjects = await Project.find({ assignedProcurementManager: user._id });
    const projectIds = managedProjects.map(p => p._id);

    // 2. Fetch POs approved by this manager or linked to managed projects
    const approvedPOs = await PurchaseOrder.find({
        $or: [
            { approvedBy: user._id },
            { project: { $in: projectIds } }
        ]
    });

    if (managedProjects.length === 0 && approvedPOs.length === 0) {
        return null;
    }

    // KPI 1: Approval Efficiency (Weight 25)
    // Turnaround speed from PO creation to approval (approvedBy === user._id)
    let totalPOTurnaroundHours = 0;
    let approvalCount = 0;

    approvedPOs.forEach(po => {
        if (po.approvedBy && String(po.approvedBy) === String(user._id) && po.approvedAt && po.createdAt) {
            approvalCount++;
            const duration = new Date(po.approvedAt) - new Date(po.createdAt);
            totalPOTurnaroundHours += Math.max(0, duration) / (1000 * 60 * 60);
        }
    });

    let approvalEfficiencyRate = 100;
    if (approvalCount > 0) {
        const avgHours = totalPOTurnaroundHours / approvalCount;
        if (avgHours <= 12) approvalEfficiencyRate = 100;
        else if (avgHours <= 24) approvalEfficiencyRate = 90;
        else if (avgHours <= 48) approvalEfficiencyRate = 75;
        else if (avgHours <= 72) approvalEfficiencyRate = 60;
        else approvalEfficiencyRate = Math.max(0, 100 - avgHours);
    }

    // KPI 2: Budget Compliance (Weight 25)
    let budgetComplianceRate = 100;
    let totalBudget = 0;
    let totalSpent = 0;

    managedProjects.forEach(proj => {
        if (proj.budget && proj.budget > 0) {
            totalBudget += proj.budget;
            totalSpent += proj.spent || 0;
        }
    });

    if (totalBudget > 0) {
        if (totalSpent <= totalBudget) {
            budgetComplianceRate = 100;
        } else {
            const overspendPercent = ((totalSpent - totalBudget) / totalBudget) * 100;
            budgetComplianceRate = Math.max(0, 100 - overspendPercent);
        }
    }

    // KPI 3: Vendor Performance (Weight 20)
    // Average rating of vendors used in manager's approved POs
    let vendorPerformanceRate = 75; // Neutral default
    if (approvedPOs.length > 0) {
        const vendorIds = [...new Set(approvedPOs.map(po => po.vendor).filter(Boolean))];
        if (vendorIds.length > 0) {
            const vendors = await Vendor.find({ _id: { $in: vendorIds } });
            let totalRating = 0;
            let ratingCount = 0;
            vendors.forEach(v => {
                if (v.rating && v.rating > 0) {
                    totalRating += v.rating;
                    ratingCount++;
                }
            });
            if (ratingCount > 0) {
                // Normalize 0-5 rating to 0-100 scale
                vendorPerformanceRate = (totalRating / ratingCount) * 20;
            }
        }
    }

    // KPI 4: Team Productivity (Weight 20)
    // Average score of procurement staff
    let teamProductivityRate = 75; // Neutral default
    const procurementStaffList = await Staff.find({ role: 'Procurement Staff' });
    if (procurementStaffList.length > 0) {
        let totalStaffScore = 0;
        let staffCount = 0;
        for (const staff of procurementStaffList) {
            const staffUser = await User.findOne({ staffId: staff.staffId });
            const result = await calculateProcurementStaff(staff, staffUser);
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
    // Percentage of POs that are in 'Approved' or 'Received' vs total POs
    const totalPOs = approvedPOs.length;
    const verifiedPOs = approvedPOs.filter(po => po.status === 'Approved' || po.status === 'Received' || po.status === 'Ordered').length;
    const reportingAccuracyRate = totalPOs > 0 ? (verifiedPOs / totalPOs) * 100 : 100;

    // Weighted Scores
    const wApprovalEfficiency = Math.round(approvalEfficiencyRate * 0.25);
    const wBudgetCompliance = Math.round(budgetComplianceRate * 0.25);
    const wVendorPerf = Math.round(vendorPerformanceRate * 0.2);
    const wTeamProd = Math.round(teamProductivityRate * 0.2);
    const wReportingAcc = Math.round(reportingAccuracyRate * 0.1);

    const score = Math.min(100, Math.max(0, wApprovalEfficiency + wBudgetCompliance + wVendorPerf + wTeamProd + wReportingAcc));

    return {
        score,
        evidence: {
            approvedPOs: approvalCount,
            averageApprovalTurnaroundHours: approvalCount > 0 ? Math.round((totalPOTurnaroundHours / approvalCount) * 10) / 10 : 0,
            budgetLimit: totalBudget,
            actualSpent: totalSpent,
            averageVendorRating: approvedPOs.length > 0 ? Math.round((vendorPerformanceRate / 20) * 10) / 10 : 0,
            totalProjects: managedProjects.length
        },
        breakdown: {
            approvalEfficiency: wApprovalEfficiency,
            budgetCompliance: wBudgetCompliance,
            vendorPerformance: wVendorPerf,
            teamProductivity: wTeamProd,
            reportingAccuracy: wReportingAcc
        },
        scoreBreakdown: [
            { key: 'approvalEfficiency', label: 'Approval Efficiency', score: wApprovalEfficiency, max: 25 },
            { key: 'budgetCompliance', label: 'Budget Compliance', score: wBudgetCompliance, max: 25 },
            { key: 'vendorPerformance', label: 'Vendor Performance', score: wVendorPerf, max: 20 },
            { key: 'teamProductivity', label: 'Team Productivity', score: wTeamProd, max: 20 },
            { key: 'reportingAccuracy', label: 'Reporting Accuracy', score: wReportingAcc, max: 10 }
        ]
    };
};
