import { useState } from 'react';

export const useInventoryState = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Items');
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    
    const initialFormData = {
        itemName: '',
        description: '',
        section: 'Living Room',
        unit: 'Numbers',
        size: '',
        stock: 0,
        reorderLevel: 5,
        price: 0,
        image: null
    };

    const [formData, setFormData] = useState(initialFormData);
    const [availableSections, setAvailableSections] = useState(['Living Room', 'Bedroom', 'Kitchen', 'Dining', 'Bathroom', 'Office', 'Outdoors']);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    return {
        items, setItems,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        activeFilter, setActiveFilter,
        showItemModal, setShowItemModal,
        editingItem, setEditingItem,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        formData, setFormData,
        initialFormData,
        availableSections, setAvailableSections,
        isAddingSection, setIsAddingSection,
        newSectionName, setNewSectionName
    };
};
