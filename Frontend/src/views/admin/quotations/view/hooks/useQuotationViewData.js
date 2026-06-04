import { useEffect } from 'react';
import { useGetQuotationByIdQuery } from '../../../../../store/api/adminApi';

export const useQuotationViewData = ({ id, setQuotation, setLoading, setError }) => {
    const { data: res, isLoading, error } = useGetQuotationByIdQuery(id, { skip: !id });

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            console.error('Error fetching quotation:', error);
            setError(error.message || 'Error fetching quotation');
        } else if (res && !res.success) {
            setError('Quotation not found');
        }
    }, [error, res, setError]);

    useEffect(() => {
        if (res?.success) setQuotation(res.data);
    }, [res, setQuotation]);
};
