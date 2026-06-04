import Project from '../../models/design/Project.js';
import Invoice from '../../models/sales/Invoice.js';

export const generateAdvanceInvoice = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        const invoice = await Invoice.findOne({ project: projectId, status: 'Draft' });
        if (!invoice) return res.status(404).json({ success: false, message: 'Draft invoice not found' });
        
        invoice.status = 'Sent';
        await invoice.save();
        
        project.paymentStatus = 'Invoice Sent';
        await project.save();
        
        res.status(200).json({ success: true, message: 'Invoice marked as sent', data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
