import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCreateNotificationMutation } from '../../../store/api/sharedApi';
import {
    useGetStaffTasksQuery,
    useGetVendorsQuery,
    useGetProjectsByStageQuery,
    useGetVendorPurchaseHistoryQuery,
    useCompareVendorPricesMutation,
    useRequestTimeExtensionMutation,
    useUpdateTaskMutation,
    useUpdateMaterialRequestMutation,
    useCreateVendorPurchaseMutation
} from '../../../store/api/procurementApi';

export const useProcurementStaffLogic = (user) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [vendorSearch, setVendorSearch] = useState('');
    
    // Sourcing Hub States
    const [selectedSourcingProject, setSelectedSourcingProject] = useState(null);
    const [sourcingBucket, setSourcingBucket] = useState([]);
    const [savedSourcing, setSavedSourcing] = useState(() => {
        const saved = localStorage.getItem('savedSourcing');
        return saved ? JSON.parse(saved) : [];
    });
    const [sourcingSearch, setSourcingSearch] = useState('');
    const [dailyUpdate, setDailyUpdate] = useState('');

    const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
    const [showTimeExtension, setShowTimeExtension] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [itemsToBuy, setItemsToBuy] = useState([]);
    const [extensionReason, setExtensionReason] = useState('');
    const [extensionDate, setExtensionDate] = useState('');
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [compareResults, setCompareResults] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    // RTK Query Hooks
    const { data: tasksRes, isLoading: tasksLoading } = useGetStaffTasksQuery();
    const { data: vendorsRes, isLoading: vendorsLoading } = useGetVendorsQuery();
    const { data: projectsRes, isLoading: projectsLoading } = useGetProjectsByStageQuery('Procurement');
    const { data: historyRes, isLoading: historyLoading } = useGetVendorPurchaseHistoryQuery(searchQuery ? { search: searchQuery } : {});

    const [comparePrices] = useCompareVendorPricesMutation();
    const [requestTimeExtension] = useRequestTimeExtensionMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [updateMaterialRequest] = useUpdateMaterialRequestMutation();
    const [createVendorPurchase] = useCreateVendorPurchaseMutation();
    const [createNotification] = useCreateNotificationMutation();

    const loading = tasksLoading || vendorsLoading || projectsLoading || historyLoading;

    const vendors = vendorsRes?.success ? vendorsRes.data : [];
    const tasks = tasksRes?.success ? tasksRes.data : [];
    const projectsList = projectsRes?.success ? projectsRes.data : [];
    
    // Compute combined projects list from projects by stage + projects embedded in tasks
    const projects = (() => {
        const projMap = new Map();
        projectsList.forEach(p => projMap.set(p._id, p));
        tasks.forEach(t => {
            if (t.project && t.project._id) {
                projMap.set(t.project._id, t.project);
            }
        });
        return Array.from(projMap.values());
    })();

    const purchaseHistory = historyRes?.success ? historyRes.data : [];
    const vendorStats = historyRes?.vendorStats || [];

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const handleSaveSourcing = async () => {
        if (!selectedSourcingProject || sourcingBucket.length === 0) return;
        
        try {
            const newEntry = {
                id: Date.now(),
                project: selectedSourcingProject,
                items: sourcingBucket,
                dailyUpdate,
                savedAt: new Date()
            };
            const updated = [newEntry, ...savedSourcing];
            setSavedSourcing(updated);
            localStorage.setItem('savedSourcing', JSON.stringify(updated));
            
            // Send daily update notification to manager
            await createNotification({
                recipientRole: 'Procurement Manager',
                title: `Sourcing Update: ${selectedSourcingProject.name}`,
                message: `Staff ${user?.fullName || ''} has updated the sourcing list for project ${selectedSourcingProject.projectNumber}. Status: ${dailyUpdate || 'In Progress'}`,
                type: 'info',
                relatedId: selectedSourcingProject._id,
                relatedModel: 'Project'
            }).unwrap();

            setSourcingBucket([]);
            setSelectedSourcingProject(null);
            setDailyUpdate('');
            alert('Sourcing list saved and manager notified!');
        } catch (err) {
            console.error('Error saving sourcing:', err);
            alert('Saved locally, but failed to notify manager.');
        }
    };

    const handleAddToBucket = (product, vendor) => {
        const newItem = {
            ...product,
            vendorName: vendor.name,
            vendorLocation: vendor.location || vendor.address,
            vendorId: vendor._id,
            addedAt: new Date()
        };
        setSourcingBucket(prev => [...prev, newItem]);
    };

    const handleRemoveFromBucket = (idx) => {
        setSourcingBucket(prev => prev.filter((_, i) => i !== idx));
    };

    const handleDeleteSaved = (id) => {
        const updated = savedSourcing.filter(s => s.id !== id);
        setSavedSourcing(updated);
        localStorage.setItem('savedSourcing', JSON.stringify(updated));
    };

    // Note: handleSearch is not explicitly needed as RTK Query auto-fetches when searchQuery state changes,
    // but we can keep it as a no-op to satisfy UI events if they explicitly call it,
    // or just let the button do nothing as the state update handles it.
    const handleSearch = () => {
        // Query args in useGetVendorPurchaseHistoryQuery will trigger a fetch automatically.
    };

    const handleComparePrices = async () => {
        try {
            const items = itemsToBuy.map(item => ({
                itemName: item.itemName,
                quantity: item.quantity || 1
            }));
            const result = await comparePrices(items).unwrap();
            if (result.success) {
                setCompareResults(result.data);
                setShowCompareModal(true);
            }
        } catch (err) {
            console.error('Error comparing prices:', err);
        }
    };

    const handleRequestTimeExtension = async () => {
        try {
            await requestTimeExtension({
                id: selectedTask._id,
                requestedDate: extensionDate,
                reason: extensionReason
            }).unwrap();
            setShowTimeExtension(false);
            setExtensionDate('');
            setExtensionReason('');
        } catch (err) {
            console.error('Error requesting extension:', err);
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            if (task.type === 'Task') {
                await updateTask({ id: task._id, status: 'Pending Manager Review' }).unwrap();
            } else {
                await updateMaterialRequest({ id: task._id, status: 'Pending Manager Review', completedAt: new Date() }).unwrap();
            }
            
            // Notify the manager
            await createNotification({
                recipientRole: 'Procurement Manager',
                title: `Task Submitted for Review: ${task.requestNumber || task.title}`,
                message: `Staff member ${user?.fullName || 'A staff member'} has submitted sourcing for project ${task.project?.name || 'N/A'}.`,
                type: 'info',
                relatedId: task.project?._id,
                relatedModel: 'Project'
            }).unwrap();
            
            setShowTaskDetailsModal(false);
            alert('Task submitted to manager for review!');
        } catch (err) {
            console.error('Error completing task:', err);
            alert('Failed to submit task.');
        }
    };

    const recordPurchase = async (purchaseData) => {
        try {
            await createVendorPurchase(purchaseData).unwrap();
            setShowPurchaseModal(false);
            await updateMaterialRequest({
                id: selectedTask._id,
                status: 'Pending Manager Review',
                completedAt: new Date()
            }).unwrap();
        } catch (err) {
            console.error('Error recording purchase:', err);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    const pendingTasks = tasks.filter(t => t.status === 'Assigned' || t.status === 'Assigned to Procurement');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'Purchasing');
    const completedTasks = tasks.filter(t => ['Completed', 'Pending Manager Review', 'Pending Admin Review', 'Pending Procurement Admin Review', 'Procurement Approved'].includes(t.status));

    const vendorPurchaseCounts = (vendorStats || []).reduce((acc, v) => {
        const vid = v.vendor?._id || v.vendor;
        if (vid) {
            acc[vid] = {
                totalPurchases: v.totalPurchases,
                totalAmount: v.totalAmount,
                totalDiscount: v.totalDiscount
            };
        }
        return acc;
    }, {});

    return {
        activeTab,
        setActiveTab,
        projects,
        tasks,
        vendors,
        purchaseHistory,
        vendorStats,
        loading,
        searchQuery,
        setSearchQuery,
        vendorSearch,
        setVendorSearch,
        selectedSourcingProject,
        setSelectedSourcingProject,
        sourcingBucket,
        setSourcingBucket,
        savedSourcing,
        sourcingSearch,
        setSourcingSearch,
        dailyUpdate,
        setDailyUpdate,
        showTaskDetailsModal,
        setShowTaskDetailsModal,
        showTimeExtension,
        setShowTimeExtension,
        selectedTask,
        setSelectedTask,
        selectedVendor,
        setSelectedVendor,
        itemsToBuy,
        setItemsToBuy,
        extensionReason,
        setExtensionReason,
        extensionDate,
        setExtensionDate,
        showCompareModal,
        setShowCompareModal,
        compareResults,
        showPurchaseModal,
        setShowPurchaseModal,
        handleSaveSourcing,
        handleAddToBucket,
        handleRemoveFromBucket,
        handleDeleteSaved,
        handleSearch,
        handleComparePrices,
        handleRequestTimeExtension,
        handleCompleteTask,
        recordPurchase,
        formatCurrency,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        vendorPurchaseCounts,
        navigate
    };
};
