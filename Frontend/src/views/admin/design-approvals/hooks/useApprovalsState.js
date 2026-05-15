import { useState } from 'react';

export const useApprovalsState = () => {
    const [activeTab, setActiveTab] = useState('design');
    const [tasks, setTasks] = useState([]);
    const [procurementItems, setProcurementItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productionManagers, setProductionManagers] = useState([]);
    
    // Design Review Modal
    const [showDesignModal, setShowDesignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    
    // Payment Modal
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentTask, setPaymentTask] = useState(null);
    const [advancePct, setAdvancePct] = useState(30);
    const [paymentDueDate, setPaymentDueDate] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');
    const [submittingApproval, setSubmittingApproval] = useState(false);

    // Procurement State
    const [selectedPM, setSelectedPM] = useState({});
    const [sentToAccounts, setSentToAccounts] = useState({});
    const [approving, setApproving] = useState({});

    return {
        activeTab, setActiveTab,
        tasks, setTasks,
        procurementItems, setProcurementItems,
        loading, setLoading,
        productionManagers, setProductionManagers,
        showDesignModal, setShowDesignModal,
        selectedTask, setSelectedTask,
        showPaymentModal, setShowPaymentModal,
        paymentTask, setPaymentTask,
        advancePct, setAdvancePct,
        paymentDueDate, setPaymentDueDate,
        paymentNotes, setPaymentNotes,
        submittingApproval, setSubmittingApproval,
        selectedPM, setSelectedPM,
        sentToAccounts, setSentToAccounts,
        approving, setApproving
    };
};
