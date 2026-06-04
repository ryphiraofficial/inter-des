import Project from '../../models/design/Project.js';
import { validateHandoff as validateHandoffService, getWorkflowChecklist as getWorkflowChecklistService } from '../../services/workflowValidationService.js';

export const getProjects = async (req, res) => {
    try {
        const { search, stage, status, client, productionComplete, handoverComplete, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (search) query.$or = [{ projectNumber: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }];
        if (stage) query.stage = stage;
        if (status) query.status = status;
        if (client) query.client = client;
        if (productionComplete !== undefined) query.productionComplete = productionComplete === 'true';
        if (handoverComplete !== undefined) query.handoffComplete = handoverComplete === 'true';
        
        const skip = (page - 1) * limit;
        const projects = await Project.find(query)
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber totalAmount createdBy projectName')
            .populate('createdBy', 'fullName')
            .populate('assignedDesignManager', 'fullName')
            .populate('assignedProcurementManager', 'fullName')
            .populate('assignedProductionManager', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Project.countDocuments(query);
        
        res.status(200).json({ success: true, count: projects.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: projects });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('client')
            .populate('quotation')
            .populate('createdBy', 'fullName email')
            .populate('assignedDesignManager', 'fullName email')
            .populate('assignedProcurementManager', 'fullName email')
            .populate('assignedProductionManager', 'fullName email');
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        res.status(200).json({ success: true, data: project });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getProjectStats = async (req, res) => {
    try {
        const total = await Project.countDocuments();
        const designStage = await Project.countDocuments({ stage: 'Design' });
        const procurementStage = await Project.countDocuments({ stage: 'Procurement' });
        const productionStage = await Project.countDocuments({ stage: 'Production' });
        const completed = await Project.countDocuments({ stage: 'Completed' });
        
        const inProgress = await Project.countDocuments({ status: 'In Progress' });
        const onHold = await Project.countDocuments({ status: 'On Hold' });
        
        const totalBudget = await Project.aggregate([{ $group: { _id: null, total: { $sum: '$budget' } } }]);
        const totalSpent = await Project.aggregate([{ $group: { _id: null, total: { $sum: '$spent' } } }]);
        
        res.status(200).json({
            success: true,
            data: {
                total,
                stages: { design: designStage, procurement: procurementStage, production: productionStage, completed: completed },
                status: { inProgress, onHold },
                budget: { total: totalBudget[0]?.total || 0, spent: totalSpent[0]?.total || 0, remaining: (totalBudget[0]?.total || 0) - (totalSpent[0]?.total || 0) }
            }
        });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getProjectsByStage = async (req, res) => {
    try {
        const { stage } = req.params;
        const projects = await Project.find({ stage })
            .populate('client', 'name email phone')
            .populate('quotation', 'quotationNumber totalAmount')
            .sort({ priority: -1, createdAt: -1 });
        
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const validateHandoff = async (req, res) => {
    try {
        const validation = await validateHandoffService(req.params.id);
        res.status(200).json({ success: true, data: validation });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getWorkflowChecklist = async (req, res) => {
    try {
        const checklist = await getWorkflowChecklistService(req.params.id);
        res.status(200).json({ success: true, data: checklist });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
