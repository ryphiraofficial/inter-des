import { useState } from 'react';

export const useUserState = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'Admin',
        password: '',
        department: 'Admin'
    });

    return {
        users, setUsers,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        showModal, setShowModal,
        editingUser, setEditingUser,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        formData, setFormData
    };
};
