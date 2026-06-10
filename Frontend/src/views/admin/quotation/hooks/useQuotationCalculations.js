import { useMemo } from 'react';

export const useQuotationCalculations = ({ lineItems, categoryDiscounts = [], includeDiscount, discount, includeTax, taxRate, formData }) => {
    
    const categorySubtotals = useMemo(() => {
        const subs = {};
        lineItems.forEach(item => {
            const section = item.section || 'Uncategorized';
            subs[section] = (subs[section] || 0) + (Number(item.amount) || 0);
        });
        return subs;
    }, [lineItems]);

    const subtotal = useMemo(() => {
        const cdMap = {};
        if (Array.isArray(categoryDiscounts)) {
            categoryDiscounts.forEach(cd => {
                if (cd.category) {
                    cdMap[cd.category] = cd;
                }
            });
        }
        
        let totalSub = 0;
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
            totalSub += Math.max(0, subtotalVal - catDiscountAmount);
        });
        return totalSub;
    }, [categorySubtotals, categoryDiscounts]);

    const discountAmount = useMemo(() => 
        includeDiscount ? (subtotal * discount) / 100 : 0
    , [subtotal, includeDiscount, discount]);

    const offerPrice = useMemo(() => 
        subtotal - discountAmount
    , [subtotal, discountAmount]);

    const taxAmount = useMemo(() => 
        includeTax ? (offerPrice * taxRate) / 100 : 0
    , [offerPrice, includeTax, taxRate]);

    const total = useMemo(() => 
        offerPrice + taxAmount
    , [offerPrice, taxAmount]);

    const depositAmount = useMemo(() => 
        (total * formData.depositPercent) / 100
    , [total, formData.depositPercent]);

    const totalCost = useMemo(() => 
        lineItems.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.costPrice) || 0)), 0)
    , [lineItems]);

    const totalProfit = useMemo(() => 
        offerPrice - totalCost
    , [offerPrice, totalCost]);

    const profitMargin = useMemo(() => 
        offerPrice > 0 ? (totalProfit / offerPrice) * 100 : 0
    , [totalProfit, offerPrice]);

    return {
        subtotal,
        discountAmount,
        offerPrice,
        taxAmount,
        total,
        depositAmount,
        totalCost,
        totalProfit,
        profitMargin,
        categorySubtotals
    };
};
