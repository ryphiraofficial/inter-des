import { useEffect } from 'react';
import { useGetSalesQuotationByIdQuery } from '../../../../../store/api/salesApi';

export const useQuotationViewData = ({ id, setQuotation, setLoading, setError }) => {
    const { data: quoteRes, isLoading, error } = useGetSalesQuotationByIdQuery(id, { skip: !id });

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.data?.message || error.message || 'Quotation not found');
        } else if (quoteRes && !quoteRes.success) {
            setError('Quotation not found');
        }
    }, [error, quoteRes, setError]);

    useEffect(() => {
        if (quoteRes?.success) {
            setQuotation(quoteRes.data);
        }
    }, [quoteRes, setQuotation]);
};
