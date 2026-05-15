import { useState } from 'react';

export const usePOInventoryState = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        itemName: '',
        sku: '',
        supplier: '',
        currentStock: 0,
        unit: 'Sheets',
        reorderPoint: 10
    });

    return {
        inventory, setInventory,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        showAddModal, setShowAddModal,
        showHistoryModal, setShowHistoryModal,
        selectedItem, setSelectedItem,
        submitting, setSubmitting,
        formData, setFormData
    };
};
