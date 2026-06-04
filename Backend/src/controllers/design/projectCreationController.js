import Project from '../../models/design/Project.js';
import Checklist from '../../models/design/Checklist.js';
import { createNotification, notifyByRole } from '../../utils/notificationHelper.js';

export const createProject = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const project = await Project.create(req.body);
        
        const defaultSteps = [
            { name: 'Demolition', order: 1 },
            { name: 'Cleaning', order: 2 },
            { name: 'Installation', order: 3 },
            { name: 'Final Handover', order: 4 }
        ];
        
        await Checklist.create({ project: project._id, steps: defaultSteps, createdBy: req.user.id });
        
        await createNotification({ title: 'New Project Created', description: `Project "${project.name}" (${project.projectNumber}) has been created and assigned to Design stage.`, type: 'Info', relatedModel: 'Project', relatedId: project._id, createdBy: req.user.id });
        await notifyByRole('Design Manager', { title: 'New Project Assigned', description: `Project "${project.name}" requires design work.`, type: 'Info', relatedModel: 'Project', relatedId: project._id });
        
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
