import { useState } from 'react';

export const useQuotationListState = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    return {
        quotations, setQuotations,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        activeTab, setActiveTab,
        submitting, setSubmitting,
        expandedRow, setExpandedRow
    };
};
