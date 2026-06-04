import ProductionProject from '../models/production/ProductionProject.js';
import ProductionTask from '../models/production/ProductionTask.js';

export const isProjectManager = async (req, res, next) => {
    try {
        let projectId = req.params.id || req.body.projectId;
        const taskId = req.params.taskId;
        
        if (!projectId && taskId) {
            const task = await ProductionTask.findById(taskId);
            if (!task) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }
            projectId = task.projectId;
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        const project = await ProductionProject.findById(projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if the current user is the project manager for this project
        if (project.projectManager.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only the assigned Project Manager can perform this action'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};

export const isProjectManagerOrEngineer = async (req, res, next) => {
    try {
        let projectId = req.params.id || req.body.projectId;
        const taskId = req.params.taskId;
        let task = null;
        
        if (taskId) {
            task = await ProductionTask.findById(taskId);
            if (!task) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }
            if (!projectId) {
                projectId = task.projectId;
            }
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        const project = await ProductionProject.findById(projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const isTaskAssignee = task && task.assignedTo && task.assignedTo.toString() === req.user.id;
        const isPM = project.projectManager && project.projectManager.toString() === req.user.id;
        const isPE = project.projectEngineer && project.projectEngineer.toString() === req.user.id;
        const isSE = project.siteEngineer && project.siteEngineer.toString() === req.user.id;

        if (!isPM && !isPE && !isSE && !isTaskAssignee) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only the assigned Project Manager, Project Engineer, or Site Engineer can perform this action'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};

export const isAssignedUser = async (req, res, next) => {
    try {
        const projectId = req.params.id || req.body.projectId;
        const taskId = req.params.taskId;

        let project;

        if (taskId) {
            const task = await ProductionTask.findById(taskId);
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            project = await ProductionProject.findById(task.projectId);
            
            // Allow task assignee to proceed
            if (task.assignedTo && task.assignedTo.toString() === req.user.id) {
                return next();
            }
        } else if (projectId) {
            project = await ProductionProject.findById(projectId);
        }

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if user is assigned to any role in this project
        const assignedRoles = [
            project.projectManager,
            project.projectEngineer,
            project.siteEngineer,
            project.siteSupervisor
        ].map(id => id?.toString());

        if (!assignedRoles.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You are not assigned to this project'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in authorization'
        });
    }
};
