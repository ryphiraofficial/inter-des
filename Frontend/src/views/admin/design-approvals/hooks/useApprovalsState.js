import { useState } from 'react';

export const useApprovalsState = () => {
    const [activeTab, setActiveTab] = useState('design');
    const [tasks, setTasks] = useState([]);
    const [accountsProjects, setAccountsProjects] = useState([]);
    const [procurementItems, setProcurementItems] = useState([]);
    const [productionProjects, setProductionProjects] = useState([]);
    const [edgeBandsCount, setEdgeBandsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [productionManagers, setProductionManagers] = useState([]);
    const [procurementManagers, setProcurementManagers] = useState([]);
    const [accountsManagers, setAccountsManagers] = useState([]);
    
    // Design Review Modal
    const [showDesignModal, setShowDesignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    
    // Payment Modal
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentTask, setPaymentTask] = useState(null);
    const [advancePct, setAdvancePct] = useState(30);
    const [paymentDueDate, setPaymentDueDate] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');
    const [selectedProcurementManagerId, setSelectedProcurementManagerId] = useState('');
    const [selectedAccountsManagerId, setSelectedAccountsManagerId] = useState('');
    const [submittingApproval, setSubmittingApproval] = useState(false);

    // Procurement State
    const [selectedPM, setSelectedPM] = useState({});
    const [sentToAccounts, setSentToAccounts] = useState({});
    const [approving, setApproving] = useState({});

    // Production Approval State
    const [approvingProduction, setApprovingProduction] = useState({});

    return {
        activeTab, setActiveTab,
        tasks, setTasks,
        accountsProjects, setAccountsProjects,
        procurementItems, setProcurementItems,
        productionProjects, setProductionProjects,
        edgeBandsCount, setEdgeBandsCount,
        loading, setLoading,
        productionManagers, setProductionManagers,
        procurementManagers, setProcurementManagers,
        accountsManagers, setAccountsManagers,
        showDesignModal, setShowDesignModal,
        selectedTask, setSelectedTask,
        showPaymentModal, setShowPaymentModal,
        paymentTask, setPaymentTask,
        advancePct, setAdvancePct,
        paymentDueDate, setPaymentDueDate,
        paymentNotes, setPaymentNotes,
        selectedProcurementManagerId, setSelectedProcurementManagerId,
        selectedAccountsManagerId, setSelectedAccountsManagerId,
        submittingApproval, setSubmittingApproval,
        selectedPM, setSelectedPM,
        sentToAccounts, setSentToAccounts,
        approving, setApproving,
        approvingProduction, setApprovingProduction
    };
};
