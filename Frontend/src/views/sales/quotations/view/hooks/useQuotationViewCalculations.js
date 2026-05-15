import { useMemo } from 'react';

export const useQuotationViewCalculations = (quotation) => {
    return useMemo(() => {
        if (!quotation) return { subtotal: 0, discountAmount: 0, offerPrice: 0, taxAmount: 0, grandTotal: 0, depositAmount: 0 };

        const { items = [], taxRate = 18, discount = 0, depositPercent = 30 } = quotation;
        const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const discountAmount = (subtotal * (Number(discount) || 0)) / 100;
        const offerPrice = subtotal - discountAmount;
        const taxAmount = (offerPrice * (Number(taxRate) || 18)) / 100;
        const grandTotal = offerPrice + taxAmount;
        const depositAmount = (grandTotal * (Number(depositPercent) || 30)) / 100;

        return {
            subtotal,
            discountAmount,
            offerPrice,
            taxAmount,
            grandTotal,
            depositAmount
        };
    }, [quotation]);
};
