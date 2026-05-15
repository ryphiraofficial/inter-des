import React from 'react';

const ClientHeader = ({ clients, activeTab, setActiveTab, sevenDaysAgo }) => {
    return (
        <div className="c-clients-header">
            <div className="c-header-left">
                <div className="c-tabs-list">
                    {['All', 'New', 'Staff Added'].map(tab => (
                        <button
                            key={tab}
                            className={`c-tab-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'New' ? 'New (Recent)' : tab}
                            <span className="c-tab-badge">
                                {tab === 'All' ? clients.length :
                                    tab === 'New' ? clients.filter(c => new Date(c.createdAt) >= sevenDaysAgo).length :
                                        clients.filter(c => c.createdBy?.role === 'Staff').length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientHeader;
