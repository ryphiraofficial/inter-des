import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateNotificationMutation } from '../../../store/api/sharedApi';
import {
    useGetMaterialRequestsQuery,
    useGetTasksQuery,
    useGetVendorsQuery,
    useGetProcurementStaffQuery,
    useGetProjectsByStageQuery,
    useGetProcurementStatsQuery,
    useUpdateTaskMutation,
    useUpdateMaterialRequestMutation,
    useAssignStaffToRequestMutation,
    useRespondTimeExtensionMutation,
    useCreateVendorMutation,
    useLazyGetVendorPurchaseHistoryQuery
} from '../../../store/api/procurementApi';
import { useCreateProductionTaskMutation as useProductionCreateTaskMutation } from '../../../store/api/productionApi';

export const useProcurementManagerLogic = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const [showHandoffModal, setShowHandoffModal] = useState(false);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedVendorDetail, setSelectedVendorDetail] = useState(null);
    const [vendorHistory, setVendorHistory] = useState([]);
    const [showAddVendorModal, setShowAddVendorModal] = useState(false);
    
    const emptyVendorForm = { name: '', email: '', phone: '', address: '', category: '', gstin: '', products: [] };
    const [vendorForm, setVendorForm] = useState(emptyVendorForm);
    const [vendorSaving, setVendorSaving] = useState(false);
    const [selectedReviewItem, setSelectedReviewItem] = useState(null);

    // RTK Query hooks
    const { data: vendorsRes, isLoading: vendorsLoading } = useGetVendorsQuery();
    const { data: staffRes, isLoading: staffLoading } = useGetProcurementStaffQuery();
    const { data: requestsRes, isLoading: requestsLoading } = useGetMaterialRequestsQuery({ limit: 500, sort: '-createdAt' });
    const { data: tasksRes, isLoading: tasksLoading } = useGetTasksQuery({ status: 'Pushed to Procurement,Assigned to Procurement,Pending Manager Review,Pending Procurement Admin Review,Procurement Approved', limit: 500 });
    const { data: projRes, isLoading: projLoading } = useGetProjectsByStageQuery('Procurement');
    const { data: procStatsRes, isLoading: statsLoading } = useGetProcurementStatsQuery();
    
    const [getVendorHistory] = useLazyGetVendorPurchaseHistoryQuery();

    const [updateTask] = useUpdateTaskMutation();
    const [updateMaterialRequest] = useUpdateMaterialRequestMutation();
    const [assignStaff] = useAssignStaffToRequestMutation();
    const [respondTimeExtension] = useRespondTimeExtensionMutation();
    const [createVendor] = useCreateVendorMutation();
    const [createProductionTask] = useProductionCreateTaskMutation();
    const [createNotification] = useCreateNotificationMutation();

    const loading = vendorsLoading || staffLoading || requestsLoading || tasksLoading || projLoading || statsLoading;

    const vendors = vendorsRes?.success ? vendorsRes.data : [];
    const staff = staffRes?.success ? staffRes.data : [];
    const materialRequests = requestsRes?.success ? requestsRes.data : [];
    const pushedTasks = tasksRes?.success ? tasksRes.data : [];
    const projects = projRes?.success ? projRes.data : [];
    const stats = procStatsRes?.success ? procStatsRes.data : null;

    useEffect(() => {
        const handleOpenAddVendor = () => setShowAddVendorModal(true);
        window.addEventListener('open-create-vendor-modal', handleOpenAddVendor);
        return () => window.removeEventListener('open-create-vendor-modal', handleOpenAddVendor);
    }, []);

    const handleApproveToAdmin = async (request) => {
        try {
            if (request.type === 'Task') {
                await updateTask({ id: request._id, status: 'Pending Procurement Admin Review' }).unwrap();
            } else {
                await updateMaterialRequest({ id: request._id, status: 'Pending Admin Review' }).unwrap();
            }
            await createNotification({
                recipientRole: 'Super Admin',
                title: 'Procurement Ready for Approval',
                message: `Procurement for ${request.project?.name || request.requestNumber || request.title} is ready for final admin approval.`,
                type: 'info',
                relatedId: request.project?._id,
                relatedModel: 'Project'
            }).unwrap();
            alert('Sent to Admin for final approval!');
        } catch (err) {
            console.error(err);
            alert('Failed to send to admin.');
        }
    };

    const handleHandoff = async (request) => {
        try {
            const prodRes = await createProductionTask({
                project: request.project?._id,
                title: `Production Start: ${request.requestNumber || request.title}`,
                description: `Materials procured and ready for production. Items: ${request.items?.map(i => i.itemName).join(', ') || 'See details'}`,
                priority: 'High',
                status: 'To Do',
                materialRequest: request._id
            }).unwrap();

            if (prodRes.success) {
                if (request.type === 'Task') {
                    await updateTask({ id: request._id, status: 'Handed Off' }).unwrap();
                } else {
                    await updateMaterialRequest({
                        id: request._id,
                        status: 'Handed Off',
                        handoffDate: new Date()
                    }).unwrap();
                }
                
                await createNotification({
                    recipientRole: 'Project Manager',
                    title: 'New Production Handoff',
                    message: `Materials for ${request.requestNumber || request.title} are ready. Production task created.`,
                    type: 'success',
                    relatedId: prodRes.data._id,
                    relatedModel: 'ProductionTask'
                }).unwrap();

                alert('Project handed off to Project Manager!');
            }
        } catch (err) {
            console.error('Handoff error:', err);
            alert('Failed to handoff: ' + (err.data?.message || err.message || 'Unknown error'));
        }
    };

    const handleAssignStaff = async (staffId) => {
        try {
            let res;
            if (selectedRequest.type === 'Task') {
                res = await updateTask({ 
                    id: selectedRequest._id, 
                    assignedTo: staffId, 
                    status: 'Assigned to Procurement'
                }).unwrap();
            } else {
                res = await assignStaff({ id: selectedRequest._id, staffId }).unwrap();
            }

            if (res.success) {
                setShowAssignModal(false);
                setSelectedRequest(null);
            }
        } catch (err) {
            console.error('Error assigning staff:', err);
            alert('Failed to assign staff: ' + (err.data?.message || err.message));
        }
    };

    const handleTimeExtension = async (requestId, status, managerRemarks) => {
        try {
            await respondTimeExtension({ id: requestId, status, managerRemarks }).unwrap();
        } catch (err) {
            console.error('Error responding to time extension:', err);
        }
    };

    const handleAddVendor = async () => {
        if (!vendorForm.name || !vendorForm.phone) return alert('Name and phone are required.');
        try {
            setVendorSaving(true);
            const res = await createVendor(vendorForm).unwrap();
            if (res.success) {
                setShowAddVendorModal(false);
                setVendorForm(emptyVendorForm);
            }
        } catch (err) {
            console.error('Error adding vendor:', err);
            alert('Failed to add vendor: ' + (err.data?.message || err.message));
        } finally {
            setVendorSaving(false);
        }
    };

    const handleViewVendorDetails = async (vendor) => {
        setSelectedVendorDetail(vendor);
        try {
            const historyRes = await getVendorHistory({ vendorId: vendor._id }).unwrap();
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
        pendingReviews,
        designHandoffs,
        assignedRequests,
        completedRequests,
        extensionRequests,
        navigate
    };
};
