import Project from '../../models/design/Project.js';
import { createNotification, notifyByRole } from '../../utils/notificationHelper.js';
import { logAction } from '../../services/auditService.js';
import { validateDesignStatusTransition, validateDesignComplete, validateHandoff as validateHandoffService } from '../../services/workflowValidationService.js';

export const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        if (req.body.designStatus) {
            const validation = await validateDesignStatusTransition(project._id, req.body.designStatus);
            if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });

            if (req.body.designStatus === 'Design Complete') {
                const prereqCheck = await validateDesignComplete(project._id);
                if (!prereqCheck.canProceed) return res.status(400).json({ success: false, message: 'Cannot mark as Design Complete', errors: prereqCheck.errors });
            }
        }

        const oldValues = {};
        if (req.body.designStatus && req.body.designStatus !== project.designStatus) oldValues.designStatus = project.designStatus;
        if (req.body.status && req.body.status !== project.status) oldValues.status = project.status;

        Object.keys(req.body).forEach(key => { project[key] = req.body[key]; });
        await project.save();

        if (oldValues.designStatus) {
            logAction({ userId: req.user.id, action: 'Design Status Changed', module: 'Project', referenceId: project._id, referenceModel: 'Project', oldValue: oldValues, newValue: { designStatus: req.body.designStatus }, description: `Project "${project.name}" design status changed to ${req.body.designStatus}` });
        }

        res.status(200).json({ success: true, data: project, message: 'Project updated successfully' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const performHandoff = async (req, res) => {
    try {
        const validation = await validateHandoffService(req.params.id);
        if (!validation.canProceed) return res.status(400).json({ success: false, message: 'Cannot perform handoff', errors: validation.errors });

        const project = validation.project;
        project.stage = 'Procurement';
        project.designStatus = 'Handoff Done';
        project.designComplete = true;
        project.handoffDate = new Date();
        project.handedOffBy = req.user.id;
        await project.save();

        await createNotification({ title: 'Project Handoff Complete', description: `Project "${project.name}" has been handed off to Procurement.`, type: 'Info', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });
        await notifyByRole('Procurement Manager', { title: 'New Project Ready for Procurement', description: `Project "${project.name}" design is complete and ready for material procurement.`, type: 'Info', relatedModel: 'Project', relatedId: project._id });
        await notifyByRole('Procurement Staff', { title: 'New Project Ready for Procurement', description: `Project "${project.name}" design is complete and ready for material procurement.`, type: 'Info', relatedModel: 'Project', relatedId: project._id });

        logAction({ userId: req.user.id, action: 'Project Handoff', module: 'Handoff', referenceId: project._id, referenceModel: 'Project', newValue: { designStatus: 'Handoff Done', handoffDate: new Date(), handedOffBy: req.user.id }, description: `Project "${project.name}" handed off to Procurement` });

        res.status(200).json({ success: true, data: project, message: 'Project handed off to Procurement successfully' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const updateProjectStage = async (req, res) => {
    try {
        const { stage, status } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        const previousStage = project.stage;
        if (stage) project.stage = stage;
        if (status) project.status = status;
        
        await project.save();
        
        if (stage && stage !== previousStage) {
            let notificationTitle = ''; let notificationDesc = '';
            switch (stage) {
                case 'Design':
                    notificationTitle = 'Project Moved to Design'; notificationDesc = `Project "${project.name}" is now in Design stage.`;
                    await notifyByRole('Design Manager', { title: notificationTitle, description: notificationDesc, type: 'Info', relatedModel: 'Project', relatedId: project._id });
                    break;
                case 'Procurement':
                    project.designComplete = true; await project.save();
                    notificationTitle = 'Design Complete - Procurement Started'; notificationDesc = `Project "${project.name}" design is complete. Materials procurement can begin.`;
                    await notifyByRole('Procurement Manager', { title: notificationTitle, description: notificationDesc, type: 'Info', relatedModel: 'Project', relatedId: project._id });
                    await notifyByRole('Procurement Staff', { title: notificationTitle, description: notificationDesc, type: 'Info', relatedModel: 'Project', relatedId: project._id });
                    break;
                case 'Production':
                    project.materialsReady = true; await project.save();
                    notificationTitle = 'Materials Ready - Production Started'; notificationDesc = `Project "${project.name}" materials are ready. Production can begin.`;
                    await notifyByRole('Project Manager', { title: notificationTitle, description: notificationDesc, type: 'Info', relatedModel: 'Project', relatedId: project._id });
                    await notifyByRole('Production Staff', { title: notificationTitle, description: notificationDesc, type: 'Info', relatedModel: 'Project', relatedId: project._id });
                    break;
                case 'Completed':
                    project.productionComplete = true; project.handoverComplete = true; await project.save();
                    notificationTitle = 'Project Completed'; notificationDesc = `Project "${project.name}" has been completed successfully!`;
                    await createNotification({ title: notificationTitle, description: notificationDesc, type: 'Success', relatedModel: 'Project', relatedId: project._id });
                    break;
            }
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const approveFinalHandover = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        project.handoverComplete = true;
        await project.save();
        
        await createNotification({ title: 'Project Final Handover Complete', description: `Project "${project.name}" has been officially completed.`, type: 'Success', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });
        
        logAction({ userId: req.user.id, action: 'Project Final Handover', module: 'Project', referenceId: project._id, referenceModel: 'Project', description: `Project "${project.name}" handover complete and marked as finished` });
        
        res.status(200).json({ success: true, data: project, message: 'Project final handover approved successfully' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        const projectId = project._id;
        try {
            const pp = await (await import('../../models/production/ProductionProject.js')).default.findOne({ sourceProject: projectId });
            if (pp) await (await import('../../models/production/ProductionTask.js')).default.deleteMany({ projectId: pp._id });

            await Promise.all([
                (await import('../../models/design/Task.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/procurement/MaterialRequest.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/production/ProductionProject.js')).default.deleteMany({ sourceProject: projectId }),
                (await import('../../models/procurement/VendorComparison.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/procurement/VendorPurchase.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/sales/Invoice.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/accounts/Payment.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/accounts/Expense.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/design/Checklist.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/production/SupervisorDailyReport.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/production/SiteProgressReport.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/production/SiteAttendance.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/production/SafetyLog.js')).default.deleteMany({ project: projectId }),
                (await import('../../models/shared/Notification.js')).default.deleteMany({ relatedModel: 'Project', relatedId: projectId })
            ]);
        } catch (cascadeError) { console.error('Cascade deletion failed:', cascadeError); }
        
        await project.deleteOne();
        logAction({ userId: req.user.id, action: 'Project Deleted', module: 'Project', referenceId: project._id, referenceModel: 'Project', description: `Project "${project.name}" was deleted` });
        
        res.status(200).json({ success: true, data: {}, message: 'Project deleted successfully' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
