import { useState } from 'react';

export const useStaffState = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [selectedAnalytics, setSelectedAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    // Salary State
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [salaryStaff, setSalaryStaff] = useState(null);
    const [salaryLoading, setSalaryLoading] = useState(false);
    const [salarySubmitting, setSalarySubmitting] = useState(false);
    const [salaryEditMode, setSalaryEditMode] = useState(false);
    const [salaryForm, setSalaryForm] = useState({
        baseSalary: '', hra: '', travelAllowance: '', otherAllowances: '',
        providentFund: '', taxDeduction: '', otherDeductions: '',
        effectiveFrom: '', notes: ''
    });

    const initialFormData = {
        name: '', email: '', phone: '', role: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active', password: '', confirmPassword: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phone: digits }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return {
        staffList, setStaffList,
        loading, setLoading,
        searchTerm, setSearchTerm,
        showModal, setShowModal,
        showAnalytics, setShowAnalytics,
        editingStaff, setEditingStaff,
        selectedAnalytics, setSelectedAnalytics,
        analyticsLoading, setAnalyticsLoading,
        error, setError,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        showSalaryModal, setShowSalaryModal,
        salaryStaff, setSalaryStaff,
        salaryLoading, setSalaryLoading,
        salarySubmitting, setSalarySubmitting,
        salaryEditMode, setSalaryEditMode,
        salaryForm, setSalaryForm,
        formData, setFormData,
        initialFormData,
        handleInputChange
    };
};
