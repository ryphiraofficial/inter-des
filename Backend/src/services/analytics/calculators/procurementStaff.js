import PurchaseOrder from '../../../models/procurement/PurchaseOrder.js';
import MaterialRequest from '../../../models/procurement/MaterialRequest.js';
import VendorComparison from '../../../models/procurement/VendorComparison.js';

export const calculateProcurementStaff = async (employee, user) => {
    if (!user) {
        return null; // Requires user account to fetch procurement actions
    }

    // Fetch primary objects
    const assignedPOs = await PurchaseOrder.find({ createdBy: user._id });
    const assignedRequests = await MaterialRequest.find({ assignedTo: user._id });
    const comparisons = await VendorComparison.find({ createdBy: user._id });

    // Handle activity threshold
    if (assignedPOs.length === 0 && assignedRequests.length === 0 && comparisons.length === 0) {
        return null;
    }

    // KPI 1: PO Processing (Weight 30)
    // Processed POs are those NOT in Draft status (they have been submitted/ordered/approved)
    const processedPOs = assignedPOs.filter(po => po.status && po.status !== 'Draft');
    const poProcessingRate = assignedPOs.length > 0 ? (processedPOs.length / assignedPOs.length) * 100 : 100;

    // KPI 2: Request Resolution (Weight 25)
    // Resolved Requests are those that have status: 'Completed', 'Procurement Approved', 'Approved', 'Purchasing', 'Sent to Accounts'
    const RESOLVED_MR_STATUSES = ['Completed', 'Procurement Approved', 'Approved', 'Purchasing', 'Sent to Accounts'];
    const resolvedRequests = assignedRequests.filter(mr => mr.status && RESOLVED_MR_STATUSES.includes(mr.status));
    const requestResolutionRate = assignedRequests.length > 0 ? (resolvedRequests.length / assignedRequests.length) * 100 : 100;

    // KPI 3: Procurement Speed (Weight 20)
    // Turnaround time for MR completion (createdAt to completedAt or updatedAt if completed)
    let totalMRTurnaroundDays = 0;
    let completedMRCount = 0;

    assignedRequests.forEach(mr => {
        if (mr.status === 'Completed' || mr.status === 'Procurement Approved') {
            completedMRCount++;
            const end = mr.updatedAt || new Date();
            const start = mr.createdAt || new Date();
            const days = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
            totalMRTurnaroundDays += Math.max(0.1, days);
        }
    });

    let procurementSpeed = 100;
    if (completedMRCount > 0) {
        const avgDays = totalMRTurnaroundDays / completedMRCount;
        if (avgDays <= 3) procurementSpeed = 100;
        else if (avgDays <= 5) procurementSpeed = 90;
        else if (avgDays <= 7) procurementSpeed = 75;
        else if (avgDays <= 10) procurementSpeed = 60;
        else procurementSpeed = Math.max(0, 100 - avgDays * 4);
    }

    // KPI 4: Documentation Accuracy (Weight 15)
    // vendor comparisons that were approved or used to create POs vs total comparisons
    const approvedComparisons = comparisons.filter(vc => vc.status === 'Approved' || vc.status === 'PO Created');
    const documentationAccuracyRate = comparisons.length > 0 ? (approvedComparisons.length / comparisons.length) * 100 : 100;

    // KPI 5: Consistency (Weight 10)
    const consistencyRate = calculateMRConsistency(assignedRequests, RESOLVED_MR_STATUSES);

    // Weighted Scores
    const wPOProcessing = Math.round(poProcessingRate * 0.3);
    const wRequestResolution = Math.round(requestResolutionRate * 0.25);
    const wProcurementSpeed = Math.round(procurementSpeed * 0.2);
    const wDocAccuracy = Math.round(documentationAccuracyRate * 0.15);
    const wConsistency = Math.round(consistencyRate * 0.1);

    const score = Math.min(100, Math.max(0, wPOProcessing + wRequestResolution + wProcurementSpeed + wDocAccuracy + wConsistency));

    return {
        score,
        evidence: {
            processedPOs: processedPOs.length,
            totalPOs: assignedPOs.length,
            resolvedRequests: resolvedRequests.length,
            totalRequests: assignedRequests.length,
            averageProcurementSpeedDays: completedMRCount > 0 ? Math.round((totalMRTurnaroundDays / completedMRCount) * 10) / 10 : 0,
            accurateDocumentsCount: approvedComparisons.length,
            totalComparisons: comparisons.length
        },
        breakdown: {
            poProcessing: wPOProcessing,
            requestResolution: wRequestResolution,
            procurementSpeed: wProcurementSpeed,
            documentationAccuracy: wDocAccuracy,
            consistency: wConsistency
        },
        scoreBreakdown: [
            { key: 'poProcessing', label: 'PO Processing', score: wPOProcessing, max: 30 },
            { key: 'requestResolution', label: 'Request Resolution', score: wRequestResolution, max: 25 },
            { key: 'procurementSpeed', label: 'Procurement Speed', score: wProcurementSpeed, max: 20 },
            { key: 'documentationAccuracy', label: 'Doc Accuracy', score: wDocAccuracy, max: 15 },
            { key: 'consistency', label: 'Consistency', score: wConsistency, max: 10 }
        ]
    };
};

const calculateMRConsistency = (requests, resolvedStatuses) => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const monthlyRequests = requests.filter((mr) => {
            const createdAt = mr.createdAt ? new Date(mr.createdAt) : null;
            return createdAt && createdAt >= start && createdAt <= end;
        });
        const completed = monthlyRequests.filter(mr => resolvedStatuses.includes(mr.status)).length;
        const rate = monthlyRequests.length > 0 ? (completed / monthlyRequests.length) * 100 : null;
        buckets.push(rate);
    }
    const activeBuckets = buckets.filter((rate) => rate !== null);
    if (activeBuckets.length === 0) return 0;
    const average = activeBuckets.reduce((sum, rate) => sum + rate, 0) / activeBuckets.length;
    const variance = activeBuckets.reduce((sum, rate) => sum + Math.pow(rate - average, 2), 0) / activeBuckets.length;
    const stability = Math.max(0, Math.min(1, 1 - (Math.sqrt(variance) / 100)));
    return (average / 100) * 60 + stability * 40;
};
