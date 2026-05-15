import React from 'react';

const QuotationTabs = ({ quotations, activeTab, setActiveTab }) => {
    const tabs = ['All', 'Under Review', 'Approved'];

    return (
        <div className="quotations-header-row">
            <div className="q-header-left">
                <div className="q-tabs-list">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`q-tab-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            <span className="q-tab-badge">
                                {tab === 'All' ? quotations.length : quotations.filter(q => q.status === tab).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuotationTabs;
