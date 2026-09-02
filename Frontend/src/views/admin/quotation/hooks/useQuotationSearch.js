import { useState } from 'react';

export const useQuotationSearch = ({ clients, inventoryItems, setFormData, setLineItems, lineItems }) => {
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [showClientSuggestions, setShowClientSuggestions] = useState(false);
    const [filteredClients, setFilteredClients] = useState([]);
    
    const [searchResults, setSearchResults] = useState([]);
    const [activeSearchId, setActiveSearchId] = useState(null);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [globalSearchResults, setGlobalSearchResults] = useState([]);

    const handleClientSearch = (query) => {
        setClientSearchQuery(query);
        if (!query.trim()) {
            setFilteredClients([]);
            setShowClientSuggestions(false);
            setFormData(prev => ({ ...prev, client: '' }));
            return;
        }
        const filtered = clients.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5);
        setFilteredClients(filtered);
        setShowClientSuggestions(true);
    };

    const selectClient = (client) => {
        setFormData(prev => ({ ...prev, client: client._id, projectName: client.projectName || '' }));
        setClientSearchQuery(client.name);
        setShowClientSuggestions(false);
    };

    const handleProductSearch = (itemId, query, updateLineItem) => {
        updateLineItem(itemId, 'name', query);
        if (!query.trim()) {
            setSearchResults([]);
            setActiveSearchId(null);
            return;
        }
        const filtered = inventoryItems.filter(p => p.itemName.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
        setSearchResults(filtered);
        setActiveSearchId(itemId);
    };

    const selectProduct = (itemId, item) => {
        setLineItems(prev => prev.map(li => {
            if (li.id === itemId) return {
                ...li,
                name: item.itemName,
                description: item.description || '',
                section: (li.section && li.section !== 'Uncategorized') ? li.section : (item.section || 'Uncategorized'),
                finishBrand: item.finish || '',
                materialOrigin: item.material || '',
                size: item.size || '',
                unit: item.unit || 'SCM',
                rate: item.price || 0,
                costPrice: item.costPrice || 0,
                image: item.image || null,
                amount: (li.quantity || 1) * (item.price || 0)
            };
            return li;
        }));
        setSearchResults([]);
        setActiveSearchId(null);
    };

    const handleGlobalSearch = (query) => {
        setGlobalSearchQuery(query);
        if (!query.trim()) {
            setGlobalSearchResults([]);
            return;
        }
        const defaultCategories = ['Kitchen', 'Living Room', 'Bedroom', 'Dining Room', 'Bathroom', 'Pooja Room', 'Foyer', 'Balcony', 'Ceiling', 'Flooring', 'Electrical'];
        const inventorySections = Array.from(new Set(inventoryItems.map(p => p.section).filter(Boolean)));
        const allCategories = Array.from(new Set([...defaultCategories, ...inventorySections]));

        const filtered = allCategories.filter(cat =>
            cat.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        setGlobalSearchResults(filtered);
    };

    const addFromInventorySelect = (item) => {
        const newItem = {
            id: Date.now() + Math.random(),
            name: item.itemName,
            description: item.description || '',
            section: item.section || 'Uncategorized',
            finishBrand: item.finish || '',
            materialOrigin: item.material || '',
            size: item.size || '',
            quantity: 1,
            unit: item.unit || 'SCM',
            rate: item.price || 0,
            costPrice: item.costPrice || 0,
            amount: item.price || 0,
            image: item.image || null
        };
        setLineItems([newItem, ...lineItems]);
        setGlobalSearchQuery('');
        setGlobalSearchResults([]);
    };

    return {
        clientSearchQuery, setClientSearchQuery,
        showClientSuggestions, setShowClientSuggestions,
        filteredClients,
        handleClientSearch,
        selectClient,
        searchResults, setSearchResults,
        activeSearchId, setActiveSearchId,
        handleProductSearch,
        selectProduct,
        globalSearchQuery, setGlobalSearchQuery,
        globalSearchResults, setGlobalSearchResults,
        handleGlobalSearch,
        addFromInventorySelect
    };
};
