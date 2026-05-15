import React from 'react';
import { useQuotationList } from './quotations/list/hooks/useQuotationList';
import QuotationTable from './quotations/list/components/QuotationTable';
import './css/SalesQuotations.css';

const SalesQuotations = () => {
    const { quotations, loading } = useQuotationList();

    return (
        <div className="sq-quotations-container">
            <div className="sq-quotations-wrapper">
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
