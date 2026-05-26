import { useState } from 'react';

export const useQuotationState = () => {
    const initialFormData = {
        client: '',
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
    };

    const [formData, setFormData] = useState(initialFormData);
    const [lineItems, setLineItems] = useState([]);
    const [taxRate, setTaxRate] = useState(18);
    const [includeTax, setIncludeTax] = useState(true);
    const [discount, setDiscount] = useState(0);
    const [includeDiscount, setIncludeDiscount] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addLineItem = () => {
        const newItem = {
            id: Date.now() + Math.random(),
            name: '',
            description: '',
            section: 'Uncategorized',
            finishBrand: '',
            materialOrigin: '',
            size: '',
            measurements: '',
            quantity: 1,
            unit: 'SCM',
            rate: 0,
            amount: 0,
            image: null
        };
        setLineItems(prev => [...prev, newItem]);
    };

    const removeLineItem = (id) => {
        setLineItems(prev => prev.filter(item => item.id !== id));
    };

    const updateLineItem = (id, field, value) => {
        setLineItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
                }
                return updated;
            }
            return item;
        }));
    };

    return {
        formData, setFormData, handleInputChange,
        lineItems, setLineItems, addLineItem, removeLineItem, updateLineItem,
        taxRate, setTaxRate, includeTax, setIncludeTax,
        discount, setDiscount, includeDiscount, setIncludeDiscount,
        expandedItems, setExpandedItems, initialFormData
    };
};
