import express from 'express';
const router = express.Router();
import { protect, authorize } from '../../middleware/auth.js';
import { isProjectManager, isAssignedUser, isProjectManagerOrEngineer } from '../../middleware/productionAuth.js';

import { createProject, updateProject, assignTeam, acceptHandoff, submitProjectCompletion, adminApproveProductionProject, unlockProject, requestUnlock, rejectUnlockRequest } from '../../controllers/production/productionAssignmentController.js';
import { createTask, assignTask, updateTaskStatus, approveTask, addComment, createSubtask } from '../../controllers/production/productionTaskController.js';
import { getDashboardOverview, getPendingApprovals, getUpcomingDeadlines, getProjectActivity, getDashboardCharts, getKPIMetrics, getProductionReports } from '../../controllers/production/productionMetricsController.js';
import { getProjects, getProjectById, getTasksByProject, getAllTasks, getMyProjects, getTaskById, getHandoffProjects, getCompletedProductionProjects, getUnlockRequests } from '../../controllers/production/productionQueryController.js';
import { getTeamOverview, getSiteTeam, getSupervisors, getProductionStaff, createReplacementRequest, getReplacementRequests, actionReplacementRequest } from '../../controllers/production/productionStaffController.js';
import { getBudgetOverview, getEngineerDashboard, getEngineerTasks, getBudgetAnalytics, getGanttData } from '../../controllers/production/productionDashboardController.js';

import { submitAttendance, getProjectAttendance } from '../../controllers/production/siteAttendanceController.js';
import { reportSafetyIssue, getProjectSafetyLogs, updateSafetyLogStatus } from '../../controllers/production/siteSafetyController.js';
import { submitDailyReport, getProjectReports, submitSupervisorReport, getSupervisorReports, getReceivedSiteReports } from '../../controllers/production/siteReportController.js';


// All routes require authentication
router.use(protect);

// =======================
// PROJECT APIs
// =======================
router.post('/projects/create', createProject);
router.get('/projects', getProjects);
router.get('/projects/handoff', authorize('Project Manager', 'Admin', 'Super Admin'), getHandoffProjects);
router.get('/projects/staff', authorize('Project Manager', 'Admin', 'Super Admin'), getProductionStaff);
router.put('/projects/:id/accept-handoff', isProjectManager, acceptHandoff);
router.get('/projects/:id', isAssignedUser, getProjectById);
router.put('/projects/:id/update', isProjectManager, updateProject);
router.put('/projects/:id/assign-team', isProjectManager, assignTeam);
router.post('/projects/:id/complete', isProjectManager, submitProjectCompletion);

// =======================
// TASK APIs
// =======================
router.post('/tasks/create', isProjectManagerOrEngineer, createTask);
router.put('/tasks/:taskId/assign', isProjectManagerOrEngineer, assignTask);
router.put('/tasks/:taskId/update-status', isAssignedUser, updateTaskStatus);
router.get('/tasks/project/:id', isAssignedUser, getTasksByProject);
router.get('/tasks/all', getAllTasks);
router.get('/tasks/:taskId', getTaskById);
router.post('/tasks/:taskId/comment', addComment);

// =======================
// CONTROL APIs (PM Only)
// =======================
router.put('/tasks/:taskId/approve', isProjectManager, approveTask);
router.get('/approvals/pending', getPendingApprovals);
router.get('/dashboard/overview', getDashboardOverview);
router.get('/dashboard/deadlines', getUpcomingDeadlines);
router.get('/dashboard/budget', getBudgetOverview);
router.get('/dashboard/charts', getDashboardCharts);
router.get('/dashboard/budget-analytics', getBudgetAnalytics);
router.get('/dashboard/kpi', getKPIMetrics);
router.get('/gantt/:projectId', getGanttData);

// =======================
// TEAM
// =======================
router.get('/team/all', getTeamOverview);
router.get('/team/site', getSiteTeam);
router.get('/team/supervisors', getSupervisors);

// =======================
// ENGINEER APIs
// =======================
router.get('/engineer/dashboard', getEngineerDashboard);
router.get('/engineer/projects', getMyProjects);
router.get('/engineer/tasks', getEngineerTasks);
router.post('/engineer/subtask', createSubtask);
router.get('/projects/:id/activity', getProjectActivity);

// =======================
// STAFF REPLACEMENT
// =======================
router.post('/projects/:projectId/replacement-request', authorize('Project Engineer'), createReplacementRequest);
router.get('/staff-replacement/requests', authorize('Project Manager', 'Admin', 'Super Admin'), getReplacementRequests);
router.put('/staff-replacement/requests/:requestId/action', authorize('Project Manager', 'Admin', 'Super Admin'), actionReplacementRequest);

// =======================
// SITE MANAGEMENT (SE/SS)
// =======================
router.post('/site/attendance', authorize('Site Engineer', 'Site Supervisor', 'Project Manager', 'Project Engineer'), submitAttendance);
router.get('/site/attendance/:projectId', getProjectAttendance);

router.post('/site/safety', authorize('Site Engineer', 'Site Supervisor', 'Project Manager', 'Project Engineer'), reportSafetyIssue);
router.get('/site/safety/:projectId', getProjectSafetyLogs);
router.patch('/site/safety/:logId', authorize('Site Engineer', 'Site Supervisor', 'Project Manager', 'Project Engineer'), updateSafetyLogStatus);

router.post('/site/reports', authorize('Site Engineer', 'Site Supervisor', 'Project Manager', 'Project Engineer'), submitDailyReport);
router.get('/site/reports/received', authorize('Project Manager', 'Project Engineer', 'Site Engineer'), getReceivedSiteReports);
router.get('/site/reports/:projectId', getProjectReports);

router.post('/site/supervisor-reports', authorize('Site Supervisor', 'Project Manager', 'Project Engineer'), submitSupervisorReport);
router.get('/site/supervisor-reports/:projectId', getSupervisorReports);

router.get('/reports', authorize('Project Manager', 'Admin'), getProductionReports);

// =======================
// ADMIN APPROVAL APIs
// =======================
router.get('/admin/completed-projects', authorize('Admin', 'Super Admin'), getCompletedProductionProjects);
router.get('/admin/unlock-requests', authorize('Admin', 'Super Admin'), getUnlockRequests);
router.put('/projects/:id/admin-approve', authorize('Admin', 'Super Admin'), adminApproveProductionProject);
router.put('/projects/:id/unlock', authorize('Admin', 'Super Admin'), unlockProject);
router.put('/projects/:id/reject-unlock', authorize('Admin', 'Super Admin'), rejectUnlockRequest);
router.post('/projects/:id/request-unlock', requestUnlock);

export default router;
