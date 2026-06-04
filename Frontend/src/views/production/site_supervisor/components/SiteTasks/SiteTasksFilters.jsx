import React from 'react';
import { Target } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed', 'Approved'];
const PRIORITY_FILTERS = ['All', 'Low', 'Medium', 'High', 'Urgent'];

const SiteTasksFilters = ({
    activeTab, setActiveTab,
    showFilters, setShowFilters,
    filters, setFilter,
    activeFilterCount
}) => {
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['All', 'Pending', 'Completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: activeTab === tab ? '#eff6ff' : 'transparent',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: 14,
                                fontWeight: activeTab === tab ? 600 : 500,
                                color: activeTab === tab ? '#3b82f6' : '#64748b',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button
                    className={`site-filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Target size={16} />
                    Filters
                    {activeFilterCount > 0 && <span className="site-filter-badge">{activeFilterCount}</span>}
                </button>
            </div>

            {showFilters && (
                <div className="site-filters-panel">
                    <div className="site-filter-group">
                        <span className="site-filter-label">Status</span>
                        <div className="site-filter-options">
                            {STATUS_FILTERS.map(o => (
                                <button
                                    key={o}
                                    className={`site-filter-chip ${filters.status === o ? 'active' : ''}`}
                                    onClick={() => setFilter('status', o)}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="site-filter-group">
                        <span className="site-filter-label">Priority</span>
                        <div className="site-filter-options">
                            {PRIORITY_FILTERS.map(o => (
                                <button
                                    key={o}
                                    className={`site-filter-chip ${filters.priority === o ? 'active' : ''}`}
                                    onClick={() => setFilter('priority', o)}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SiteTasksFilters;
