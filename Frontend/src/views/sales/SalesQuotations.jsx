import React from 'react';
import { useQuotationList } from './quotations/list/hooks/useQuotationList';
import QuotationTabs from '../admin/quotations/list/components/QuotationTabs';
import QuotationTable from './quotations/list/components/QuotationTable';
import '../admin/css/Quotations.css';
import './css/SalesQuotations.css';

const SalesQuotations = () => {
    const { quotations, allQuotations, loading, activeTab, setActiveTab } = useQuotationList();

    return (
        <div className="sq-quotations-container">
            <div className="sq-quotations-wrapper">
                <QuotationTabs 
                    quotations={allQuotations}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                
                <div className="sq-list-card">
                    <QuotationTable 
                        loading={loading} 
                        quotations={quotations} 
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesQuotations;
