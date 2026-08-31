import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useInventoryState } from './inventory/hooks/useInventoryState';
import { useInventoryData } from './inventory/hooks/useInventoryData';
import { useInventoryActions } from './inventory/hooks/useInventoryActions';

import InventoryFilters from './inventory/components/InventoryFilters';
import InventoryTable from './inventory/components/InventoryTable';
import ItemFormModal from './inventory/components/ItemFormModal';
import NewCategoryModal from './inventory/components/NewCategoryModal';
import InventorySkeleton from './InventorySkeleton';

// Edge Band, Laminate & PO Order List Components
import EdgeBandTable from './inventory/components/EdgeBandTable';
import EdgeBandFormModal from './inventory/components/EdgeBandFormModal';
import StockAdjustModal from './inventory/components/StockAdjustModal';
import BulkUploadModal from './inventory/components/BulkUploadModal';
import LaminateTable from './inventory/components/LaminateTable';
import LaminateFormModal from './inventory/components/LaminateFormModal';
import LaminateDetailModal from './inventory/components/LaminateDetailModal';
import POOrderList from './inventory/components/POOrderList';

import { Package, Layers, Sliders, Plus, Search, Upload, ShoppingBag, Filter, AlertTriangle } from 'lucide-react';
import './css/Inventory.css';

const API_BASE = '/api/inventory';

