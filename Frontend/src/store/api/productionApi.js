import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://inter-des-backend.onrender.com/api';

function newSearchParams(params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) sp.append(key, val);
    });
    return sp;
}

export const productionApi = createApi({
    reducerPath: 'productionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                headers.set('Authorization', `Bearer ${token}`);
            }
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
            return headers;
        },
    }),
    tagTypes: [
        'ProductionTasks', 'ProductionProjects', 'ProductionPipeline', 'ProductionStats',
        'ProductionDashboard', 'ProductionTeam', 'ProductionAnalytics', 'SiteAttendance',
        'SiteSafety', 'SiteReports', 'EngineerDashboard', 'Leaves'
    ],
    endpoints: (builder) => ({
        // ── Production General ────────────────────────────────────────────────
        getProductionTasks: builder.query({
            query: (params = {}) => `/production/tasks?${newSearchParams(params)}`,
            providesTags: ['ProductionTasks']
        }),
        createProductionTask: builder.mutation({
            query: (body) => ({ url: '/production/tasks', method: 'POST', body }),
            invalidatesTags: ['ProductionTasks', 'ProductionDashboard']
        }),
        updateProductionTask: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/production/tasks/${id}`, method: 'PUT', body }),
            invalidatesTags: ['ProductionTasks', 'ProductionDashboard']
        }),
        reportProductionIssue: builder.mutation({
            query: ({ taskId, ...body }) => ({ url: `/production/tasks/${taskId}/report-issue`, method: 'POST', body }),
            invalidatesTags: ['ProductionTasks']
        }),
        getProductionPipeline: builder.query({
            query: () => '/production/pipeline',
            providesTags: ['ProductionPipeline']
        }),
        getHandoffProjects: builder.query({
            query: () => '/production-management/projects/handoff',
            providesTags: ['ProductionProjects']
        }),
        getProductionStaff: builder.query({
            query: () => '/production-management/projects/staff',
            providesTags: ['ProductionTeam']
        }),
        acceptHandoff: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/production-management/projects/${id}/accept-handoff`, method: 'PUT', body }),
            invalidatesTags: ['ProductionProjects', 'ProductionPipeline']
        }),
        getProductionStats: builder.query({
            query: () => '/production/stats',
            providesTags: ['ProductionStats']
        }),
        getProductionReports: builder.query({
            query: () => '/production-management/reports',
            providesTags: ['ProductionReports']
        }),

        // ── Production Manager ────────────────────────────────────────────────
        getPMProjects: builder.query({
            query: (params = {}) => `/production-management/projects?${newSearchParams(params)}`,
            providesTags: ['ProductionProjects']
        }),
        getPMTasks: builder.query({
            query: () => '/production-management/tasks/all',
            providesTags: ['ProductionTasks']
        }),
        createPMTask: builder.mutation({
            query: (body) => ({ url: '/production-management/tasks/create', method: 'POST', body }),
            invalidatesTags: ['ProductionTasks']
        }),
        updatePMTaskStatus: builder.mutation({
            query: ({ taskId, ...body }) => ({ url: `/production-management/tasks/${taskId}/update-status`, method: 'PUT', body }),
            invalidatesTags: ['ProductionTasks', 'ProductionDashboard']
        }),
        getPMDashboardOverview: builder.query({
            query: () => '/production-management/dashboard/overview',
            providesTags: ['ProductionDashboard']
        }),
        getPMDashboardDeadlines: builder.query({
            query: () => '/production-management/dashboard/deadlines',
            providesTags: ['ProductionDashboard']
        }),
        getPMDashboardBudget: builder.query({
            query: () => '/production-management/dashboard/budget',
            providesTags: ['ProductionDashboard']
        }),
        getPMTeamOverview: builder.query({
            query: () => '/production-management/team/all',
            providesTags: ['ProductionTeam']
        }),
        createPMTeamMember: builder.mutation({
            query: (body) => ({ url: '/team', method: 'POST', body }),
            invalidatesTags: ['ProductionTeam']
        }),
        deletePMTeamMember: builder.mutation({
            query: (id) => ({ url: `/team/${id}`, method: 'DELETE' }),
            invalidatesTags: ['ProductionTeam']
        }),
        getPMDashboardCharts: builder.query({
            query: () => '/production-management/dashboard/charts',
            providesTags: ['ProductionAnalytics']
        }),
        getPMBudgetAnalytics: builder.query({
            query: () => '/production-management/dashboard/budget-analytics',
            providesTags: ['ProductionAnalytics']
        }),
        getPMKPIMetrics: builder.query({
            query: () => '/production-management/dashboard/kpi',
            providesTags: ['ProductionAnalytics']
        }),
        getPMGanttData: builder.query({
            query: (projectId = 'all') => `/production-management/gantt/${projectId}`,
            providesTags: ['ProductionProjects', 'ProductionTasks']
        }),
        submitProjectCompletion: builder.mutation({
            query: ({ projectId, ...body }) => ({ url: `/production-management/projects/${projectId}/complete`, method: 'POST', body }),
            invalidatesTags: ['ProductionProjects']
        }),
        assignTeam: builder.mutation({
            query: ({ projectId, ...body }) => ({ url: `/production-management/projects/${projectId}/assign-team`, method: 'PUT', body }),
            invalidatesTags: ['ProductionProjects', 'ProductionTeam']
        }),
        assignTask: builder.mutation({
            query: ({ taskId, assignedTo }) => ({ url: `/production-management/tasks/${taskId}/assign`, method: 'PUT', body: { assignedTo } }),
            invalidatesTags: ['ProductionTasks']
        }),
        approveTask: builder.mutation({
            query: (taskId) => ({ url: `/production-management/tasks/${taskId}/approve`, method: 'PUT' }),
            invalidatesTags: ['ProductionTasks']
        }),
        getReplacementRequests: builder.query({
            query: () => '/production-management/staff-replacement/requests',
            providesTags: ['ProductionTeam']
        }),
        actionReplacementRequest: builder.mutation({
            query: ({ requestId, ...body }) => ({ url: `/production-management/staff-replacement/requests/${requestId}/action`, method: 'PUT', body }),
            invalidatesTags: ['ProductionTeam']
        }),
        
        // ── Site Management ───────────────────────────────────────────────────
        submitAttendance: builder.mutation({
            query: (body) => ({ url: '/production-management/site/attendance', method: 'POST', body }),
            invalidatesTags: ['SiteAttendance']
        }),
        getProjectAttendance: builder.query({
            query: (projectId) => `/production-management/site/attendance/${projectId}`,
            providesTags: ['SiteAttendance']
        }),
        reportSafetyIssue: builder.mutation({
            query: (body) => ({ url: '/production-management/site/safety', method: 'POST', body }),
            invalidatesTags: ['SiteSafety']
        }),
        getProjectSafetyLogs: builder.query({
            query: (projectId) => `/production-management/site/safety/${projectId}`,
            providesTags: ['SiteSafety']
        }),
        updateSafetyLogStatus: builder.mutation({
            query: ({ logId, ...body }) => ({ url: `/production-management/site/safety/${logId}`, method: 'PATCH', body }),
            invalidatesTags: ['SiteSafety']
        }),
        submitDailyReport: builder.mutation({
            query: (body) => ({ url: '/production-management/site/reports', method: 'POST', body }),
            invalidatesTags: ['SiteReports']
        }),
        getProjectReports: builder.query({
            query: (projectId) => `/production-management/site/reports/${projectId}`,
            providesTags: ['SiteReports']
        }),
        submitSupervisorReport: builder.mutation({
            query: (body) => ({ url: '/production-management/site/supervisor-reports', method: 'POST', body }),
            invalidatesTags: ['SiteReports']
        }),
        getSupervisorReports: builder.query({
            query: (projectId) => `/production-management/site/supervisor-reports/${projectId}`,
            providesTags: ['SiteReports']
        }),

        // ── Engineer / Supervisor ─────────────────────────────────────────────
        getEngineerDashboard: builder.query({
            query: () => '/production-management/engineer/dashboard',
            providesTags: ['EngineerDashboard']
        }),
        getEngineerProjects: builder.query({
            query: () => '/production-management/engineer/projects',
            providesTags: ['ProductionProjects']
        }),
        getEngineerTasks: builder.query({
            query: (params = {}) => `/production-management/engineer/tasks?${newSearchParams(params)}`,
            providesTags: ['ProductionTasks']
        }),
        getEngineerTaskById: builder.query({
            query: (id) => `/production-management/tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'ProductionTasks', id }]
        }),
        updateEngineerTaskStatus: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/production-management/tasks/${id}/update-status`, method: 'PUT', body }),
            invalidatesTags: ['ProductionTasks', 'EngineerDashboard']
        }),
        addEngineerTaskComment: builder.mutation({
            query: ({ id, text }) => ({ url: `/production-management/tasks/${id}/comment`, method: 'POST', body: { text } }),
            invalidatesTags: ['ProductionTasks']
        }),
        createEngineerSubtask: builder.mutation({
            query: (body) => ({ url: '/production-management/engineer/subtask', method: 'POST', body }),
            invalidatesTags: ['ProductionTasks']
        }),
        assignEngineerTask: builder.mutation({
            query: ({ taskId, assignedTo }) => ({ url: `/production-management/tasks/${taskId}/assign`, method: 'PUT', body: { assignedTo } }),
            invalidatesTags: ['ProductionTasks']
        }),
        getEngineerProjectById: builder.query({
            query: (id) => `/production-management/projects/${id}`,
            providesTags: (result, error, id) => [{ type: 'ProductionProjects', id }]
        }),
        getEngineerProjectTasks: builder.query({
            query: (id) => `/production-management/tasks/project/${id}`,
            providesTags: ['ProductionTasks']
        }),
        getEngineerProjectActivity: builder.query({
            query: (id) => `/production-management/projects/${id}/activity`,
            providesTags: ['ProductionProjects']
        }),
        getSiteTeam: builder.query({
            query: () => '/production-management/team/site',
            providesTags: ['ProductionTeam']
        }),
        getSupervisors: builder.query({
            query: () => '/production-management/team/supervisors',
            providesTags: ['ProductionTeam']
        }),
        requestStaffReplacement: builder.mutation({
            query: ({ projectId, ...body }) => ({ url: `/production-management/projects/${projectId}/replacement-request`, method: 'POST', body }),
            invalidatesTags: ['ProductionProjects', 'ProductionTeam']
        }),

        // ── Leaves ────────────────────────────────────────────────────────────
        submitLeave: builder.mutation({
            query: (body) => ({ url: '/leaves', method: 'POST', body }),
            invalidatesTags: ['Leaves']
        }),
        getMyLeaves: builder.query({
            query: () => '/leaves/my-leaves',
            providesTags: ['Leaves']
        }),
        getPendingLeaves: builder.query({
            query: () => '/leaves/pending',
            providesTags: ['Leaves']
        }),
        updateLeaveStatus: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/leaves/${id}/status`, method: 'PUT', body }),
            invalidatesTags: ['Leaves']
        }),

        // ── Admin — Project Unlock ─────────────────────────────────────────────
        getUnlockRequests: builder.query({
            query: () => '/production-management/admin/unlock-requests',
            providesTags: ['ProductionProjects']
        }),
        unlockProject: builder.mutation({
            query: (id) => ({ url: `/production-management/projects/${id}/unlock`, method: 'PUT' }),
            invalidatesTags: ['ProductionProjects']
        }),
        rejectUnlockProject: builder.mutation({
            query: (id) => ({ url: `/production-management/projects/${id}/reject-unlock`, method: 'PUT' }),
            invalidatesTags: ['ProductionProjects']
        }),
        requestUnlockProject: builder.mutation({
            query: (id) => ({ url: `/production-management/projects/${id}/request-unlock`, method: 'POST' }),
        }),
    })
});

export const {
    useGetProductionTasksQuery,
    useCreateProductionTaskMutation,
    useUpdateProductionTaskMutation,
    useReportProductionIssueMutation,
    useGetProductionPipelineQuery,
    useGetHandoffProjectsQuery,
    useGetProductionStaffQuery,
    useAcceptHandoffMutation,
    useGetProductionStatsQuery,
    useGetProductionReportsQuery,
    useGetPMProjectsQuery,
    useGetPMTasksQuery,
    useCreatePMTaskMutation,
    useUpdatePMTaskStatusMutation,
    useGetPMDashboardOverviewQuery,
    useGetPMDashboardDeadlinesQuery,
    useGetPMDashboardBudgetQuery,
    useGetPMTeamOverviewQuery,
    useCreatePMTeamMemberMutation,
    useDeletePMTeamMemberMutation,
    useGetPMDashboardChartsQuery,
    useGetPMBudgetAnalyticsQuery,
    useGetPMKPIMetricsQuery,
    useGetPMGanttDataQuery,
    useSubmitProjectCompletionMutation,
    useAssignTeamMutation,
    useAssignTaskMutation,
    useApproveTaskMutation,
    useGetReplacementRequestsQuery,
    useActionReplacementRequestMutation,
    useSubmitAttendanceMutation,
    useGetProjectAttendanceQuery,
    useReportSafetyIssueMutation,
    useGetProjectSafetyLogsQuery,
    useUpdateSafetyLogStatusMutation,
    useSubmitDailyReportMutation,
    useGetProjectReportsQuery,
    useSubmitSupervisorReportMutation,
    useGetSupervisorReportsQuery,
    useGetEngineerDashboardQuery,
    useGetEngineerProjectsQuery,
    useGetEngineerTasksQuery,
    useGetEngineerTaskByIdQuery,
    useLazyGetEngineerTaskByIdQuery,
    useUpdateEngineerTaskStatusMutation,
    useAddEngineerTaskCommentMutation,
    useCreateEngineerSubtaskMutation,
    useAssignEngineerTaskMutation,
    useGetEngineerProjectByIdQuery,
    useGetEngineerProjectTasksQuery,
    useGetEngineerProjectActivityQuery,
    useGetSiteTeamQuery,
    useGetSupervisorsQuery,
    useRequestStaffReplacementMutation,
    useSubmitLeaveMutation,
    useGetMyLeavesQuery,
    useGetPendingLeavesQuery,
    useUpdateLeaveStatusMutation,
    useGetUnlockRequestsQuery,
    useUnlockProjectMutation,
    useRejectUnlockProjectMutation,
    useRequestUnlockProjectMutation
} = productionApi;
