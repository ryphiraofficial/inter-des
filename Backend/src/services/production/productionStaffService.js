import ProductionProject from '../../models/production/ProductionProject.js';
import ProductionTask from '../../models/production/ProductionTask.js';
import StaffReplacementRequest from '../../models/production/StaffReplacementRequest.js';
import ProductionActivityLog from '../../models/production/ProductionActivityLog.js';
import User from '../../models/admin/User.js';

const logActivity = async (projectId, userId, action, message) => {
    await ProductionActivityLog.create({ projectId, userId, action, message });
};

export const getTeamOverview = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') query.projectManager = reqData.user.id;
        const projects = await ProductionProject.find(query)
            .populate('projectEngineer', 'fullName email').populate('siteEngineer', 'fullName email').populate('siteSupervisor', 'fullName email');
            
        const teamMap = new Map();
        projects.forEach(project => {
            const roles = [
                { user: project.projectEngineer, title: 'Project Engineer' },
                { user: project.siteEngineer, title: 'Site Engineer' },
                { user: project.siteSupervisor, title: 'Site Supervisor' }
            ];
            roles.forEach(role => {
                if (role.user) {
                    const id = role.user._id.toString();
                    if (!teamMap.has(id)) {
                        teamMap.set(id, { id, name: role.user.fullName, email: role.user.email, role: role.title, projects: 1 });
                    } else {
                        teamMap.get(id).projects += 1;
                    }
                }
            });
        });
        return { status: 200, success: true, data: Array.from(teamMap.values()) };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getSiteTeam = async (reqData) => {
    try {
        const members = await User.find({ role: { $in: ['Site Engineer', 'Site Supervisor'] } }).select('fullName email role');
        return { status: 200, success: true, data: members };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getSupervisors = async (reqData) => {
    try {
        const members = await User.find({ role: 'Site Supervisor', status: 'Active' }).select('fullName email role');
        return { status: 200, success: true, data: members };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProductionStaff = async (reqData) => {
    try {
        const staff = await User.find({
            role: { $in: ['Project Manager', 'Project Engineer', 'Site Engineer', 'Site Supervisor'] },
            status: 'Active'
        }).select('fullName email role');
        return { status: 200, success: true, data: staff };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const createReplacementRequest = async (reqData) => {
    try {
        const { projectId } = reqData.params;
        const { staffType, currentStaffId, reason } = reqData.body;
        if (!['Project Engineer', 'Site Engineer'].includes(reqData.user.role)) return { status: 403, success: false, message: 'Unauthorized to request staff replacement.' };
        if (reqData.user.role === 'Site Engineer' && staffType !== 'Site Supervisor') return { status: 403, success: false, message: 'Site Engineers can only request replacement for Site Supervisors.' };

        const project = await ProductionProject.findById(projectId);
        if (!project) return { status: 404, success: false, message: 'Project not found' };

        const request = await StaffReplacementRequest.create({ projectId, requestedBy: reqData.user.id, staffType, currentStaffId, reason });
        await logActivity(projectId, reqData.user.id, 'STAFF_REPLACEMENT_REQUEST', `Requested replacement for ${staffType}`);
        return { status: 201, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getReplacementRequests = async (reqData) => {
    try {
        let query = {};
        if (reqData.user.role === 'Project Manager') {
            const projects = await ProductionProject.find({ projectManager: reqData.user.id }).select('_id');
            query.projectId = { $in: projects.map(p => p._id) };
        } else if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied' };
        }
        const requests = await StaffReplacementRequest.find(query)
            .populate('projectId', 'projectName').populate('requestedBy', 'fullName').populate('currentStaffId', 'fullName').sort({ createdAt: -1 });
        return { status: 200, success: true, data: requests };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const actionReplacementRequest = async (reqData) => {
    try {
        const { requestId } = reqData.params;
        const { status, adminRemarks } = reqData.body;
        if (!['Project Manager', 'Admin', 'Super Admin'].includes(reqData.user.role)) return { status: 403, success: false, message: 'Access denied' };
        
        const request = await StaffReplacementRequest.findById(requestId);
        if (!request) return { status: 404, success: false, message: 'Request not found' };

        request.status = status; request.adminRemarks = adminRemarks; request.actionedBy = reqData.user.id; request.actionedAt = Date.now();
        await request.save();
        await logActivity(request.projectId, reqData.user.id, 'STAFF_REPLACEMENT_ACTION', `Replacement request ${status}`);
        return { status: 200, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
