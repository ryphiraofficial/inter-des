import ProductionProject from '../../models/production/ProductionProject.js';
import Project from '../../models/design/Project.js';
import User from '../../models/admin/User.js';
import { notifyUser, notifyByRole } from '../../utils/notificationHelper.js';
import ProductionActivityLog from '../../models/production/ProductionActivityLog.js';

const logActivity = async (projectId, userId, action, message) => {
    await ProductionActivityLog.create({ projectId, userId, action, message });
};

// Guard: block all writes on Admin Approved projects
const assertProjectNotLocked = async (projectId) => {
    if (!projectId) return null;
    const project = await ProductionProject.findById(projectId).select('status');
    if (project?.status === 'Admin Approved') {
        return { status: 403, success: false, message: 'This project has been approved and locked by Admin. No further changes are allowed.' };
    }
    return null;
};

export const createProject = async (reqData) => {
    try {
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied. Only Admins can create production projects.' };
        }
        const { projectName, clientId, description, startDate, endDate, projectManager } = reqData.body;
        if (!projectManager) return { status: 400, success: false, message: 'A Project Manager must be assigned during creation.' };
        const project = await ProductionProject.create({
            projectName, clientId, description, startDate, endDate, projectManager, createdBy: reqData.user.id
        });
        await logActivity(project._id, reqData.user.id, 'CREATE_PROJECT', `Project "${projectName}" created.`);
        return { status: 201, success: true, data: project };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const updateProject = async (reqData) => {
    try {
        const locked = await assertProjectNotLocked(reqData.params.id);
        if (locked) return locked;
        const project = await ProductionProject.findByIdAndUpdate(reqData.params.id, reqData.body, { new: true, runValidators: true });
        await logActivity(project._id, reqData.user.id, 'UPDATE_PROJECT', `Project details updated.`);
        return { status: 200, success: true, data: project };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const assignTeam = async (reqData) => {
    try {
        const locked = await assertProjectNotLocked(reqData.params.id);
        if (locked) return locked;
        const { projectEngineer, siteEngineer, siteSupervisor } = reqData.body;
        const project = await ProductionProject.findById(reqData.params.id);
        if (projectEngineer) project.projectEngineer = Array.isArray(projectEngineer) ? projectEngineer : [projectEngineer];
        if (siteEngineer) project.siteEngineer = Array.isArray(siteEngineer) ? siteEngineer : [siteEngineer];
        if (siteSupervisor) project.siteSupervisor = Array.isArray(siteSupervisor) ? siteSupervisor : [siteSupervisor];
        await project.save();
        await logActivity(project._id, reqData.user.id, 'ASSIGN_TEAM', `Team assignments updated.`);
        return { status: 200, success: true, data: project };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const acceptHandoff = async (reqData) => {
    try {
        const { projectEngineer, siteEngineer, siteSupervisor } = reqData.body;
        const project = await ProductionProject.findById(reqData.params.id);
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        if (project.status !== 'Planning') return { status: 400, success: false, message: 'Project has already been activated' };
        
        if (projectEngineer) project.projectEngineer = Array.isArray(projectEngineer) ? projectEngineer : [projectEngineer];
        if (siteEngineer) project.siteEngineer = Array.isArray(siteEngineer) ? siteEngineer : [siteEngineer];
        if (siteSupervisor) project.siteSupervisor = Array.isArray(siteSupervisor) ? siteSupervisor : [siteSupervisor];
        
        project.status = 'Active';
        await project.save();
        await logActivity(project._id, reqData.user.id, 'ACCEPT_HANDOFF', 'Project accepted and team assigned by Production Manager.');

        const rolesToNotify = [
            { ids: project.projectEngineer, role: 'Project Engineer' },
            { ids: project.siteEngineer, role: 'Site Engineer' },
            { ids: project.siteSupervisor, role: 'Site Supervisor' }
        ];

        for (const roleGroup of rolesToNotify) {
            if (roleGroup.ids && roleGroup.ids.length > 0) {
                for (const userId of roleGroup.ids) {
                    const user = await User.findById(userId);
                    if (user) {
                        await notifyUser(userId, {
                            title: `🏗️ Assigned as ${roleGroup.role}`,
                            description: `You have been assigned as ${roleGroup.role} for project "${project.projectName}". The project is now active.`,
                            type: 'Info', relatedModel: 'ProductionProject', relatedId: project._id
                        });
                    }
                }
            }
        }

        if (project.sourceProject) await Project.findByIdAndUpdate(project.sourceProject, { stage: 'Production' });
        
        const populated = await ProductionProject.findById(project._id)
            .populate('projectManager', 'fullName').populate('projectEngineer', 'fullName')
            .populate('siteEngineer', 'fullName').populate('siteSupervisor', 'fullName').populate('clientId', 'name');
        return { status: 200, success: true, data: populated, message: 'Project activated and team assigned successfully' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const submitProjectCompletion = async (reqData) => {
    try {
        const { completionDate, finalCost, clientRating, finalRemarks, photos } = reqData.body;
        const project = await ProductionProject.findById(reqData.params.id);
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        
        project.status = 'Completed';
        project.progress = 100;
        project.completionDetails = { completionDate: completionDate || new Date(), finalCost, clientRating, finalRemarks, photos };
        if (finalCost) project.spent = finalCost;
        await project.save();

        await logActivity(project._id, reqData.user.id, 'PROJECT_COMPLETED', `Project "${project.projectName}" marked as Completed.`);
        if (project.sourceProject) {
            const mainProject = await Project.findById(project.sourceProject);
            if (mainProject) { mainProject.productionComplete = true; await mainProject.save(); }
        }
        return { status: 200, success: true, data: project };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const adminApproveProductionProject = async (reqData) => {
    try {
        const { action, remarks } = reqData.body;
        const project = await ProductionProject.findById(reqData.params.id);
        if (!project) return { status: 404, success: false, message: 'Project not found' };

        if (action === 'approve') {
            project.status = 'Admin Approved';
            project.adminApproval = { approved: true, remarks, approvedAt: new Date(), approvedBy: reqData.user.id };
            await project.save();
            if (project.sourceProject) {
                const mainProject = await Project.findById(project.sourceProject);
                if (mainProject) { mainProject.handoverComplete = true; mainProject.productionComplete = true; await mainProject.save(); }
            }
        } else {
            project.status = 'Active';
            project.adminApproval = { approved: false, remarks, rejectedAt: new Date(), rejectedBy: reqData.user.id };
            await project.save();
        }

        await logActivity(project._id, reqData.user.id, action === 'approve' ? 'ADMIN_APPROVED' : 'ADMIN_REJECTED', `Admin ${action === 'approve' ? 'approved' : 'rejected'} project "${project.projectName}".${remarks ? ' Remarks: ' + remarks : ''}`);
        return { status: 200, success: true, data: project };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const unlockProject = async (reqData) => {
    try {
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied. Only Admins can unlock a project.' };
        }
        const project = await ProductionProject.findById(reqData.params.id);
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        if (project.status !== 'Admin Approved') {
            return { status: 400, success: false, message: 'Project is not in Admin Approved state.' };
        }
        project.status = 'Active';
        project.adminApproval = {
            ...project.adminApproval,
            approved: false,
            remarks: `Unlocked by ${reqData.user.fullName || reqData.user.role} for modification.`,
        };
        project.unlockRequest = undefined; // Clear any pending requests
        await project.save();
        await logActivity(project._id, reqData.user.id, 'PROJECT_UNLOCKED', `Project "${project.projectName}" unlocked for modifications by Admin.`);
        return { status: 200, success: true, data: project, message: 'Project unlocked successfully. Changes are now allowed.' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const requestUnlock = async (reqData) => {
    try {
        const project = await ProductionProject.findById(reqData.params.id);
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        if (project.status !== 'Admin Approved') {
            return { status: 400, success: false, message: 'Project is not locked.' };
        }

        const requesterName = reqData.user.fullName || reqData.user.name || reqData.user.role;

        // Notify all Admins and Super Admins
        await notifyByRole('Admin', {
            title: '🔓 Unlock Request — Production Project',
            description: `${requesterName} (${reqData.user.role}) is requesting to unlock and modify project "${project.projectName}". Please review and unlock if approved.`,
            type: 'Warning',
            relatedModel: 'ProductionProject',
            relatedId: project._id,
            createdBy: reqData.user.id
        });
        await notifyByRole('Super Admin', {
            title: '🔓 Unlock Request — Production Project',
            description: `${requesterName} (${reqData.user.role}) is requesting to unlock and modify project "${project.projectName}". Please review and unlock if approved.`,
            type: 'Warning',
            relatedModel: 'ProductionProject',
            relatedId: project._id,
            createdBy: reqData.user.id
        });

        project.unlockRequest = {
            requested: true,
            requestedAt: new Date(),
            requestedBy: reqData.user.id
        };
        await project.save();

        await logActivity(project._id, reqData.user.id, 'REQUEST_UNLOCK', `${requesterName} requested unlock for project "${project.projectName}".`);
        return { status: 200, success: true, message: 'Unlock request sent to Admin successfully.' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const rejectUnlockRequest = async (reqData) => {
    try {
        if (reqData.user.role !== 'Admin' && reqData.user.role !== 'Super Admin') {
            return { status: 403, success: false, message: 'Access denied. Only Admins can reject an unlock request.' };
        }
        const project = await ProductionProject.findById(reqData.params.id).populate('unlockRequest.requestedBy', 'email name fullName');
        if (!project) return { status: 404, success: false, message: 'Project not found' };
        if (!project.unlockRequest?.requested) {
            return { status: 400, success: false, message: 'No pending unlock request found for this project.' };
        }

        const requesterEmail = project.unlockRequest.requestedBy?.email;
        
        project.unlockRequest = undefined;
        await project.save();

        if (requesterEmail) {
            await notifyUser(project.unlockRequest?.requestedBy?._id, {
                title: 'Unlock Request Rejected',
                description: `Your request to unlock project "${project.projectName}" was rejected.`,
                type: 'Error',
                relatedModel: 'ProductionProject',
                relatedId: project._id,
                createdBy: reqData.user.id
            });
        }

        await logActivity(project._id, reqData.user.id, 'REJECT_UNLOCK', `Admin rejected unlock request for project "${project.projectName}".`);
        return { status: 200, success: true, data: project, message: 'Unlock request rejected successfully.' };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};


