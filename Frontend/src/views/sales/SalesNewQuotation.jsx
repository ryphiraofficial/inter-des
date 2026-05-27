import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send, X } from 'lucide-react';

// Hooks
import { useQuotationState } from './quotation/hooks/useQuotationState';
import { useQuotationData } from './quotation/hooks/useQuotationData';
import { useQuotationSearch } from './quotation/hooks/useQuotationSearch';
import { useQuotationCalculations } from './quotation/hooks/useQuotationCalculations';
import { useQuotationActions } from './quotation/hooks/useQuotationActions';

// Components
import ProjectDetailsSection from './quotation/components/ProjectDetailsSection';
import PaymentPoliciesSection from './quotation/components/PaymentPoliciesSection';
import LineItemsSection from './quotation/components/LineItemsSection';
import QuotationSummary from './quotation/components/QuotationSummary';
import NewQuotationSkeleton from './quotation/components/NewQuotationSkeleton';
import { BillPreviewModal, QuickAddClientModal, ExitConfirmationDialog } from './quotation/components/QuotationModals';

import './css/SalesNewQuotation.css';

const SalesNewQuotation = ({ isEdit, isStaff }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Global UI states
    const [fetching, setFetching] = useState(isEdit && !!id);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showBillPreview, setShowBillPreview] = useState(false);
    const [showQuickAddModal, setShowQuickAddModal] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('Under Review');
    const [quickAddData, setQuickAddData] = useState({ name: '', email: '', phone: '' });

    // Data states
    const [clients, setClients] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);

    // Logic Hooks
    const state = useQuotationState();
    
    useQuotationData({ 
        isEdit, id, setFormData: state.setFormData, setLineItems: state.setLineItems, 
        setTaxRate: state.setTaxRate, setDiscount: state.setDiscount, 
        setIncludeDiscount: state.setIncludeDiscount, setFetching, setError, 
        setClients, setInventoryItems, clients 
    });

    const search = useQuotationSearch({ 
        clients, inventoryItems, setFormData: state.setFormData, 
        setLineItems: state.setLineItems, lineItems: state.lineItems 
    });

    const calc = useQuotationCalculations({ 
        lineItems: state.lineItems, includeDiscount: state.includeDiscount, 
        discount: state.discount, includeTax: state.includeTax, 
        taxRate: state.taxRate, formData: state.formData 
    });

    const actions = useQuotationActions({
        formData: state.formData, lineItems: state.lineItems, taxRate: state.taxRate,
        discount: state.discount, includeDiscount: state.includeDiscount,
        offerPrice: calc.offerPrice, isEdit, id, isStaff, navigate, setError,
        setIsSaving, setShowBillPreview, setPendingStatus, setClients,
        setShowQuickAddModal, setShowExitDialog, setFieldErrors
    });

    // Clear field-level error when user enters value
    useEffect(() => {
        if (state.formData.client) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next.client;
                return next;
            });
        }
    }, [state.formData.client]);

    useEffect(() => {
        if (state.formData.projectName) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next.projectName;
                return next;
            });
        }
    }, [state.formData.projectName]);

    useEffect(() => {
        if (state.lineItems.length > 0) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next.lineItems;
                return next;
            });
        }
    }, [state.lineItems.length]);

    // Handle clicks outside for search suggestions
    useEffect(() => {
        const handleClickOutside = () => search.setShowClientSuggestions(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [search]);

    if (fetching) return <NewQuotationSkeleton />;

    return (
        <div className="new-quote-wrapper" style={{ position: 'relative', overflow: showBillPreview ? 'hidden' : 'auto' }}>
            <div className="form-container" style={{
                filter: showBillPreview ? 'blur(10px) brightness(0.9)' : 'none',
                pointerEvents: showBillPreview ? 'none' : 'auto',
                transition: 'all 0.4s'
            }}>
                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={(e) => actions.handlePreview(e)} noValidate>
                    <ProjectDetailsSection 
                        formData={state.formData} 
                        handleInputChange={state.handleInputChange}
                        clientSearchQuery={search.clientSearchQuery}
                        handleClientSearch={search.handleClientSearch}
                        showClientSuggestions={search.showClientSuggestions}
                        filteredClients={search.filteredClients}
                        selectClient={search.selectClient}
                        handleQuickAddClient={() => setShowQuickAddModal(true)}
                        setFormData={state.setFormData}
                        fieldErrors={fieldErrors}
                    />

                    <PaymentPoliciesSection 
                        formData={state.formData} 
                        handleInputChange={state.handleInputChange}
                        depositAmount={calc.depositAmount}
                    />

                    <LineItemsSection 
                        lineItems={state.lineItems}
                        addLineItem={state.addLineItem}
                        removeLineItem={state.removeLineItem}
                        updateLineItem={state.updateLineItem}
                        expandedItems={state.expandedItems}
                        setExpandedItems={state.setExpandedItems}
                        globalSearchQuery={search.globalSearchQuery}
                        setGlobalSearchQuery={search.setGlobalSearchQuery}
                        globalSearchResults={search.globalSearchResults}
                        handleGlobalSearch={search.handleGlobalSearch}
                        addFromInventorySelect={search.addFromInventorySelect}
                        activeSearchId={search.activeSearchId}
                        searchResults={search.searchResults}
                        handleProductSearch={search.handleProductSearch}
                        selectProduct={(itemId, item) => search.selectProduct(itemId, item, state.setLineItems)}
                        handleImageUpload={(itemId, file) => actions.handleImageUpload(itemId, file, state.updateLineItem)}
                        fieldErrors={fieldErrors}
                    />

                    <QuotationSummary 
                        {...calc}
                        includeDiscount={state.includeDiscount}
                        setIncludeDiscount={state.setIncludeDiscount}
                        discount={state.discount}
                        setDiscount={state.setDiscount}
                        includeTax={state.includeTax}
                        setIncludeTax={state.setIncludeTax}
                        taxRate={state.taxRate}
                        setTaxRate={state.setTaxRate}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                        <div className="form-section">
                            <label className="section-label">Notes</label>
                            <textarea name="notes" className="textarea-styled" value={state.formData.notes} onChange={state.handleInputChange} rows="2"></textarea>
                        </div>
                        <div className="form-section">
                            <label className="section-label">Terms & Conditions</label>
                            <textarea name="termsConditions" className="textarea-styled" value={state.formData.termsConditions} onChange={state.handleInputChange} rows="2"></textarea>
                        </div>
                    </div>

                    <div className="form-footer-actions">
                        <button type="button" className="btn-exit" onClick={() => setShowExitDialog(true)}>
                            <X size={18} /> Exit
                        </button>
                        <button type="button" className="btn-save-draft" onClick={(e) => actions.handlePreview(e, 'Draft')}>
                            <Save size={18} /> Review Draft
                        </button>
                        <button type="submit" className="btn-send-quote">
                            <Send size={18} /> Review & Save
                        </button>
                    </div>
                </form>
            </div>

            <BillPreviewModal 
                show={showBillPreview} setShow={setShowBillPreview}
                formData={state.formData} clients={clients} lineItems={state.lineItems}
                {...calc} includeDiscount={state.includeDiscount} discount={state.discount}
                includeTax={state.includeTax} taxRate={state.taxRate}
                handleFinalSave={() => actions.handleFinalSave(pendingStatus)}
                isSaving={isSaving}
            />

            <QuickAddClientModal 
                show={showQuickAddModal} setShow={setShowQuickAddModal}
                quickAddData={quickAddData} setQuickAddData={setQuickAddData}
                confirmQuickAddClient={(e) => actions.confirmQuickAddClient(e, quickAddData, search.selectClient)}
                isSubmitting={isSubmitting}
            />

            <ExitConfirmationDialog 
                show={showExitDialog} setShow={setShowExitDialog}
                handleSaveDraft={actions.handleSaveDraft} isSaving={isSaving}
                onDiscard={() => navigate(isStaff ? '/staff/quotations' : '/quotations')}
            />
        </div>
    );
};

export default SalesNewQuotation;
