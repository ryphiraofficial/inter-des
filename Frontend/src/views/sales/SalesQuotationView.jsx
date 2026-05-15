import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Hooks
import { useQuotationViewState } from './quotations/view/hooks/useQuotationViewState';
import { useQuotationViewData } from './quotations/view/hooks/useQuotationViewData';
import { useQuotationViewActions } from './quotations/view/hooks/useQuotationViewActions';
import { useQuotationViewCalculations } from './quotations/view/hooks/useQuotationViewCalculations';

// Components
import { ActionHeader, DocHeader } from './quotations/view/components/HeaderComponents';
import { PartiesGrid, ItemsTable } from './quotations/view/components/ContentComponents';
import { DocSummary, DocFooter } from './quotations/view/components/FooterComponents';
import Skeleton from './components/Skeleton';

import './css/SalesQuotationView.css';

const SalesQuotationView = ({ isStaff }) => {
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
                        {...calc}
                        notes={q.notes}
                        termsAndConditions={q.termsAndConditions}
                        taxRate={q.taxRate}
                        discount={q.discount}
                        depositPercent={q.depositPercent}
                    />
                </div>

                <DocFooter />
            </div>
        </div>
    );
};

export default SalesQuotationView;
