import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectAPI, procurementAPI, notificationAPI, vendorAPI, taskAPI, productionAPI } from '../../../models/api';

export const useProcurementManagerLogic = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [showHandoffModal, setShowHandoffModal] = useState(false);

    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [materialRequests, setMaterialRequests] = useState([]);
    const [pushedTasks, setPushedTasks] = useState([]);
    const [staff, setStaff] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedVendorDetail, setSelectedVendorDetail] = useState(null);
    const [vendorHistory, setVendorHistory] = useState([]);
    const [showAddVendorModal, setShowAddVendorModal] = useState(false);
    
    const emptyVendorForm = { name: '', email: '', phone: '', address: '', category: '', gstin: '', products: [] };
    const [vendorForm, setVendorForm] = useState(emptyVendorForm);
    const [vendorSaving, setVendorSaving] = useState(false);
    const [selectedReviewItem, setSelectedReviewItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        const handleOpenAddVendor = () => setShowAddVendorModal(true);
        window.addEventListener('open-create-vendor-modal', handleOpenAddVendor);
        return () => window.removeEventListener('open-create-vendor-modal', handleOpenAddVendor);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching procurement data...');
            const [vendorList, staffRes, requestsRes, taskRes] = await Promise.all([
                vendorAPI.getAll(),
                procurementAPI.getProcurementStaff(),
                procurementAPI.getMaterialRequests({ limit: 500, sort: '-createdAt' }),
                taskAPI.getAll({ status: 'Pushed to Procurement,Assigned to Procurement,Pending Manager Review,Pending Procurement Admin Review,Procurement Approved', limit: 500 })
            ]);

            if (vendorList.success) setVendors(vendorList.data);
            if (staffRes.success) setStaff(staffRes.data);
            if (requestsRes.success) {
                console.log('MRs fetched:', requestsRes.data.length);
                setMaterialRequests(requestsRes.data);
            }
            if (taskRes.success) {
                console.log('Pushed Tasks fetched:', taskRes.data.length);
                setPushedTasks(taskRes.data);
            }

            const projRes = await projectAPI.getByStage('Procurement');
            if (projRes.success) setProjects(projRes.data);

            const procRes = await procurementAPI.getStats();
            if (procRes.success) setStats(procRes.data);
        } catch (err) {
            console.error('Error fetching procurement data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveToAdmin = async (request) => {
        try {
            if (request.type === 'Task') {
                await taskAPI.update(request._id, { status: 'Pending Procurement Admin Review' });
            } else {
                await procurementAPI.updateMaterialRequest(request._id, { status: 'Pending Admin Review' });
            }
            await notificationAPI.create({
                recipientRole: 'Super Admin',
                title: 'Procurement Ready for Approval',
                message: `Procurement for ${request.project?.name || request.requestNumber || request.title} is ready for final admin approval.`,
                type: 'info',
                relatedId: request.project?._id,
                relatedModel: 'Project'
            });
            fetchData();
            alert('Sent to Admin for final approval!');
        } catch (err) {
            console.error(err);
            alert('Failed to send to admin.');
        }
    };

    const handleHandoff = async (request) => {
        try {
            const prodRes = await productionAPI.createTask({
                project: request.project?._id,
                title: `Production Start: ${request.requestNumber || request.title}`,
                description: `Materials procured and ready for production. Items: ${request.items?.map(i => i.itemName).join(', ') || 'See details'}`,
                priority: 'High',
                status: 'To Do',
                materialRequest: request._id
            });

            if (prodRes.success) {
                if (request.type === 'Task') {
                    await taskAPI.update(request._id, { status: 'Handed Off' });
                } else {
                    await procurementAPI.updateMaterialRequest(request._id, {
                        status: 'Handed Off',
                        handoffDate: new Date()
                    });
                }
                
                await notificationAPI.create({
                    recipientRole: 'Project Manager',
                    title: 'New Production Handoff',
                    message: `Materials for ${request.requestNumber || request.title} are ready. Production task created.`,
                    type: 'success',
                    relatedId: prodRes.data._id,
                    relatedModel: 'ProductionTask'
                });

                fetchData();
                alert('Project handed off to Project Manager!');
            }
        } catch (err) {
            console.error('Handoff error:', err);
            alert('Failed to handoff: ' + err.message);
        }
    };

    const handleAssignStaff = async (staffId) => {
        try {
            let res;
            if (selectedRequest.type === 'Task') {
                res = await taskAPI.update(selectedRequest._id, { 
                    assignedTo: staffId, 
                    status: 'Assigned to Procurement'
                });
            } else {
                res = await procurementAPI.assignStaff(selectedRequest._id, staffId);
            }

            if (res.success) {
                setShowAssignModal(false);
                setSelectedRequest(null);
                fetchData();
            }
        } catch (err) {
            console.error('Error assigning staff:', err);
            alert('Failed to assign staff: ' + err.message);
        }
    };

    const handleTimeExtension = async (requestId, status, managerRemarks) => {
        try {
            const res = await procurementAPI.respondTimeExtension(requestId, { status, managerRemarks });
            if (res.success) {
                fetchData();
            }
        } catch (err) {
            console.error('Error responding to time extension:', err);
        }
    };

    const handleAddVendor = async () => {
        if (!vendorForm.name || !vendorForm.phone) return alert('Name and phone are required.');
        try {
            setVendorSaving(true);
            const res = await vendorAPI.create(vendorForm);
            if (res.success) {
                setShowAddVendorModal(false);
                setVendorForm(emptyVendorForm);
                fetchData();
            }
        } catch (err) {
            console.error('Error adding vendor:', err);
            alert('Failed to add vendor: ' + err.message);
        } finally {
            setVendorSaving(false);
        }
    };

    const handleViewVendorDetails = async (vendor) => {
        setSelectedVendorDetail(vendor);
        try {
            const historyRes = await procurementAPI.getVendorPurchaseHistory({ vendorId: vendor._id });
            if (historyRes.success) {
                setVendorHistory(historyRes.data);
            } else {
                setVendorHistory([]);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            setVendorHistory([]);
        }
    };

    const addProductRow = () => setVendorForm(prev => ({ ...prev, products: [...prev.products, { itemName: '', unitPrice: '', unit: 'pieces' }] }));
    
    const removeProductRow = (i) => setVendorForm(prev => ({ ...prev, products: prev.products.filter((_, idx) => idx !== i) }));
    
    const updateProductRow = (i, field, val) => setVendorForm(prev => {
        const products = [...prev.products];
        products[i] = { ...products[i], [field]: val };
        return { ...prev, products };
    });

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    const pendingRequests = materialRequests.filter(r => (r.status === 'Pending' || r.status === 'Approved') && !r.isPushedFromDesign);
    
    const handoffMRs = materialRequests.filter(r => (r.status === 'Pending' || r.status === 'Approved') && r.isPushedFromDesign);
    const handoffTasks = pushedTasks.filter(t => !handoffMRs.some(mr => mr.quotation === t.quotation?._id || mr.notes?.includes(t.title)) && t.status === 'Pushed to Procurement');
    
    const designHandoffs = [
        ...handoffMRs.map(r => ({ ...r, type: 'MaterialRequest' })),
        ...handoffTasks.map(t => ({ ...t, type: 'Task' }))
    ];
    
    const allAssigned = [
        ...materialRequests.filter(r => ['Assigned', 'In Progress', 'Purchasing', 'Pending Manager Review', 'Pending Admin Review', 'Pending Procurement Admin Review', 'Procurement Approved'].includes(r.status)).map(r => ({ ...r, type: 'MaterialRequest' })),
        ...pushedTasks.filter(t => ['Assigned to Procurement', 'In Progress', 'Pending Manager Review', 'Pending Procurement Admin Review', 'Procurement Approved'].includes(t.status)).map(t => ({ ...t, type: 'Task' }))
    ];

    const pendingReviews = allAssigned.filter(r => r.status === 'Pending Manager Review');
    const assignedRequests = allAssigned.filter(r => ['Assigned', 'In Progress', 'Purchasing', 'Assigned to Procurement'].includes(r.status));
    const completedRequests = allAssigned.filter(r => r.status === 'Procurement Approved');
    const extensionRequests = materialRequests.filter(r => r.timeExtension && r.timeExtension.status === 'Pending');

    return {
        activeTab,
        stats,
        projects,
        materialRequests,
        pushedTasks,
        staff,
        vendors,
        loading,
        showAssignModal,
        setShowAssignModal,
        selectedRequest,
        setSelectedRequest,
        selectedVendorDetail,
        setSelectedVendorDetail,
        vendorHistory,
        showAddVendorModal,
        setShowAddVendorModal,
        vendorForm,
        setVendorForm,
        vendorSaving,
        selectedReviewItem,
        setSelectedReviewItem,
        fetchData,
        handleApproveToAdmin,
        handleHandoff,
        handleAssignStaff,
        handleTimeExtension,
        handleAddVendor,
        handleViewVendorDetails,
        addProductRow,
        removeProductRow,
        updateProductRow,
        formatCurrency,
        pendingRequests,
        designHandoffs,
        assignedRequests,
        completedRequests,
        extensionRequests,
        navigate
    };
};
