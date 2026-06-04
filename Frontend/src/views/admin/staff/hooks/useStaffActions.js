import { 
    useCreateStaffMutation, 
    useUpdateStaffMutation, 
    useDeleteStaffMutation,
    useUpdateStaffSalaryMutation,
    adminApi
} from '../../../../store/api/adminApi';
import { useDispatch } from 'react-redux';

export const useStaffActions = ({ 
    editingStaff, formData, fetchStaff, showToast, closeModal, 
    setSubmitting, setSalaryStaff, setSalaryForm, setSalaryEditMode,
    setSalaryLoading, setShowSalaryModal, setSalarySubmitting,
    setSelectedAnalytics, setAnalyticsLoading, setShowAnalytics
}) => {
    const dispatch = useDispatch();

    const [createStaff] = useCreateStaffMutation();
    const [updateStaff] = useUpdateStaffMutation();
    const [deleteStaff] = useDeleteStaffMutation();
    const [updateStaffSalary] = useUpdateStaffSalaryMutation();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        // Validation logic
        if (!formData.name || formData.name.trim().length < 2) { showToast('Name too short', 'error'); return; }
        if (!/^[0-9]{10}$/.test(formData.phone)) { showToast('Phone must be 10 digits', 'error'); return; }
        
        setSubmitting(true);
        try {
            if (editingStaff) {
                await updateStaff({ id: editingStaff._id, ...formData }).unwrap();
                await fetchStaff(); showToast('Updated!'); closeModal();
            } else {
                await createStaff(formData).unwrap();
                await fetchStaff(); showToast('Added!'); closeModal();
            }
        } catch (err) {
            showToast(err.data?.message || err.message || 'Error', 'error');
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
            const res = await dispatch(adminApi.endpoints.getStaffSalary.initiate(staff._id)).unwrap();
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
            const res = await updateStaffSalary({ id: salaryStaff._id, ...salaryForm }).unwrap();
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
            const response = await dispatch(adminApi.endpoints.getStaffAnalytics.initiate(staff._id)).unwrap();
            if (response.success) setSelectedAnalytics(response.data);
        } catch (err) { showToast('Failed to load analytics', 'error'); }
        finally { setAnalyticsLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this staff member?')) return;
        try {
            await deleteStaff(id).unwrap();
            await fetchStaff(); showToast('Deleted');
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
