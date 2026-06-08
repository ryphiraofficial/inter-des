import Project from '../../models/design/Project.js';
import Task from '../../models/design/Task.js';
import Quotation from '../../models/sales/Quotation.js';
import Invoice from '../../models/sales/Invoice.js';
import Payment from '../../models/accounts/Payment.js';

/**
 * @desc    Get all projects for the client (for dropdown selection)
 * @route   GET /api/client/projects-list
 * @access  Private (Client only)
 */
export const getClientProjectsList = async (req, res) => {
    try {
        const clientId = req.user.id;

        const projects = await Project.find({ client: clientId })
            .select('name projectNumber status stage createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Get Client Projects List Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching your projects list.'
        });
    }
};

/**
 * @desc    Get client's active project and timeline
 * @route   GET /api/client/project
 * @access  Private (Client only)
 */
export const getClientProject = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        const populateOptions = [
            { path: 'assignedAccountsStaff', select: 'fullName role phone avatar email' },
            { path: 'assignedDesignManager', select: 'fullName role phone avatar email' },
            { path: 'assignedProcurementManager', select: 'fullName role phone avatar email' },
            { path: 'assignedProductionManager', select: 'fullName role phone avatar email' }
        ];

        let projectQuery = { client: clientId };
        if (projectId) {
            projectQuery._id = projectId;
        } else {
            projectQuery.status = { $in: ['Not Started', 'In Progress', 'On Hold'] };
        }

        // Find the project based on query
        let project = await Project.findOne(projectQuery).populate(populateOptions).sort({ createdAt: -1 });

        if (!project && !projectId) {
            // Check if they have a completed project instead (only if no specific projectId was requested)
            const completedProject = await Project.findOne({
                client: clientId,
                status: 'Completed'
            }).populate(populateOptions).sort({ createdAt: -1 });

            if (!completedProject) {
                return res.status(404).json({
                    success: false,
                    message: 'No active projects found for your account.'
                });
            }
            project = completedProject;
        } else if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const timeline = getTimelineFromProject(project);

        res.status(200).json({
            success: true,
            data: {
                project,
                timeline
            }
        });

    } catch (error) {
        console.error('Get Client Project Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching your project details.'
        });
    }
};

// Helper function to build a vertical timeline array from project state
const getTimelineFromProject = (project) => {
    // We want to return an array of milestones for the vertical timeline component
    // Example statuses: pending, in-progress, completed
    
    return [
        {
            id: 'accounts',
            title: 'Project Setup & Advance Payment',
            description: 'Initial project creation and commercial approvals.',
            status: project.paymentStatus === 'Pending Advance' ? 'in-progress' : 'completed',
            date: project.createdAt,
            assignedStaff: project.assignedAccountsStaff || null
        },
        {
            id: 'design',
            title: 'Design Phase',
            description: '2D/3D layouts and material selection.',
            status: project.designComplete ? 'completed' : (project.stage === 'Design' ? 'in-progress' : 'pending'),
            date: project.updatedAt, // Or a specific design sign-off date if available
            assignedStaff: project.assignedDesignManager || null
        },
        {
            id: 'procurement',
            title: 'Procurement & Material Readiness',
            description: 'Ordering raw materials and hardware.',
            status: project.materialsReady ? 'completed' : (['Procurement', 'Production'].includes(project.stage) && project.designComplete ? 'in-progress' : 'pending'),
            date: null,
            assignedStaff: project.assignedProcurementManager || null
        },
        {
            id: 'production',
            title: 'Manufacturing & Production',
            description: 'Factory work and assembly.',
            status: project.productionComplete ? 'completed' : (project.stage === 'Production' ? 'in-progress' : 'pending'),
            date: null,
            assignedStaff: project.assignedProductionManager || null
        },
        {
            id: 'handover',
            title: 'Installation & Handover',
            description: 'Site installation and final client sign-off.',
            status: project.handoverComplete ? 'completed' : (project.productionComplete ? 'in-progress' : 'pending'),
            date: project.actualEndDate || null,
            assignedStaff: project.assignedProductionManager || null // Handover is usually handled by production/site eng
        }
    ];
};

/**
 * @desc    Get all quotations for the client
 * @route   GET /api/client/quotations
 * @access  Private (Client only)
 */
export const getClientQuotations = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        let query = { client: clientId };
        
        if (projectId) {
            const project = await Project.findOne({ _id: projectId, client: clientId });
            if (project && project.quotation) {
                query._id = project.quotation;
            } else {
                return res.status(200).json({ success: true, data: [] });
            }
        }

        const quotations = await Quotation.find(query)
            .select('quotationNumber projectName totalAmount status validUntil createdAt items offerPrice taxAmount taxRate subtotal')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: quotations
        });
    } catch (error) {
        console.error('Get Client Quotations Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching your quotations.'
        });
    }
};

/**
 * @desc    Get all invoices for the client
 * @route   GET /api/client/invoices
 * @access  Private (Client only)
 */
export const getClientInvoices = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        let query = { client: clientId };
        if (projectId) query.project = projectId;

        const invoices = await Invoice.find(query)
            .populate('project', 'name')
            .select('invoiceNumber grandTotal amountPaid status dueDate invoiceDate createdAt items subtotal totalTax')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        console.error('Get Client Invoices Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching your invoices.'
        });
    }
};

