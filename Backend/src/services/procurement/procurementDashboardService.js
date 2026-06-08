import MaterialRequest from '../../models/procurement/MaterialRequest.js';
import PurchaseOrder from '../../models/procurement/PurchaseOrder.js';
import Task from '../../models/design/Task.js';
import Project from '../../models/design/Project.js';
import Quotation from '../../models/sales/Quotation.js';
import ProductionProject from '../../models/production/ProductionProject.js';
import User from '../../models/admin/User.js';
import { notifyUser, notifyByRole } from '../../utils/notificationHelper.js';

export const getProcurementStats = async (reqData) => {
    try {
        const pendingRequests = await MaterialRequest.countDocuments({ status: 'Pending' });
        const inProgressRequests = await MaterialRequest.countDocuments({ status: 'In Progress' });
        const completedRequests = await MaterialRequest.countDocuments({ status: 'Completed' });

        const pendingPOs = await PurchaseOrder.countDocuments({ status: { $in: ['Draft', 'Pending', 'Approved', 'Ordered'] } });
        const receivedPOs = await PurchaseOrder.countDocuments({ status: 'Received' });

        return { status: 200, success: true, data: { materialRequests: { pending: pendingRequests, inProgress: inProgressRequests, completed: completedRequests }, purchaseOrders: { pending: pendingPOs, received: receivedPOs } } };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getStaffTasks = async (reqData) => {
    try {
        const staffId = reqData.user.id;
        
        const mrs = await MaterialRequest.find({ assignedTo: staffId })
            .populate('project', 'name projectNumber stage')
            .populate('requestedBy', 'fullName')
            .sort({ priority: -1, createdAt: -1 })
            .lean();

        const tasks = await Task.find({ 
                assignedTo: { $in: [staffId] },
                status: { $in: ['Assigned to Procurement', 'In Progress', 'Completed'] }
            })
            .populate('project', 'name projectNumber stage')
            .populate('createdBy', 'fullName')
            .sort({ priority: -1, createdAt: -1 })
            .lean();

        const formattedMrs = mrs.map(m => ({ ...m, type: 'MaterialRequest' }));
        const formattedTasks = tasks.map(t => ({ ...t, type: 'Task', requestNumber: t.title, items: t.submissions?.[t.submissions?.length - 1]?.designItems || [] }));
        
        const combined = [...formattedMrs, ...formattedTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return { status: 200, success: true, count: combined.length, data: combined };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProductionManagers = async (reqData) => {
    try {
        const managers = await User.find({ role: 'Project Manager', status: 'Active' }).select('fullName email phone');
        return { status: 200, success: true, count: managers.length, data: managers };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProcurementManagers = async (reqData) => {
    try {
        const managers = await User.find({ role: 'Procurement Manager', status: 'Active' }).select('fullName email phone');
        return { status: 200, success: true, count: managers.length, data: managers };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const adminApproveProcurement = async (reqData) => {
    try {
        const { productionManagerId, sendToAccounts, itemType } = reqData.body;
        const itemId = reqData.params.id;

        const type = itemType || 'MaterialRequest';
        let item, project, quotation;

        if (type === 'Task') {
            item = await Task.findById(itemId).populate('project').populate('quotation');
            if (!item) return { status: 404, success: false, message: 'Task not found' };
            project = item.project;
            quotation = item.quotation;
        } else {
            item = await MaterialRequest.findById(itemId).populate('project').populate('quotation');
            if (!item) return { status: 404, success: false, message: 'Material request not found' };
            project = item.project;
            quotation = item.quotation;
        }

        if (!quotation && project?.quotation) quotation = await Quotation.findById(project.quotation);

        if (productionManagerId && project) {
            if (project.paymentStatus !== 'Cleared' && project.paymentCollectionStatus !== 'Collected' && project.paymentCollectionStatus !== 'Verified') {
                return { status: 400, success: false, message: 'Advance amount must be collected or cleared before moving to production.' };
            }

            const pm = await User.findOne({ _id: productionManagerId, status: 'Active' });
            if (!pm) return { status: 400, success: false, message: 'Invalid production manager' };

            await Project.findByIdAndUpdate(project._id, { assignedProductionManager: productionManagerId });

            const existingPP = await ProductionProject.findOne({ sourceProject: project._id });
            if (!existingPP) {
                await ProductionProject.create({ projectName: project.name, clientId: project.client, description: `Production handoff from procurement approval for "${project.name}".`, projectManager: productionManagerId, createdBy: reqData.user.id, sourceProject: project._id, status: 'Planning' });
            } else if (existingPP.projectManager.toString() !== productionManagerId) {
                existingPP.projectManager = productionManagerId;
                await existingPP.save();
            }

            await notifyUser(productionManagerId, { title: '📋 New Project Handoff — Assign Your Team', description: `You have been assigned as the Project Manager for project "${project.name}". Please go to Project Handoff to assign your team.`, type: 'Info', relatedModel: 'Project', relatedId: project._id });
        }

        if (sendToAccounts && quotation) {
            await Quotation.findByIdAndUpdate(quotation._id, { status: 'Sent to Accounts' });
            await notifyByRole('Accounts Manager', { title: '💰 New Quotation for Fund Collection', description: `Quotation "${quotation.quotationNumber}" for project "${project?.name || 'N/A'}" (₹${quotation.totalAmount?.toLocaleString('en-IN') || '0'}) has been forwarded by Admin. Please collect the required funds from the client.`, type: 'Invoice', relatedModel: 'Quotation', relatedId: quotation._id });
            await notifyByRole('Accounts Staff', { title: '💰 Quotation Forwarded for Collection', description: `Quotation "${quotation.quotationNumber}" for project "${project?.name || 'N/A'}" needs fund collection from client. Amount: ₹${quotation.totalAmount?.toLocaleString('en-IN') || '0'}.`, type: 'Invoice', relatedModel: 'Quotation', relatedId: quotation._id });
        }

        if (type === 'Task') await Task.findByIdAndUpdate(itemId, { status: 'Procurement Approved' });
        else await MaterialRequest.findByIdAndUpdate(itemId, { status: 'Procurement Approved' });

        await notifyByRole('Procurement Manager', { title: 'Procurement Approved by Admin', description: `Admin has approved procurement for ${project?.name || item.requestNumber || 'the project'}.${productionManagerId ? ' A Production Manager has been assigned.' : ''}${sendToAccounts ? ' Quotation sent to Accounts for fund collection.' : ''}`, type: 'Success', relatedModel: 'Project', relatedId: project?._id });

        return { status: 200, success: true, message: 'Procurement approved successfully', data: { productionManagerAssigned: !!productionManagerId, sentToAccounts: !!sendToAccounts } };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const getProcurementStaff = async (reqData) => {
    try {
        const staff = await User.find({ role: 'Procurement Staff', status: 'Active' })
            .select('fullName email phone');

        return { status: 200, success: true, count: staff.length, data: staff };
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};
