import MaterialRequest from '../../models/procurement/MaterialRequest.js';
import Project from '../../models/design/Project.js';
import User from '../../models/admin/User.js';
import { notifyByRole, notifyUser } from '../../utils/notificationHelper.js';

export const getMaterialRequests = async (reqData) => {
    try {
        const { project, status, priority, page = 1, limit = 10 } = reqData.query;
        let query = {};
        const role = reqData.user.role;

        if (status) {
            if (status.includes(',')) {
                query.status = { $in: status.split(',').map(s => s.trim()) };
            } else {
                query.status = status;
            }
        } else if (role === 'Procurement Manager' || role === 'Procurement Staff') {
            query.status = { $nin: ['Design Review'] };
        } else if (role === 'Staff') {
            query.requestedBy = reqData.user.id;
        }

        if (project) query.project = project;
        if (priority) query.priority = priority;

        const skip = (page - 1) * limit;
        const requests = await MaterialRequest.find(query)
            .populate('project', 'name projectNumber stage status paymentStatus paymentCollectionStatus advanceAmount collectedAmount tempCollectionDetails')
            .populate('requestedBy', 'fullName')
            .populate('assignedTo', 'fullName')
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await MaterialRequest.countDocuments(query);

        return { status: 200, success: true, count: requests.length, total: requests.length, page: parseInt(page), pages: Math.ceil(requests.length / limit), data: requests };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const createMaterialRequest = async (reqData) => {
    try {
        reqData.body.createdBy = reqData.user.id;
        reqData.body.requestedBy = reqData.user.id;

        if ((!reqData.body.project || reqData.body.project === "") && reqData.body.quotation) {
            const project = await Project.findOne({ quotation: reqData.body.quotation });
            if (project) reqData.body.project = project._id;
        }

        if (!reqData.body.project) return { status: 400, success: false, message: 'Project reference is required for material requests' };

        if (reqData.user.role === 'Staff') reqData.body.status = 'Design Review';
        else if (reqData.user.role === 'Design Manager') reqData.body.status = 'Pending';

        const request = await MaterialRequest.create(reqData.body);
        await Project.findByIdAndUpdate(reqData.body.project, { stage: 'Procurement' });

        if (request.status === 'Design Review') {
            await notifyByRole('Design Manager', { title: 'New Material Request for Review', description: `Staff has requested materials for "${request.requestNumber}". Needs your approval.`, type: 'Warning', relatedModel: 'MaterialRequest', relatedId: request._id });
        } else {
            await notifyByRole('Procurement Manager', { title: 'New Material Request', description: `Material request "${request.requestNumber}" needs procurement action.`, type: 'Info', relatedModel: 'MaterialRequest', relatedId: request._id });
        }

        return { status: 201, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const updateMaterialRequest = async (reqData) => {
    try {
        const request = await MaterialRequest.findById(reqData.params.id);
        if (!request) return { status: 404, success: false, message: 'Material request not found' };
        Object.assign(request, reqData.body);
        await request.save();
        return { status: 200, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const approveMaterialRequest = async (reqData) => {
    try {
        const request = await MaterialRequest.findById(reqData.params.id);
        if (!request) return { status: 404, success: false, message: 'Material request not found' };

        request.status = 'Pending';
        request.managerRemarks = reqData.body.managerRemarks || 'Approved by Design Manager';
        await request.save();

        await notifyByRole('Procurement Manager', { title: 'New Released Material Request', description: `Design Manager has approved/released request "${request.requestNumber}".`, type: 'Info', relatedModel: 'MaterialRequest', relatedId: request._id });
        await notifyUser(request.requestedBy, { title: 'Material Request Approved', description: `Your material request "${request.requestNumber}" has been released to procurement.`, type: 'Success', relatedModel: 'MaterialRequest', relatedId: request._id });

        return { status: 200, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const assignStaffToRequest = async (reqData) => {
    try {
        const { staffId } = reqData.body;
        const request = await MaterialRequest.findById(reqData.params.id);
        if (!request) return { status: 404, success: false, message: 'Material request not found' };

        const staff = await User.findOne({ _id: staffId, role: 'Procurement Staff' });
        if (!staff) return { status: 400, success: false, message: 'Invalid staff member' };

        request.assignedTo = staffId;
        request.status = 'Assigned';
        await request.save();

        await notifyUser(staffId, { title: 'Procurement Task Assigned', description: `You have been assigned to material request "${request.requestNumber}".`, type: 'Task', relatedModel: 'MaterialRequest', relatedId: request._id });

        return { status: 200, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const requestTimeExtension = async (reqData) => {
    try {
        const { requestedDate, reason } = reqData.body;
        const request = await MaterialRequest.findById(reqData.params.id);
        if (!request) return { status: 404, success: false, message: 'Material request not found' };
        if (request.assignedTo?.toString() !== reqData.user.id) return { status: 403, success: false, message: 'You are not assigned to this request' };

        request.timeExtension = { requestedDate, reason, status: 'Pending', requestedBy: reqData.user.id };
        await request.save();

        const manager = await User.findOne({ role: 'Procurement Manager' });
        if (manager) await notifyUser(manager._id, { title: 'Time Extension Requested', description: `Staff has requested time extension for material request "${request.requestNumber}".`, type: 'Info', relatedModel: 'MaterialRequest', relatedId: request._id });

        return { status: 200, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};

export const respondTimeExtension = async (reqData) => {
    try {
        const { status, managerRemarks } = reqData.body;
        const request = await MaterialRequest.findById(reqData.params.id);
        if (!request || !request.timeExtension) return { status: 404, success: false, message: 'Material request or time extension not found' };

        request.timeExtension.status = status;
        request.timeExtension.managerRemarks = managerRemarks;
        request.timeExtension.reviewedBy = reqData.user.id;
        request.timeExtension.reviewedAt = new Date();

        if (status === 'Approved') request.status = 'In Progress';
        await request.save();

        if (request.assignedTo) await notifyUser(request.assignedTo, { title: `Time Extension ${status}`, description: `Your time extension request has been ${status.toLowerCase()}.`, type: 'Info', relatedModel: 'MaterialRequest', relatedId: request._id });

        return { status: 200, success: true, data: request };
    } catch (error) { return { status: 500, success: false, message: error.message }; }
};
