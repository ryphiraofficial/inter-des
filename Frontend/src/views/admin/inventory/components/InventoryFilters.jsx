import React from 'react';

const InventoryFilters = ({ activeFilter, setActiveFilter, sections }) => {
    return (
        <div className="inventory-controls">
            <div className="filter-scroll">
                {['All Items', ...sections].map(section => (
                    <button
                        key={section}
                        className={`filter-btn ${activeFilter === section ? 'active' : ''}`}
                        onClick={() => setActiveFilter(section)}
                    >
                        {section}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default InventoryFilters;
