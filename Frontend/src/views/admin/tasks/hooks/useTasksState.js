import { useState } from 'react';

export const useTasksState = (searchParams) => {
    const [tasks, setTasks] = useState([]);
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const [quotations, setQuotations] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'All');
    const [filterPriority, setFilterPriority] = useState('All');
    
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDesignModal, setShowDesignModal] = useState(false);
    
    const [taskVisits, setTaskVisits] = useState([]);
    const [visitsLoading, setVisitsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const initialFormData = {
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        assignedTo: '',
        client: '',
        quotation: '',
        dueDate: '',
        estimatedDuration: '',
        project: '',
        progress: 0
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'range' ? parseInt(value, 10) : value;

        if (name === 'client') {
            setFormData(prev => ({
                ...prev,
                client: newValue,
                quotation: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: newValue
            }));
        }
    };

    return {
        tasks, setTasks,
        staff, setStaff,
        clients, setClients,
        quotations, setQuotations,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        filterStatus, setFilterStatus,
        filterPriority, setFilterPriority,
        showTaskModal, setShowTaskModal,
        editingTask, setEditingTask,
        selectedTask, setSelectedTask,
        showDetailsModal, setShowDetailsModal,
        showDesignModal, setShowDesignModal,
        taskVisits, setTaskVisits,
        visitsLoading, setVisitsLoading,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        formData, setFormData,
        initialFormData,
        handleInputChange
    };
};
