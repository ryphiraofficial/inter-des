import React from 'react';
import { useToast } from '../../models/context/ToastContext';

// Hooks
import { useStaffState } from './staff/hooks/useStaffState';
import { useStaffData } from './staff/hooks/useStaffData';
import { useStaffActions } from './staff/hooks/useStaffActions';
import { useStaffCalculations } from './staff/hooks/useStaffCalculations';

// Components
import StaffTable from './staff/components/StaffTable';
import StaffFormModal from './staff/components/StaffFormModal';
import StaffAnalyticsModal from './staff/components/StaffAnalyticsModal';
import StaffSalaryModal from './staff/components/StaffSalaryModal';
import { TableSkeleton } from './components/Skeleton';

import './css/Staff.css';

const Staff = () => {
    const { showToast } = useToast();
    
    const state = useStaffState();
    
    const data = useStaffData({
        setStaffList: state.setStaffList, setLoading: state.setLoading,
        setError: state.setError, showToast, setShowModal: state.setShowModal,
        setSearchTerm: state.setSearchTerm
    });

    const actions = useStaffActions({
        editingStaff: state.editingStaff, formData: state.formData, fetchStaff: data.fetchStaff,
        showToast, closeModal: () => {
            state.setShowModal(false); state.setEditingStaff(null);
            state.setFormData(state.initialFormData); state.setError(null);
        },
        setSubmitting: state.setSubmitting, setSalaryStaff: state.setSalaryStaff,
        setSalaryForm: state.setSalaryForm, setSalaryEditMode: state.setSalaryEditMode,
        setSalaryLoading: state.setSalaryLoading, setShowSalaryModal: state.setShowSalaryModal,
        setSalarySubmitting: state.setSalarySubmitting, setSelectedAnalytics: state.setSelectedAnalytics,
        setAnalyticsLoading: state.setAnalyticsLoading, setShowAnalytics: state.setShowAnalytics
    });

    const { calcGross, calcDeductions, calcNetPay, fmtINR } = useStaffCalculations();

    const filteredStaff = state.staffList.filter(staff =>
        staff.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        staff.role?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        staff.phone?.includes(state.searchTerm) ||
        staff.staffId?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    if (state.loading) {
        return (
            <div className="staff-container">
                <div className="staff-wrapper">
                    <TableSkeleton rows={10} cols={6} />
                </div>
            </div>
        );
    }

    return (
        <div className="staff-container">
            <div className="staff-wrapper">
                {filteredStaff.length === 0 ? (
                    <div className="empty-state">
                        <h4>No staff members found</h4>
                        <p>Add a new staff member to get started</p>
                    </div>
                ) : (
                    <StaffTable 
                        staffList={filteredStaff}
                        expandedRow={state.expandedRow}
                        toggleRow={(id) => state.setExpandedRow(state.expandedRow === id ? null : id)}
                        handleViewSalary={actions.handleViewSalary}
                        handleViewAnalytics={actions.handleViewAnalytics}
                        handleEdit={(staff) => {
                            state.setEditingStaff(staff);
                            state.setFormData({
                                name: staff.name || '', email: staff.email || '', phone: staff.phone || '',
                                role: staff.role || '', joiningDate: staff.joiningDate ? staff.joiningDate.split('T')[0] : '',
                                status: staff.status || 'Active'
                            });
                            state.setShowModal(true);
                        }}
                        handleDelete={actions.handleDelete}
                    />
                )}
            </div>

            <StaffFormModal 
                show={state.showModal}
                closeModal={() => { state.setShowModal(false); state.setEditingStaff(null); state.setFormData(state.initialFormData); }}
                editingStaff={state.editingStaff}
                handleSubmit={actions.handleSubmit}
                formData={state.formData}
                handleInputChange={state.handleInputChange}
                submitting={state.submitting}
            />

            <StaffAnalyticsModal 
                show={state.showAnalytics}
                setShow={state.setShowAnalytics}
                analyticsLoading={state.analyticsLoading}
                selectedAnalytics={state.selectedAnalytics}
            />

            <StaffSalaryModal 
                show={state.showSalaryModal}
                setShow={state.setShowSalaryModal}
                salaryLoading={state.salaryLoading}
                salaryStaff={state.salaryStaff}
                salaryEditMode={state.salaryEditMode}
                setSalaryEditMode={state.setSalaryEditMode}
                salaryForm={state.salaryForm}
                setSalaryForm={state.setSalaryForm}
                handleSalarySubmit={actions.handleSalarySubmit}
                salarySubmitting={state.salarySubmitting}
                fmtINR={fmtINR}
                calcGross={calcGross}
                calcDeductions={calcDeductions}
            />
        </div>
    );
};

export default Staff;
