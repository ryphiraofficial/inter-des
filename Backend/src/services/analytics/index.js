import User from '../../models/admin/User.js';
import { calculateDesignStaff } from './calculators/designStaff.js';
import { calculateDesignManager } from './calculators/designManager.js';
import { calculateProcurementStaff } from './calculators/procurementStaff.js';
import { calculateProcurementManager } from './calculators/procurementManager.js';
import { calculateProductionStaff } from './calculators/productionStaff.js';
import { calculateProductionManager } from './calculators/productionManager.js';
import { calculateSiteEngineer } from './calculators/siteEngineer.js';

const getEligibilityTone = (band) => {
    switch (band) {
        case 'Exceptional': return 'excellent';
        case 'Good': return 'strong';
        case 'Satisfactory': return 'good';
        case 'Needs Improvement': return 'watch';
        case 'Poor': return 'risk';
        default: return 'watch';
    }
};

const getRewardDecision = (band) => {
    switch (band) {
        case 'Exceptional': return 'High hike + reward';
        case 'Good': return 'Hike + reward eligible';
        case 'Satisfactory': return 'Standard hike eligible';
        case 'Needs Improvement': return 'Performance review required';
        case 'Poor': return 'Performance review required';
        default: return 'Pending review';
    }
};

const getRewardRecommendation = (band) => {
    switch (band) {
        case 'Exceptional': return 'Exceptional performance this cycle. Recommended for fast-track promotion.';
        case 'Good': return 'Strong contribution across key metrics. Eligible for performance bonus.';
        case 'Satisfactory': return 'Consistent and satisfactory delivery. Meets all core job expectations.';
        case 'Needs Improvement': return 'Performance below standard. Performance Improvement Plan (PIP) recommended.';
        case 'Poor': return 'Critical performance issues. Immediate administrative review required.';
        default: return 'No recommendation yet';
    }
};

export const calculateEmployeeAnalytics = async (employee) => {
    if (!employee) return null;

    // 1. Fetch corresponding User account
    let user = null;
    if (employee.staffId) {
        user = await User.findOne({ staffId: employee.staffId });
    }
    if (!user && employee.email) {
        user = await User.findOne({ email: employee.email });
    }

    // 2. Select calculator based on employee's role
    const role = employee.role || '';
    let result = null;

    if (role === 'Design Staff') {
        result = await calculateDesignStaff(employee, user);
    } else if (role === 'Design Manager') {
        result = await calculateDesignManager(employee, user);
    } else if (role === 'Procurement Staff') {
        result = await calculateProcurementStaff(employee, user);
    } else if (role === 'Procurement Manager') {
        result = await calculateProcurementManager(employee, user);
    } else if (role === 'Production Staff' || role.toLowerCase() === 'carpenter') {
        result = await calculateProductionStaff(employee, user);
    } else if (role === 'Production Manager' || role === 'Project Manager') {
        result = await calculateProductionManager(employee, user);
    } else if (role === 'Site Engineer' || role === 'Project Engineer' || role === 'Supervisor') {
        result = await calculateSiteEngineer(employee, user);
    } else {
        // Fallback for any other roles to Design Staff logic
        result = await calculateDesignStaff(employee, user);
    }

    // 3. Handle Insufficient Data
    if (!result) {
        return {
            _id: employee._id,
            employeeId: employee.staffId || employee._id,
            staffId: employee.staffId,
            staffName: employee.name,
            name: employee.name,
            role: employee.role,
            status: employee.status || 'Active',
            score: null,
            band: 'Insufficient Data',
            hike: 'N/A',
            evidence: {},
            breakdown: {},
            
            // Legacy UI compatibility fields
            rewardScore: null,
            performanceScore: null,
            eligibilityBand: 'Insufficient Data',
            hikeRecommendation: 'N/A',
            eligibilityTone: 'watch',
            rewardDecision: 'N/A',
            rewardRecommendation: 'Insufficient activity to evaluate performance.',
            scoreBreakdown: [],
            tasksCompleted: 0,
            totalTasksAssigned: 0,
            onTimeCompletionRate: 0,
            pendingTasks: 0,
            overdueTasks: 0,
            revisionCount: 0,
            currentClient: 'N/A',
            currentProject: 'N/A',
            efficiencyTrend: 'new'
        };
    }

    // 4. Compute performance details based on score
    const roundedScore = Math.round(result.score);
    let band = 'Poor';
    let hike = '0%';

    if (roundedScore >= 90 && roundedScore <= 100) {
        band = 'Exceptional';
        hike = '12-15%';
    } else if (roundedScore >= 75 && roundedScore <= 89) {
        band = 'Good';
        hike = '8-12%';
    } else if (roundedScore >= 60 && roundedScore <= 74) {
        band = 'Satisfactory';
        hike = '5-8%';
    } else if (roundedScore >= 40 && roundedScore <= 59) {
        band = 'Needs Improvement';
        hike = '0-3%';
    } else {
        band = 'Poor';
        hike = '0%';
    }

    // 5. Structure response with both spec-compliant and legacy UI fields
    const completedVal = result.evidence.completedTasks !== undefined ? result.evidence.completedTasks :
                       (result.evidence.processedPOs !== undefined ? result.evidence.processedPOs :
                       (result.evidence.completedVisits !== undefined ? result.evidence.completedVisits : 0));

    const totalVal = result.evidence.totalTasks !== undefined ? result.evidence.totalTasks :
                     (result.evidence.totalPOs !== undefined ? result.evidence.totalPOs :
                     (result.evidence.expectedVisits !== undefined ? result.evidence.expectedVisits : 0));

    const onTimeRate = result.evidence.onTime !== undefined ? 
                       Math.round((result.evidence.onTime / (result.evidence.completedTasks || 1)) * 100) :
                       (result.evidence.averageProcurementSpeedDays !== undefined ? 95 : 100);

    return {
        _id: employee._id,
        employeeId: employee.staffId || employee._id,
        staffId: employee.staffId,
        staffName: employee.name,
        name: employee.name,
        role: employee.role,
        status: employee.status || 'Active',
        
        // Spec-compliant fields
        score: roundedScore,
        band,
        hike,
        evidence: result.evidence,
        breakdown: result.breakdown,

        // Legacy UI compatibility fields
        rewardScore: roundedScore,
        performanceScore: roundedScore,
        eligibilityBand: band,
        hikeRecommendation: hike,
        eligibilityTone: getEligibilityTone(band),
        rewardDecision: getRewardDecision(band),
        rewardRecommendation: getRewardRecommendation(band),
        scoreBreakdown: result.scoreBreakdown,
        tasksCompleted: completedVal,
        totalTasksAssigned: totalVal,
        onTimeCompletionRate: onTimeRate,
        pendingTasks: result.evidence.pendingTasks || 0,
        overdueTasks: result.evidence.overdueTasks || 0,
        revisionCount: result.evidence.revisionCount || 0,
        currentClient: 'N/A',
        currentProject: 'N/A',
        efficiencyTrend: roundedScore >= 80 ? 'improving' : (roundedScore >= 60 ? 'stable' : 'needs improvement')
    };
};
