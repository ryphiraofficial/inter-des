import { useState } from 'react';

export const useQuotationState = () => {
    const [lineItems, setLineItems] = useState([]);
    const [categoryDiscounts, setCategoryDiscounts] = useState([]);
    const [taxRate, setTaxRate] = useState(18);
    const [includeTax, setIncludeTax] = useState(true);
    const [discount, setDiscount] = useState(0);
    const [includeDiscount, setIncludeDiscount] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

    const [formData, setFormData] = useState({
        client: '',
        clientPhone: '',
        quoteNumber: `QT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        documentType: 'Quotation',
        projectName: '',
        projectDescription: '',
        projectStart: new Date().toISOString().split('T')[0],
        projectEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        scopeOfWork: '',
        depositPercent: 30,
        paymentTerms: '',
        warrantyTerms: '',
        cancellationPolicy: '',
        notes: '',
        termsConditions: 'Payment due within 30 days. 50% deposit required to commence work.'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateLineItem = (id, field, value) => {
        setLineItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (['quantity', 'rate', 'discountType', 'discountValue'].includes(field)) {
                    const baseAmount = (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
                    let discountAmount = 0;
                    if (updated.discountType === 'amount') {
                        discountAmount = Number(updated.discountValue) || 0;
                    } else {
                        discountAmount = (baseAmount * (Number(updated.discountValue) || 0)) / 100;
                    }
                    updated.discountAmount = discountAmount;
                    updated.amount = baseAmount - discountAmount;
                }
                return updated;
            }
            return item;
        }));
    };

    const batchUpdateLineItem = (id, fields) => {
        setLineItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, ...fields };
                if ('quantity' in fields || 'rate' in fields || 'discountType' in fields || 'discountValue' in fields) {
                    const baseAmount = (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
                    let discountAmount = 0;
                    if (updated.discountType === 'amount') {
                        discountAmount = Number(updated.discountValue) || 0;
                    } else {
                        discountAmount = (baseAmount * (Number(updated.discountValue) || 0)) / 100;
                    }
                    updated.discountAmount = discountAmount;
                    updated.amount = baseAmount - discountAmount;
                }
                return updated;
            }
            return item;
        }));
    };

    const updateCategoryDiscount = (category, field, value) => {
        setCategoryDiscounts(prev => {
            const list = Array.isArray(prev) ? prev : [];
            const existing = list.find(cd => cd.category === category);
            if (existing) {
                return list.map(cd => cd.category === category ? { ...cd, [field]: value } : cd);
            } else {
                return [...list, { category, discountType: 'percentage', discountValue: 0, [field]: value }];
            }
        });
    };

    const createNewItem = (section = 'Uncategorized') => ({
        id: Date.now() + Math.random(),
        name: '',
        description: '',
        section: section,
        finishBrand: '',
        materialOrigin: '',
        size: '',
        quantity: 1,
        unit: 'SCM',
        rate: 0,
        amount: 0,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        image: null
    });

    const addLineItem = (section = 'Uncategorized') => setLineItems(prev => [createNewItem(section), ...prev]);
    const removeLineItem = (id) => setLineItems(prev => prev.filter(item => item.id !== id));

    return {
        lineItems, setLineItems,
        categoryDiscounts, setCategoryDiscounts, updateCategoryDiscount,
        taxRate, setTaxRate,
        includeTax, setIncludeTax,
        discount, setDiscount,
        includeDiscount, setIncludeDiscount,
        expandedItems, setExpandedItems,
        formData, setFormData,
        handleInputChange,
        updateLineItem,
        batchUpdateLineItem,
        addLineItem,
        removeLineItem
    };
};
