import React, { useState } from 'react';
import { useToast } from '../../models/context/ToastContext';
import { Plus, UserCheck } from 'lucide-react';

// Hooks
import { useStaffState } from './staff/hooks/useStaffState';
import { useStaffData } from './staff/hooks/useStaffData';
import { useStaffActions } from './staff/hooks/useStaffActions';
import { useStaffCalculations } from './staff/hooks/useStaffCalculations';

// Components
import StaffHeader from './staff/components/StaffHeader';
import StaffTable from './staff/components/StaffTable';
import StaffFormModal from './staff/components/StaffFormModal';
import StaffAnalyticsModal from './staff/components/StaffAnalyticsModal';
import StaffSalaryModal from './staff/components/StaffSalaryModal';
import { TableSkeleton } from './components/Skeleton';

import './css/Staff.css';

const Staff = () => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('All');
    
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

    const handleOpenAddStaff = () => {
        state.setEditingStaff(null);
        state.setFormData(state.initialFormData);
        state.setShowModal(true);
    };

    const filteredStaff = state.staffList.filter(staff => {
        const matchesSearch = (
            staff.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            staff.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            staff.role?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            staff.phone?.includes(state.searchTerm) ||
            staff.staffId?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );

        const matchesTab = (
            activeTab === 'All' ||
            (staff.status === activeTab)
        );

        return matchesSearch && matchesTab;
    });

    return (
        <div className="staff-container" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            <div className="staff-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <StaffHeader 
                    staffList={state.staffList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onAddStaff={handleOpenAddStaff}
                />

                {state.loading ? (
                    <TableSkeleton rows={10} cols={6} />
                ) : filteredStaff.length === 0 ? (
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <UserCheck size={28} />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>No Staff Members Found</h4>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                            {state.searchTerm ? 'No staff match your search criteria.' : 'Add a new staff member to manage access, roles, and compensation.'}
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenAddStaff}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '9px 18px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#2563eb',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.84rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            <Plus size={16} /> Add Staff
                        </button>
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
                                dob: staff.dob ? staff.dob.split('T')[0] : '',
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
