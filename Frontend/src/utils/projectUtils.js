export const getStageColor = (stage) => {
    const colors = {
        'Accounts': '#10b981',
        'Design': '#8b5cf6',
        'Procurement': '#f59e0b',
        'Production': '#3b82f6',
        'Completed': '#10b981'
    };
    return colors[stage] || '#64748b';
};

export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};
