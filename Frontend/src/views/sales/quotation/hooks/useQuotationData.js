import { useEffect } from 'react';
import { quotationAPI, clientAPI, inventoryAPI } from '../../../../models/api';

export const useQuotationData = ({ 
    isEdit, id, setFormData, setLineItems, setTaxRate, setDiscount, 
    setIncludeDiscount, setFetching, setError, setClients, setInventoryItems,
    clients 
}) => {
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const clientRes = await clientAPI.getAll();
                if (clientRes.success) setClients(clientRes.data);

                const inventoryRes = await inventoryAPI.getAll();
                if (inventoryRes.success) setInventoryItems(inventoryRes.data);

                if (isEdit && id) {
                    const quoteRes = await quotationAPI.getById(id);
                    if (quoteRes.success) {
                        const q = quoteRes.data;
                        const clientData = q.client?._id || q.client;
                        
                        setFormData({
                            client: clientData,
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
                            quantity: item.quantity,
                            unit: item.unit,
                            rate: item.rate,
                            amount: item.amount,
                            image: item.image || null
                        })));
                        
                        if (q.taxRate) setTaxRate(q.taxRate);
                        if (q.discount) {
                            setDiscount(q.discount);
                            setIncludeDiscount(true);
                        }
                    }
                }
            } catch (err) {
                setError('Failed to load data: ' + err.message);
            } finally {
                setFetching(false);
            }
        };
        loadInitialData();
    }, [isEdit, id]);

    // AI Populate Listener
    useEffect(() => {
        const processAIData = (data) => {
            if (!data) return;

            setFormData(prev => ({
                ...prev,
                projectName: data.projectName || prev.projectName,
                projectDescription: data.projectDescription || data.description || prev.projectDescription,
                paymentTerms: data.paymentTerms || prev.paymentTerms
            }));

            if (data.clientName && clients.length > 0) {
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
        window.addEventListener('AI_POPULATE_QUOTATION', handleAIPopulate);
        return () => window.removeEventListener('AI_POPULATE_QUOTATION', handleAIPopulate);
    }, [clients]);
};
