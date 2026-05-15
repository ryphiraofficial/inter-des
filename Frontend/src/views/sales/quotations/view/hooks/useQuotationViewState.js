import { useState } from 'react';

export const useQuotationViewState = () => {
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return {
        quotation, setQuotation,
        loading, setLoading,
        error, setError
    };
};
