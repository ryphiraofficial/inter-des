import { useState, useEffect } from 'react';
import { useGetClientsQuery, useGetInventoryQuery, useGetQuotationByIdQuery } from '../../../../store/api/adminApi';

export const useQuotationData = ({ isEdit, id, setFormData, setLineItems, setTaxRate, setDiscount, setIncludeDiscount, setFetching, setError, setClients, setInventoryItems, clients }) => {
    
    const { data: clientsRes, isLoading: clientsLoading, error: clientsError } = useGetClientsQuery();
    const { data: inventoryRes, isLoading: inventoryLoading, error: inventoryError } = useGetInventoryQuery({ limit: 1000 });
    const { data: quoteRes, isLoading: quoteLoading, error: quoteError } = useGetQuotationByIdQuery(id, { skip: !isEdit || !id });

    // Initial Data Fetch
    useEffect(() => {
        if (clientsLoading || inventoryLoading || (isEdit && id && quoteLoading)) {
            setFetching(true);
            return;
        }
        
        if (clientsError || inventoryError || quoteError) {
            setError('Failed to load data.');
            setFetching(false);
            return;
        }

        if (clientsRes?.success) setClients(clientsRes.data);
        if (inventoryRes?.success) setInventoryItems(inventoryRes.data);

        if (isEdit && id && quoteRes?.success) {
            const q = quoteRes.data;
            const clientData = q.client?._id || q.client;
            setFormData({
                client: clientData,
                clientPhone: q.clientPhone || '',
                quoteNumber: q.quotationNumber,
                date: new Date(q.createdAt).toISOString().split('T')[0],
                validUntil: q.validUntil ? new Date(q.validUntil).toISOString().split('T')[0] : '',
                documentType: q.documentType || 'Quotation',
                projectName: q.projectName,
                projectDescription: q.projectDescription || '',
                projectStart: q.projectStart ? new Date(q.projectStart).toISOString().split('T')[0] : '',
                projectEnd: q.projectEnd ? new Date(q.projectEnd).toISOString().split('T')[0] : '',
                scopeOfWork: q.scopeOfWork || '',
                depositPercent: q.depositPercent || 30,
                paymentTerms: q.paymentTerms || '',
                warrantyTerms: q.warrantyTerms || '',
                cancellationPolicy: q.cancellationPolicy || '',
                notes: q.notes || '',
                termsConditions: q.termsAndConditions || ''
            });

            setLineItems(q.items.map(item => ({
                id: item._id || Math.random(),
                name: item.itemName,
                description: item.description,
                section: item.section || 'Uncategorized',
                finishBrand: item.finish || '',
                materialOrigin: item.material || '',
                size: item.size || '',
                cmL: item.cmL || null,
                cmD: item.cmD || null,
                cmH: item.cmH || null,
                quantity: item.quantity,
                unit: item.unit,
                rate: item.rate,
                amount: item.amount,
                costPrice: item.costPrice || 0,
                image: item.image || null
            })));
            if (q.taxRate) setTaxRate(q.taxRate);
            if (q.discount) {
                setDiscount(q.discount);
                setIncludeDiscount(true);
            }
        }
        setFetching(false);
    }, [clientsRes, inventoryRes, quoteRes, clientsLoading, inventoryLoading, quoteLoading, clientsError, inventoryError, quoteError, isEdit, id, setClients, setDiscount, setError, setFetching, setFormData, setIncludeDiscount, setInventoryItems, setLineItems, setTaxRate]);

    // AI Auto-Fill Listener
    useEffect(() => {
        const processAIData = (data) => {
            if (!data) return;

            setFormData(prev => ({
                ...prev,
                projectName: data.projectName || prev.projectName,
                projectDescription: data.projectDescription || data.description || prev.projectDescription,
                paymentTerms: data.paymentTerms || prev.paymentTerms
            }));

            if (data.clientName && clients) {
                const matched = clients.find(c => c.name.toLowerCase().includes(data.clientName.toLowerCase()));
                if (matched) {
                    setFormData(prev => ({ ...prev, client: matched._id }));
                }
            }

            if (data.items && data.items.length > 0) {
                const newItems = data.items.map(item => ({
                    id: Math.random(),
                    name: item.name || 'AI Suggested Item',
                    description: item.description || '',
                    section: item.section || 'General',
                    finishBrand: item.finish || '',
                    materialOrigin: item.material || '',
                    size: item.size || '',
                    quantity: item.qty || 1,
                    unit: item.unit || 'SCM',
                    rate: item.rate || 0,
                    amount: (item.qty || 1) * (item.rate || 0),
                    image: null
                }));
                setLineItems(newItems);
            }
        };

        const handleAIPopulate = (e) => processAIData(e.detail);
        const pending = sessionStorage.getItem('AI_PENDING_DATA');
        if (pending) {
            const { type, data } = JSON.parse(pending);
            if (type === 'QUOTATION') {
                processAIData(data);
                sessionStorage.removeItem('AI_PENDING_DATA');
            }
        }

        window.addEventListener('AI_POPULATE_QUOTATION', handleAIPopulate);
        return () => window.removeEventListener('AI_POPULATE_QUOTATION', handleAIPopulate);
    }, [clients, setFormData, setLineItems]);
};
