import React from 'react';
import { Search, Package } from 'lucide-react';
import { usePOInventoryState } from './po-inventory/hooks/usePOInventoryState';
import { usePOInventoryData } from './po-inventory/hooks/usePOInventoryData';
import { usePOInventoryActions } from './po-inventory/hooks/usePOInventoryActions';

import POInventoryCard from './po-inventory/components/POInventoryCard';
import POAddModal from './po-inventory/components/POAddModal';
import POHistoryModal from './po-inventory/components/POHistoryModal';
import Skeleton from './components/Skeleton';

import './css/POInventory.css';

const POInventory = () => {
    const state = usePOInventoryState();
    
    const { fetchInventory } = usePOInventoryData({
        setInventory: state.setInventory,
        setLoading: state.setLoading,
        setError: state.setError,
        setShowAddModal: state.setShowAddModal
    });

    const actions = usePOInventoryActions({
        fetchInventory,
        setSubmitting: state.setSubmitting,
        setShowAddModal: state.setShowAddModal,
        setFormData: state.setFormData
    });

    const filteredInventory = state.inventory.filter(item =>
        item.itemName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    const handleViewHistory = (item) => {
        state.setSelectedItem(item);
        state.setShowHistoryModal(true);
    };

    return (
        <div className="po-inv-container">
            <div className="po-inv-wrapper">
                <div className="invoice-filter-bar">
                    <div className="search-field">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={state.searchTerm}
                            onChange={(e) => state.setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {state.error && <div className="error-banner">{state.error}</div>}

                {state.loading ? (
                    <div className="po-inv-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="po-inv-card skeleton">
                                <div className="card-top">
                                    <Skeleton width="40px" height="40px" borderRadius="12px" />
                                    <Skeleton width="80px" height="24px" borderRadius="6px" />
                                </div>
                                <div className="item-title" style={{ marginTop: '1rem' }}>
                                    <Skeleton width="60px" height="14px" /><div style={{ height: '8px' }} />
                                    <Skeleton width="80%" height="24px" />
                                </div>
                                <div className="stock-meter-box" style={{ marginTop: '1rem' }}>
                                    <Skeleton width="100%" height="8px" borderRadius="10px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredInventory.length === 0 ? (
                    <div className="empty-state-card" style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '16px' }}>
                        <Package size={64} style={{ color: '#cbd5e1', marginBottom: '1.5rem' }} />
                        <h3>Inventory is empty</h3>
                        <p>Start adding materials to track your stock.</p>
                    </div>
                ) : (
                    <div className="po-inv-grid">
                        {filteredInventory.map((item) => (
                            <POInventoryCard 
                                key={item._id}
                                item={item}
                                onViewHistory={handleViewHistory}
                            />
                        ))}
                    </div>
                )}
            </div>

            <POAddModal 
                showAddModal={state.showAddModal}
                setShowAddModal={state.setShowAddModal}
                formData={state.formData}
                setFormData={state.setFormData}
                handleCreateItem={actions.handleCreateItem}
                submitting={state.submitting}
            />

            <POHistoryModal 
                showHistoryModal={state.showHistoryModal}
                setShowHistoryModal={state.setShowHistoryModal}
                selectedItem={state.selectedItem}
            />
        </div>
    );
};

export default POInventory;
