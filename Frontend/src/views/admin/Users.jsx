import React from 'react';
import { useUserState } from './users/hooks/useUserState';
import { useUserData } from './users/hooks/useUserData';
import { useUserActions } from './users/hooks/useUserActions';

import UserTable from './users/components/UserTable';
import UserFormModal from './users/components/UserFormModal';

import './css/Users.css';

const Users = () => {
    const state = useUserState();
    
    const { fetchUsers } = useUserData({
        setUsers: state.setUsers,
        setLoading: state.setLoading,
        setError: state.setError,
        setEditingUser: state.setEditingUser,
        setFormData: state.setFormData,
        setShowModal: state.setShowModal,
        setSearchTerm: state.setSearchTerm
    });

    const actions = useUserActions({
        fetchUsers,
        setSubmitting: state.setSubmitting,
        setShowModal: state.setShowModal,
        setEditingUser: state.setEditingUser,
        setFormData: state.setFormData,
        setUsers: state.setUsers,
        users: state.users
    });

    const filteredUsers = state.users.filter(user =>
        user.fullName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    return (
        <div className="users-container">
            <div className="users-wrapper">
                <UserTable 
                    users={filteredUsers}
                    loading={state.loading}
                    expandedRow={state.expandedRow}
                    toggleRow={toggleRow}
                    handleEditClick={actions.handleEditClick}
                    handleDelete={actions.handleDelete}
                />
            </div>

            <UserFormModal 
                showModal={state.showModal}
                editingUser={state.editingUser}
                formData={state.formData}
                handleInputChange={actions.handleInputChange}
                submitting={state.submitting}
                handleSubmit={actions.handleSubmit}
                setShowModal={state.setShowModal}
            />
        </div>
    );
};

export default Users;
