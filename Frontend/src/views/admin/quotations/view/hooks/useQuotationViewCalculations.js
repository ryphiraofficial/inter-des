import { useMemo } from 'react';

export const useQuotationViewCalculations = (quotation) => {
    return useMemo(() => {
        if (!quotation) return { subtotal: 0, discountAmount: 0, offerPrice: 0, taxAmount: 0, grandTotal: 0 };

        const q = quotation;
        const subtotal = (q.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
        const discountAmount = (subtotal * (q.discount || 0)) / 100;
        const offerPrice = subtotal - discountAmount;
        const taxAmount = (offerPrice * (q.taxRate || 18)) / 100;
        const grandTotal = offerPrice + taxAmount;

        return {
            subtotal,
            discountAmount,
            offerPrice,
            taxAmount,
            grandTotal
        };
    }, [quotation]);
};