const Inventory = () => {
    const state = useInventoryState();
    const [activeTab, setActiveTab] = useState('general'); // 'general' | 'laminates' | 'edgeBands' | 'poList'

    // Edge Band State
    const [edgeBands, setEdgeBands] = useState([]);
    const [edgeBandsLoading, setEdgeBandsLoading] = useState(false);
    const [showEbModal, setShowEbModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [editingEb, setEditingEb] = useState(null);
    const [ebFormData, setEbFormData] = useState({
        code: '', batch: '', brandName: '', supplier: '', color: '', finish: '',
        widthMm: 22, thicknessMm: 0.8, rollLengthM: 50, stockQtyM: 0, reorderLevelM: 10, pricePerMeter: 0, location: ''
    });
    const [showStockModal, setShowStockModal] = useState(false);
    const [adjustingEb, setAdjustingEb] = useState(null);

    // Edge Band Filter State
    const [ebBrandFilter, setEbBrandFilter] = useState('All');
    const [ebLowStockOnly, setEbLowStockOnly] = useState(false);

    // Laminates State
    const [laminates, setLaminates] = useState([]);
    const [laminatesLoading, setLaminatesLoading] = useState(false);
    const [showLamModal, setShowLamModal] = useState(false);
    const [editingLam, setEditingLam] = useState(null);
    const [lamFormData, setLamFormData] = useState({
        code: '', name: '', brandName: '', supplier: '', color: '', finish: '',
        thicknessMm: 1.0, sheetSize: '8x4 ft', stockQty: 0, reorderLevel: 5, price: 0, location: ''
    });
    const [showLamDetailModal, setShowLamDetailModal] = useState(false);
    const [detailLaminate, setDetailLaminate] = useState(null);

    // Shared Brands State
    const [brands, setBrands] = useState([]);

    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // General Inventory Data Hook
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

    // Fetch Brands
    const fetchBrands = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/brands`, authHeaders);
            if (res.data.success) setBrands(res.data.data);
        } catch (err) {
            console.error('Error fetching brands:', err);
        }
    }, []);

    // Fetch Edge Bands
    const fetchEdgeBands = useCallback(async () => {
        setEdgeBandsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/edge-bands?limit=1000`, authHeaders);
            if (res.data.success) setEdgeBands(res.data.data);
        } catch (err) {
            console.error('Error fetching edge bands:', err);
        } finally {
            setEdgeBandsLoading(false);
        }
    }, []);

    // Fetch Laminates
    const fetchLaminates = useCallback(async () => {
        setLaminatesLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/laminates?limit=1000`, authHeaders);
            if (res.data.success) setLaminates(res.data.data);
        } catch (err) {
            console.error('Error fetching laminates:', err);
        } finally {
            setLaminatesLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
        fetchEdgeBands();
        fetchLaminates();
    }, [fetchBrands, fetchEdgeBands, fetchLaminates]);

    // General Inventory Edit/Input
    const handleEditGeneral = (item) => {
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

    const handleInputChangeGeneral = (e) => {
        const { name, value } = e.target;
        state.setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Filter General Items
    const filteredGeneralItems = state.items.filter(item => {
        const matchesSearch = item.itemName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesFilter = state.activeFilter === 'All Items' || item.section === state.activeFilter;
        return matchesSearch && matchesFilter;
    });

    // Filter Edge Bands
    const filteredEdgeBands = edgeBands.filter(eb => {
        const query = state.searchTerm.toLowerCase();
        const matchesSearch = (
            (eb.code && eb.code.toLowerCase().includes(query)) ||
            (eb.batch && eb.batch.toLowerCase().includes(query)) ||
            (eb.brandName && eb.brandName.toLowerCase().includes(query)) ||
            (eb.color && eb.color.toLowerCase().includes(query)) ||
            (eb.supplier && eb.supplier.toLowerCase().includes(query))
        );

        const ebBrand = eb.brandName || eb.brandId?.name || 'Generic';
        const matchesBrand = ebBrandFilter === 'All' || ebBrand.toLowerCase() === ebBrandFilter.toLowerCase();
        const matchesLowStock = !ebLowStockOnly || eb.stockQtyM <= eb.reorderLevelM;

        return matchesSearch && matchesBrand && matchesLowStock;
    });

    // Filter Laminates
    const filteredLaminates = laminates.filter(lam => {
        const query = state.searchTerm.toLowerCase();
        return (
            (lam.code && lam.code.toLowerCase().includes(query)) ||
            (lam.name && lam.name.toLowerCase().includes(query)) ||
            (lam.brandName && lam.brandName.toLowerCase().includes(query)) ||
            (lam.color && lam.color.toLowerCase().includes(query))
        );
    });

    // Edge Band Modal Handlers
    const handleOpenAddEb = () => {
        setEditingEb(null);
        setEbFormData({
            code: '', batch: '', brandName: '', supplier: '', color: '', finish: '',
            widthMm: 22, thicknessMm: 0.8, rollLengthM: 50, stockQtyM: 0, reorderLevelM: 10, pricePerMeter: 0, location: ''
        });
        setShowEbModal(true);
    };

    const handleEditEb = (eb) => {
        setEditingEb(eb);
        setEbFormData({
            code: eb.code || '',
            batch: eb.batch || '',
            brandName: eb.brandName || eb.brandId?.name || '',
            supplier: eb.supplier || '',
            color: eb.color || '',
            finish: eb.finish || '',
            widthMm: eb.widthMm ?? 22,
            thicknessMm: eb.thicknessMm ?? 0.8,
            rollLengthM: eb.rollLengthM ?? 50,
            stockQtyM: eb.stockQtyM ?? 0,
            reorderLevelM: eb.reorderLevelM ?? 10,
            pricePerMeter: eb.pricePerMeter ?? 0,
            location: eb.location || ''
        });
        setShowEbModal(true);
    };

    const handleEbFormChange = (e) => {
        const { name, value } = e.target;
        setEbFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEbSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEb) {
                await axios.put(`${API_BASE}/edge-bands/${editingEb._id}`, ebFormData, authHeaders);
            } else {
                await axios.post(`${API_BASE}/edge-bands`, ebFormData, authHeaders);
            }
            setShowEbModal(false);
            fetchEdgeBands();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving Edge Band');
        }
    };

    const handleDeleteEb = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Edge Band?')) return;
        try {
            await axios.delete(`${API_BASE}/edge-bands/${id}`, authHeaders);
            fetchEdgeBands();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting Edge Band');
        }
    };

    const handleStockAdjustEb = (eb) => {
        setAdjustingEb(eb);
        setShowStockModal(true);
    };

    const handleConfirmStockAdjust = async (id, adjustmentMeters, reason) => {
        await axios.patch(`${API_BASE}/edge-bands/${id}/stock`, { adjustmentMeters, reason }, authHeaders);
        fetchEdgeBands();
    };

    // Laminates Modal Handlers
    const handleOpenAddLam = () => {
        setEditingLam(null);
        setLamFormData({
            code: '', name: '', brandName: '', supplier: '', color: '', finish: '',
            thicknessMm: 1.0, sheetSize: '8x4 ft', stockQty: 0, reorderLevel: 5, price: 0, location: ''
        });
        setShowLamModal(true);
    };

    const handleEditLam = (lam) => {
        setEditingLam(lam);
        setLamFormData({
            code: lam.code || '',
            name: lam.name || '',
            brandName: lam.brandName || lam.brandId?.name || '',
            supplier: lam.supplier || '',
            color: lam.color || '',
            finish: lam.finish || '',
            thicknessMm: lam.thicknessMm ?? 1.0,
            sheetSize: lam.sheetSize || '8x4 ft',
            stockQty: lam.stockQty ?? 0,
            reorderLevel: lam.reorderLevel ?? 5,
            price: lam.price ?? 0,
            location: lam.location || ''
        });
        setShowLamModal(true);
    };

    const handleLamFormChange = (e) => {
        const { name, value } = e.target;
        setLamFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLamSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLam) {
                await axios.put(`${API_BASE}/laminates/${editingLam._id}`, lamFormData, authHeaders);
            } else {
                await axios.post(`${API_BASE}/laminates`, lamFormData, authHeaders);
            }
            setShowLamModal(false);
            fetchLaminates();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving Laminate');
        }
    };

    const handleDeleteLam = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Laminate? Linked matches will also be deleted.')) return;
        try {
            await axios.delete(`${API_BASE}/laminates/${id}`, authHeaders);
            fetchLaminates();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting Laminate');
        }
    };

    const handleViewLamDetail = (lam) => {
        setDetailLaminate(lam);
        setShowLamDetailModal(true);
    };

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    // Extract unique brands for filtering Edge Bands
    const ebBrandList = Array.from(new Set(['All', ...edgeBands.map(eb => eb.brandName || eb.brandId?.name || 'Generic')]));

    return (
        <div className="inventory-container">
            <div className="inventory-wrapper">

                {/* Top Module Sub-Navigation Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
                        <button
                            onClick={() => setActiveTab('general')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '9px',
                                border: 'none',
                                background: activeTab === 'general' ? '#ffffff' : 'transparent',
                                color: activeTab === 'general' ? '#0f172a' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'general' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Package size={15} /> General Inventory
                        </button>

                        <button
                            onClick={() => setActiveTab('laminates')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '9px',
                                border: 'none',
                                background: activeTab === 'laminates' ? '#ffffff' : 'transparent',
                                color: activeTab === 'laminates' ? '#0f172a' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'laminates' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Layers size={15} /> Laminates Catalog ({laminates.length})
                        </button>

                        <button
                            onClick={() => setActiveTab('edgeBands')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '9px',
                                border: 'none',
                                background: activeTab === 'edgeBands' ? '#ffffff' : 'transparent',
                                color: activeTab === 'edgeBands' ? '#0f172a' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'edgeBands' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Sliders size={15} /> Edge Bands Stock ({edgeBands.length})
                        </button>

                        <button
                            onClick={() => setActiveTab('poList')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '9px',
                                border: 'none',
                                background: activeTab === 'poList' ? '#ffffff' : 'transparent',
                                color: activeTab === 'poList' ? '#0f172a' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'poList' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <ShoppingBag size={15} /> PO / Order List
                        </button>
                    </div>

                    {/* Action Buttons depending on Active Tab */}
                    <div>
                        {activeTab === 'general' && (
                            <button className="btn-new-item" onClick={() => { state.setEditingItem(null); state.setFormData(state.initialFormData); state.setShowItemModal(true); }}>
                                <Plus size={18} /> Add General Item
                            </button>
                        )}
                        {activeTab === 'laminates' && (
                            <button className="btn-new-item" style={{ background: '#4f46e5' }} onClick={handleOpenAddLam}>
                                <Plus size={18} /> Add Laminate
                            </button>
                        )}
                        {activeTab === 'edgeBands' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => setShowBulkModal(true)}
                                    style={{
                                        padding: '0.7rem 1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid #bae6fd',
                                        background: '#f0f9ff',
                                        color: '#0284c7',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <Upload size={16} /> Bulk Upload (CSV)
                                </button>
                                <button className="btn-new-item" style={{ background: '#0284c7' }} onClick={handleOpenAddEb}>
                                    <Plus size={18} /> Add Edge Band
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search & Filtering Row for Edge Bands / Laminates / General */}
                {activeTab !== 'poList' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder={
                                    activeTab === 'general' ? 'Search general inventory...' :
                                    activeTab === 'laminates' ? 'Search laminates by code, name, brand, color...' :
                                    'Search edge bands by code, batch, brand, color...'
                                }
                                value={state.searchTerm}
                                onChange={(e) => state.setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.9rem',
                                    background: '#ffffff'
                                }}
                            />
                        </div>

                        {/* Edge Band Filters */}
                        {activeTab === 'edgeBands' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Filter size={15} style={{ color: '#64748b' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Brand:</span>
                                    <select
                                        value={ebBrandFilter}
                                        onChange={e => setEbBrandFilter(e.target.value)}
                                        style={{ padding: '0.45rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                                    >
                                        {ebBrandList.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        id="lowStockCheck"
                                        checked={ebLowStockOnly}
                                        onChange={e => setEbLowStockOnly(e.target.checked)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label htmlFor="lowStockCheck" style={{ fontSize: '0.85rem', fontWeight: 600, color: ebLowStockOnly ? '#d97706' : '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertTriangle size={14} style={{ color: '#d97706' }} /> Low Stock Only
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content 1: General Inventory */}
                {activeTab === 'general' && (
                    <>
                        <InventoryFilters
                            activeFilter={state.activeFilter}
                            setActiveFilter={state.setActiveFilter}
                            sections={state.availableSections}
                        />

                        {state.loading ? (
                            <InventorySkeleton />
                        ) : (
                            <InventoryTable
                                items={filteredGeneralItems}
                                expandedRow={state.expandedRow}
                                toggleRow={toggleRow}
                                handleEdit={handleEditGeneral}
                                handleDelete={actions.handleDelete}
                            />
                        )}
                    </>
                )}

                {/* Tab Content 2: Laminates */}
                {activeTab === 'laminates' && (
                    <>
                        {laminatesLoading ? (
                            <InventorySkeleton />
                        ) : (
                            <LaminateTable
                                items={filteredLaminates}
                                handleEdit={handleEditLam}
                                handleDelete={handleDeleteLam}
                                onViewDetail={handleViewLamDetail}
                            />
                        )}
                    </>
                )}

                {/* Tab Content 3: Edge Bands */}
                {activeTab === 'edgeBands' && (
                    <>
                        {edgeBandsLoading ? (
                            <InventorySkeleton />
                        ) : (
                            <EdgeBandTable
                                items={filteredEdgeBands}
                                handleEdit={handleEditEb}
                                handleDelete={handleDeleteEb}
                                handleStockAdjust={handleStockAdjustEb}
                            />
                        )}
                    </>
                )}

                {/* Tab Content 4: PO / Order List */}
                {activeTab === 'poList' && (
                    <POOrderList />
                )}

            </div>

            {/* General Inventory Modals */}
            <ItemFormModal
                showItemModal={state.showItemModal}
                closeModal={actions.closeModal}
                editingItem={state.editingItem}
                formData={state.formData}
                setFormData={state.setFormData}
                handleInputChange={handleInputChangeGeneral}
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

            {/* Edge Band Modals */}
            <EdgeBandFormModal
                showModal={showEbModal}
                closeModal={() => setShowEbModal(false)}
                editingItem={editingEb}
                formData={ebFormData}
                handleInputChange={handleEbFormChange}
                handleSubmit={handleEbSubmit}
                brands={brands}
                onSuccess={fetchEdgeBands}
            />

            <StockAdjustModal
                showModal={showStockModal}
                closeModal={() => setShowStockModal(false)}
                item={adjustingEb}
                onAdjustStock={handleConfirmStockAdjust}
            />

            <BulkUploadModal
                showModal={showBulkModal}
                closeModal={() => setShowBulkModal(false)}
                onSuccess={fetchEdgeBands}
            />

            {/* Laminate Modals */}
            <LaminateFormModal
                showModal={showLamModal}
                closeModal={() => setShowLamModal(false)}
                editingItem={editingLam}
                formData={lamFormData}
                handleInputChange={handleLamFormChange}
                handleSubmit={handleLamSubmit}
                brands={brands}
            />

            <LaminateDetailModal
                showModal={showLamDetailModal}
                closeModal={() => setShowLamDetailModal(false)}
                laminate={detailLaminate}
                edgeBands={edgeBands}
            />

        </div>
    );
};

export default Inventory;
