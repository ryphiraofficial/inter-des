import { staffAPI } from '../../../../models/api';

export const useStaffActions = ({ 
    editingStaff, formData, fetchStaff, showToast, closeModal, 
    setSubmitting, setSalaryStaff, setSalaryForm, setSalaryEditMode,
    setSalaryLoading, setShowSalaryModal, setSalarySubmitting,
    setSelectedAnalytics, setAnalyticsLoading, setShowAnalytics
}) => {

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // Validation logic
        if (!formData.name || formData.name.trim().length < 2) { showToast('Name too short', 'error'); return; }
        if (!/^[0-9]{10}$/.test(formData.phone)) { showToast('Phone must be 10 digits', 'error'); return; }
        
        setSubmitting(true);
        try {
            if (editingStaff) {
                const response = await staffAPI.update(editingStaff._id, formData);
                if (response.success) { await fetchStaff(); showToast('Updated!'); closeModal(); }
            } else {
                const response = await staffAPI.create(formData);
                if (response.success) { await fetchStaff(); showToast('Added!'); closeModal(); }
            }
        } catch (err) {
            showToast(err.message || 'Error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewSalary = async (staff) => {
        setSalaryStaff(null);
        setSalaryEditMode(false);
        setSalaryLoading(true);
        setShowSalaryModal(true);
        try {
            const res = await staffAPI.getSalary(staff._id);
            if (res.success) {
                setSalaryStaff(res.data);
                const s = res.data.salary || {};
                setSalaryForm({
                    baseSalary: s.baseSalary || '', hra: s.hra || '', travelAllowance: s.travelAllowance || '',
                    otherAllowances: s.otherAllowances || '', providentFund: s.providentFund || '',
                    taxDeduction: s.taxDeduction || '', otherDeductions: s.otherDeductions || '',
                    effectiveFrom: s.effectiveFrom ? s.effectiveFrom.split('T')[0] : '', notes: s.notes || ''
                });
            }
        } catch (err) { showToast('Failed to load salary', 'error'); }
        finally { setSalaryLoading(false); }
    };

    const handleSalarySubmit = async (e, salaryStaff, salaryForm) => {
        if (e) e.preventDefault();
        setSalarySubmitting(true);
        try {
            const res = await staffAPI.updateSalary(salaryStaff._id, salaryForm);
            if (res.success) {
                setSalaryStaff(res.data);
                setSalaryEditMode(false);
                showToast('Salary updated', 'success');
            }
        } catch (err) { showToast('Update failed', 'error'); }
        finally { setSalarySubmitting(false); }
    };

    const handleViewAnalytics = async (staff) => {
        setSelectedAnalytics(null);
        setAnalyticsLoading(true);
        setShowAnalytics(true);
        try {
            const response = await staffAPI.getAnalytics(staff._id);
            if (response.success) setSelectedAnalytics(response.data);
        } catch (err) { showToast('Failed to load analytics', 'error'); }
        finally { setAnalyticsLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this staff member?')) return;
        try {
            const response = await staffAPI.delete(id);
            if (response.success) { await fetchStaff(); showToast('Deleted'); }
        } catch (err) { showToast('Delete failed', 'error'); }
    };

    return {
        handleSubmit,
        handleViewSalary,
        handleSalarySubmit,
        handleViewAnalytics,
        handleDelete
    };
};
