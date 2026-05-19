import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { projectAPI, vendorAPI, procurementAPI, notificationAPI, taskAPI } from '../../../models/api';

export const useProcurementStaffLogic = (user) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [vendorStats, setVendorStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [vendorSearch, setVendorSearch] = useState('');
    
    // Sourcing Hub States
    const [selectedSourcingProject, setSelectedSourcingProject] = useState(null);
    const [sourcingBucket, setSourcingBucket] = useState([]);
    const [savedSourcing, setSavedSourcing] = useState([]);
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

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, vendorsRes, projectsRes] = await Promise.all([
                procurementAPI.getStaffTasks(),
                vendorAPI.getAll(),
                projectAPI.getByStage('Procurement')
            ]);

            if (tasksRes.success) setTasks(tasksRes.data);
            if (vendorsRes.success) setVendors(vendorsRes.data);
            
            if (projectsRes.success || tasksRes.success) {
                const projMap = new Map();
                if (projectsRes.success) {
                    projectsRes.data.forEach(p => projMap.set(p._id, p));
                }
                if (tasksRes.success) {
                    tasksRes.data.forEach(t => {
                        if (t.project && t.project._id) {
                            projMap.set(t.project._id, t.project);
                        }
                    });
                }
                setProjects(Array.from(projMap.values()));
            }

            const saved = localStorage.getItem('savedSourcing');
            if (saved) setSavedSourcing(JSON.parse(saved));

            await fetchPurchaseHistory();
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

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
            await notificationAPI.create({
                recipientRole: 'Procurement Manager',
                title: `Sourcing Update: ${selectedSourcingProject.name}`,
                message: `Staff ${user?.fullName || ''} has updated the sourcing list for project ${selectedSourcingProject.projectNumber}. Status: ${dailyUpdate || 'In Progress'}`,
                type: 'info',
                relatedId: selectedSourcingProject._id,
                relatedModel: 'Project'
            });

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

    const fetchPurchaseHistory = async (query = '') => {
        try {
            const historyRes = await procurementAPI.getVendorPurchaseHistory(
                query ? { search: query } : {}
            );
            if (historyRes.success) {
                setPurchaseHistory(historyRes.data);
                setVendorStats(historyRes.vendorStats);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleSearch = () => {
        fetchPurchaseHistory(searchQuery);
    };

    const handleComparePrices = async () => {
        try {
            const items = itemsToBuy.map(item => ({
                itemName: item.itemName,
                quantity: item.quantity || 1
            }));
            const result = await procurementAPI.compareVendorPrices(items);
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
            await procurementAPI.requestTimeExtension(selectedTask._id, {
                requestedDate: extensionDate,
                reason: extensionReason
            });
            setShowTimeExtension(false);
            setExtensionDate('');
            setExtensionReason('');
            fetchData();
        } catch (err) {
            console.error('Error requesting extension:', err);
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            if (task.type === 'Task') {
                await taskAPI.update(task._id, { status: 'Pending Manager Review' });
            } else {
                await procurementAPI.updateMaterialRequest(task._id, { status: 'Pending Manager Review', completedAt: new Date() });
            }
            
            // Notify the manager
            await notificationAPI.create({
                recipientRole: 'Procurement Manager',
                title: `Task Submitted for Review: ${task.requestNumber || task.title}`,
                message: `Staff member ${user?.fullName || 'A staff member'} has submitted sourcing for project ${task.project?.name || 'N/A'}.`,
                type: 'info',
                relatedId: task.project?._id,
                relatedModel: 'Project'
            });
            
            setShowTaskDetailsModal(false);
            fetchData();
            alert('Task submitted to manager for review!');
        } catch (err) {
            console.error('Error completing task:', err);
            alert('Failed to submit task.');
        }
    };

    const recordPurchase = async (purchaseData) => {
        try {
            await procurementAPI.createVendorPurchase(purchaseData);
            setShowPurchaseModal(false);
            await procurementAPI.updateMaterialRequest(selectedTask._id, {
                status: 'Pending Manager Review',
                completedAt: new Date()
            });
            fetchData();
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
        fetchData,
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
