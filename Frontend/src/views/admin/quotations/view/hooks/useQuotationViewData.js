import { useEffect } from 'react';
import { quotationAPI } from '../../../../../models/api';

export const useQuotationViewData = ({ id, setQuotation, setLoading, setError }) => {
    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                setLoading(true);
                const res = await quotationAPI.getById(id);
                if (res.success) {
                    setQuotation(res.data);
                } else {
                    setError('Quotation not found');
                }
            } catch (err) {
                console.error('Error fetching quotation:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchQuotation();
    }, [id, setQuotation, setLoading, setError]);
};
