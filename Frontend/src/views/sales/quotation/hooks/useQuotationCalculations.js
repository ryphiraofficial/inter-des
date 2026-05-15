import { useMemo } from 'react';

export const useQuotationCalculations = ({ lineItems, includeDiscount, discount, includeTax, taxRate, formData }) => {
    return useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        
        const discountAmount = includeDiscount ? (subtotal * (Number(discount) || 0)) / 100 : 0;
        const offerPrice = subtotal - discountAmount;
        
        const taxAmount = includeTax ? (offerPrice * (Number(taxRate) || 0)) / 100 : 0;
        const total = offerPrice + taxAmount;
        
        const depositAmount = (total * (Number(formData.depositPercent) || 0)) / 100;

        return {
            subtotal,
            discountAmount,
            offerPrice,
            taxAmount,
            total,
            depositAmount
        };
    }, [lineItems, includeDiscount, discount, includeTax, taxRate, formData.depositPercent]);
};
