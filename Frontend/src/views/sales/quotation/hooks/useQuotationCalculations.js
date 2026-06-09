import { useMemo } from 'react';

export const useQuotationCalculations = ({ lineItems, categoryDiscounts = [], includeDiscount, discount, includeTax, taxRate, formData }) => {
    return useMemo(() => {
        const categorySubtotals = {};
        lineItems.forEach(item => {
            const section = item.section || 'Uncategorized';
            categorySubtotals[section] = (categorySubtotals[section] || 0) + (Number(item.amount) || 0);
        });

        const cdMap = {};
        if (Array.isArray(categoryDiscounts)) {
            categoryDiscounts.forEach(cd => {
                if (cd.category) {
                    cdMap[cd.category] = cd;
                }
            });
        }

        let subtotal = 0;
        Object.entries(categorySubtotals).forEach(([section, subtotalVal]) => {
            const cd = cdMap[section];
            let catDiscountAmount = 0;
            if (cd && Number(cd.discountValue) > 0) {
                if (cd.discountType === 'amount') {
                    catDiscountAmount = Number(cd.discountValue) || 0;
                } else {
                    catDiscountAmount = (subtotalVal * (Number(cd.discountValue) || 0)) / 100;
                }
            }
            subtotal += Math.max(0, subtotalVal - catDiscountAmount);
        });
        
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
            depositAmount,
            categorySubtotals
        };
    }, [lineItems, categoryDiscounts, includeDiscount, discount, includeTax, taxRate, formData.depositPercent]);
};
