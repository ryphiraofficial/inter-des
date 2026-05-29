import React from 'react';
import { useInventoryState } from './inventory/hooks/useInventoryState';
import { useInventoryData } from './inventory/hooks/useInventoryData';
import { useInventoryActions } from './inventory/hooks/useInventoryActions';

import InventoryFilters from './inventory/components/InventoryFilters';
import InventoryTable from './inventory/components/InventoryTable';
import ItemFormModal from './inventory/components/ItemFormModal';
import NewCategoryModal from './inventory/components/NewCategoryModal';
import InventorySkeleton from './InventorySkeleton';

import './css/Inventory.css';

const Inventory = () => {
    const state = useInventoryState();
    
    const { fetchItems } = useInventoryData({
        setItems: state.setItems,
        setLoading: state.setLoading,
        setError: state.setError,
        setSearchTerm: state.setSearchTerm,
        setShowItemModal: state.setShowItemModal,
        setFormData: state.setFormData
    });

    const actions = useInventoryActions({
        fetchItems,
        setSubmitting: state.setSubmitting,
        setShowItemModal: state.setShowItemModal,
        setEditingItem: state.setEditingItem,
        setFormData: state.setFormData,
        initialFormData: state.initialFormData,
        setAvailableSections: state.setAvailableSections,
        availableSections: state.availableSections,
        setIsAddingSection: state.setIsAddingSection,
        setNewSectionName: state.setNewSectionName
    });

    const handleEdit = (item) => {
        state.setEditingItem(item);
        state.setFormData({
            itemName: item.itemName || '',
            description: item.description || '',
            section: item.section || 'Living Room',
            unit: item.unit || 'Numbers',
            size: item.size || '',
            stock: item.stock || 0,
            reorderLevel: item.reorderLevel || 5,
            costPrice: item.costPrice || 0,
            price: item.price || 0,
            image: item.image || null
        });
        state.setShowItemModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        state.setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredItems = state.items.filter(item => {
        const matchesSearch = item.itemName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesFilter = state.activeFilter === 'All Items' || item.section === state.activeFilter;
        return matchesSearch && matchesFilter;
    });

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    return (
        <div className="inventory-container">
            <div className="inventory-wrapper">
                <InventoryFilters 
                    activeFilter={state.activeFilter} 
                    setActiveFilter={state.setActiveFilter} 
                    sections={state.availableSections} 
                />

                {state.loading ? (
                    <InventorySkeleton />
                ) : (
                    <InventoryTable 
                        items={filteredItems}
                        expandedRow={state.expandedRow}
                        toggleRow={toggleRow}
                        handleEdit={handleEdit}
                        handleDelete={actions.handleDelete}
                    />
                )}
            </div>

            <ItemFormModal 
                showItemModal={state.showItemModal}
                closeModal={actions.closeModal}
                editingItem={state.editingItem}
                formData={state.formData}
                setFormData={state.setFormData}
                handleInputChange={handleInputChange}
                availableSections={state.availableSections}
                setIsAddingSection={state.setIsAddingSection}
                handleImageUpload={actions.handleImageUpload}
                handleSubmit={actions.handleSubmit}
                submitting={state.submitting}
            />

            <NewCategoryModal 
                isAddingSection={state.isAddingSection}
                setIsAddingSection={state.setIsAddingSection}
                newSectionName={state.newSectionName}
                setNewSectionName={state.setNewSectionName}
                handleAddSection={actions.handleAddSection}
            />
        </div>
    );
};

export default Inventory;
