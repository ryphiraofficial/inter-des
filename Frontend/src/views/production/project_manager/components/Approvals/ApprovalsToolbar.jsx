import React from 'react';
import { Filter, ChevronDown, X, Plus } from 'lucide-react';

const ApprovalsToolbar = ({ filtersOpen, setFiltersOpen, filterStatus, setFilterStatus, setIsModalOpen }) => {
    return (
        <>
            <div className="pm-approvals-toolbar">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={() => setFiltersOpen(o => !o)}
                            className={`pm-filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                        >
                            <Filter size={15} />
                            <span className="pm-desktop-only">Filters</span>
                            {filterStatus !== 'all' && (
                                <span className="pm-filter-count">1</span>
                            )}
                            <ChevronDown size={14} className={`pm-chevron ${filtersOpen ? 'open' : ''}`} />
                        </button>
                        {filterStatus !== 'all' && (
                            <div className="pm-filter-chip pm-desktop-only">
                                {filterStatus}
                                <button onClick={() => setFilterStatus('all')} className="pm-filter-chip-close">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsModalOpen(true)} className="pm-quick-action-btn">
                        <Plus size={16} /> <span>New Request</span>
                    </button>
                </div>
            </div>

            {/* Collapsible Filter Panel */}
            <div className={`pm-filter-panel-wrapper ${filtersOpen ? 'open' : ''}`}>
                <div className="pm-filter-panel">
                    <div className="pm-status-chips">
                        <span className="pm-status-label">Status:</span>
                        <div className="pm-status-chips-scroll">
                            {['all', 'Pending', 'Approved', 'Rejected'].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => { setFilterStatus(s); setFiltersOpen(false); }} 
                                    className={`pm-status-chip-btn ${filterStatus === s ? 'active' : ''}`}
                                >
                                    {s === 'all' ? 'All Statuses' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApprovalsToolbar;
