import React from 'react';

const DashboardTabs = ({ tabs, activeTab, setActiveTab, chartData }) => {
    return (
        <div className="pm-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`pm-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <tab.icon size={15} />
                    {tab.label}
                    {tab.id === 'analytics' && chartData && (
                        <span className="pm-tab-badge">{chartData.totalTasks || 0}</span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default DashboardTabs;