/**
 * @desc    Get all payments for the client
 * @route   GET /api/client/payments
 * @access  Private (Client only)
 */
export const getClientPayments = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        let query = { client: clientId };
        if (projectId) query.project = projectId;

        const payments = await Payment.find(query)
            .populate('project', 'name')
            .populate('invoice', 'invoiceNumber')
            .select('paymentNumber amount paymentDate paymentMethod transactionId reference notes')
            .sort({ paymentDate: -1 });

        res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Get Client Payments Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching your payments.'
        });
    }
};

/**
 * @desc    Get all staff members assigned to the client's project
 * @route   GET /api/client/members
 * @access  Private (Client only)
 */
export const getClientWorkingMembers = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        let projectQuery = { client: clientId };
        if (projectId) {
            projectQuery._id = projectId;
        } else {
            projectQuery.status = { $nin: ['Completed', 'Cancelled'] };
        }

        // Find the client's project
        const project = await Project.findOne(projectQuery)
        .populate('assignedDesignManager', 'fullName role phone email avatar')
        .populate('assignedProcurementManager', 'fullName role phone email avatar')
        .populate('assignedProductionManager', 'fullName role phone email avatar')
        .populate('assignedAccountsStaff', 'fullName role phone email avatar');

        if (!project) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Extract and map the assigned staff into a clean array
        const members = [];
        
        if (project.assignedDesignManager) {
            members.push({ ...project.assignedDesignManager.toObject(), projectRole: 'Design Manager' });
        }
        if (project.assignedProcurementManager) {
            members.push({ ...project.assignedProcurementManager.toObject(), projectRole: 'Procurement Manager' });
        }
        if (project.assignedProductionManager) {
            members.push({ ...project.assignedProductionManager.toObject(), projectRole: 'Production Manager' });
        }
        if (project.assignedAccountsStaff) {
            members.push({ ...project.assignedAccountsStaff.toObject(), projectRole: 'Accounts' });
        }

        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        console.error('Get Client Members Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching project members.'
        });
    }
};

/**
 * @desc    Get all daily updates for the client's project
 * @route   GET /api/client/updates
 * @access  Private (Client only)
 */
export const getClientGroupUpdates = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        let projectQuery = { client: clientId };
        if (projectId) {
            projectQuery._id = projectId;
        } else {
            projectQuery.status = { $nin: ['Completed', 'Cancelled'] };
        }

        // Find the client's project
        const project = await Project.findOne(projectQuery);

        if (!project) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Find all tasks for this project
        const tasks = await Task.find({ project: project._id })
            .populate({
                path: 'dailyUpdates.staff',
                select: 'fullName avatar role'
            })
            .select('title dailyUpdates');

        // Extract and flatten daily updates from all tasks
        let allUpdates = [];
        tasks.forEach(task => {
            if (task.dailyUpdates && task.dailyUpdates.length > 0) {
                const taskUpdates = task.dailyUpdates.map(update => ({
                    _id: update._id,
                    taskTitle: task.title,
                    taskId: task._id,
                    staff: update.staff,
                    updateText: update.update,
                    emergencies: update.emergencies,
                    createdAt: update.createdAt
                }));
                allUpdates = [...allUpdates, ...taskUpdates];
            }
        });

        // Sort by newest first
        allUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            success: true,
            data: allUpdates
        });
    } catch (error) {
        console.error('Get Client Updates Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching group updates.'
        });
    }
};

/**
 * @desc    Get all documents and files for the client's project
 * @route   GET /api/client/documents
 * @access  Private (Client only)
 */
export const getClientDocuments = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.query.projectId;

        let projectQuery = { client: clientId };
        if (projectId) {
            projectQuery._id = projectId;
        } else {
            projectQuery.status = { $nin: ['Completed', 'Cancelled'] };
        }

        const project = await Project.findOne(projectQuery);

        if (!project) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const tasks = await Task.find({ project: project._id })
            .select('title attachments submissions');

        let documents = [];

        tasks.forEach(task => {
            // Extract general task attachments
            if (task.attachments && task.attachments.length > 0) {
                task.attachments.forEach(attachment => {
                    documents.push({
                        _id: attachment._id,
                        filename: attachment.filename || 'Unnamed File',
                        url: attachment.url,
                        type: 'Attachment',
                        taskTitle: task.title,
                        uploadedAt: attachment.uploadedAt
                    });
                });
            }

            // Extract formal design submissions
            if (task.submissions && task.submissions.length > 0) {
                task.submissions.forEach(submission => {
                    if (submission.files && submission.files.length > 0) {
                        submission.files.forEach(file => {
                            documents.push({
                                _id: file._id,
                                filename: file.filename || 'Unnamed Submission',
                                url: file.url,
                                type: file.fileType || 'Submission',
                                taskTitle: task.title,
                                uploadedAt: file.uploadedAt
                            });
                        });
                    }
                });
            }
        });

        // Sort by newest first
        documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Get Client Documents Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching project documents.'
        });
    }
};
