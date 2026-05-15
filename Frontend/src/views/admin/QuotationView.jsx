import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuotationViewState } from './quotations/view/hooks/useQuotationViewState';
import { useQuotationViewData } from './quotations/view/hooks/useQuotationViewData';
import { useQuotationViewActions } from './quotations/view/hooks/useQuotationViewActions';
import { useQuotationViewCalculations } from './quotations/view/hooks/useQuotationViewCalculations';

import ActionHeader from './quotations/view/components/ActionHeader';
import DocHeader from './quotations/view/components/DocHeader';
import PartiesGrid from './quotations/view/components/PartiesGrid';
import ItemsTable from './quotations/view/components/ItemsTable';
import DocSummary from './quotations/view/components/DocSummary';
import DocFooter from './quotations/view/components/DocFooter';

import './css/QuotationView.css';

const Skeleton = ({ width, height, borderRadius }) => (
    <div className="skeleton" style={{ width, height, borderRadius }} />
);

const QuotationView = ({ isStaff }) => {
    const { id } = useParams();
    const state = useQuotationViewState();
    
    useQuotationViewData({
        id,
        setQuotation: state.setQuotation,
        setLoading: state.setLoading,
        setError: state.setError
    });

    const actions = useQuotationViewActions({ isStaff, id });
    const calc = useQuotationViewCalculations(state.quotation);

    if (state.loading) {
        return (
            <div className="qv-wrapper skeleton-mode">
                <div className="qv-actions-bar">
                    <Skeleton width="80px" height="36px" borderRadius="12px" />
                    <div className="qv-right-actions">
                        <Skeleton width="80px" height="36px" borderRadius="12px" /><Skeleton width="100px" height="36px" borderRadius="12px" /><Skeleton width="120px" height="36px" borderRadius="12px" />
                    </div>
                </div>
                <div className="quotation-document">
                    <header className="doc-header">
                        <div className="company-logo-section"><Skeleton width="200px" height="30px" /><div style={{ height: '12px' }} /><Skeleton width="250px" height="14px" /></div>
                        <div className="doc-title-section"><Skeleton width="180px" height="40px" /><div style={{ height: '1.5rem' }} /><div className="doc-meta"><Skeleton width="120px" height="40px" /><Skeleton width="120px" height="40px" /></div></div>
                    </header>
                </div>
            </div>
        );
    }

    if (state.error || !state.quotation) {
        return (
            <div className="qv-error-container">
                <div className="error-card">
                    <h2>Error</h2>
                    <p>{state.error || 'Something went wrong'}</p>
                    <button onClick={actions.handleBack}><ArrowLeft size={18} /> Back to List</button>
                </div>
            </div>
        );
    }

    const q = state.quotation;

    return (
        <div className="qv-wrapper">
            <ActionHeader 
                handleBack={actions.handleBack}
                handleEdit={actions.handleEdit}
                handlePrint={actions.handlePrint}
                handleDownload={actions.handleDownload}
            />

            <div className="quotation-document">
                <DocHeader 
                    quotationNumber={q.quotationNumber}
                    createdAt={q.createdAt}
                    status={q.status}
                />

                <div className="doc-content">
                    <PartiesGrid 
                        client={q.client}
                        projectName={q.projectName}
                        projectDescription={q.projectDescription}
                        validUntil={q.validUntil}
                    />

                    <ItemsTable items={q.items || []} />

                    <DocSummary 
                        subtotal={calc.subtotal}
                        discount={q.discount}
                        discountAmount={calc.discountAmount}
                        offerPrice={calc.offerPrice}
                        taxRate={q.taxRate}
                        taxAmount={calc.taxAmount}
                        grandTotal={calc.grandTotal}
                        depositPercent={q.depositPercent}
                        notes={q.notes}
                        termsAndConditions={q.termsAndConditions}
                    />
                </div>

                <DocFooter />
            </div>
        </div>
    );
};

export default QuotationView;
