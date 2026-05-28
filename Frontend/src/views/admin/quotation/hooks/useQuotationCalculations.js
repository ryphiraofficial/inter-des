import { useMemo } from 'react';

export const useQuotationCalculations = ({ lineItems, includeDiscount, discount, includeTax, taxRate, formData }) => {
    
    const subtotal = useMemo(() => 
        lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
    , [lineItems]);

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
        profitMargin
    };
};
