import React from 'react';
import { Filter, ChevronDown, X, Search } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Active', 'Planning', 'On Hold', 'Completed'];

const ProjectsFilterPanel = ({ 
    filtersOpen, setFiltersOpen, 
    filterStatus, setFilterStatus, 
    searchTerm, setSearchTerm 
}) => {
    const activeFilterCount = (filterStatus !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

    return (
        <>
            <div className="pm-toolbar">
                <div className="pm-toolbar-left">
                    <button
                        onClick={() => setFiltersOpen(o => !o)}
                        className={`pm-filter-toggle-btn ${filtersOpen ? 'active' : ''}`}
                    >
                        <Filter size={15} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="pm-filter-count">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown size={14} className={`pm-chevron ${filtersOpen ? 'open' : ''}`} />
                    </button>

                    {filterStatus !== 'All' && (
                        <div className="pm-filter-chip">
                            {filterStatus}
                            <button onClick={() => setFilterStatus('All')} className="pm-filter-chip-close">
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`pm-filter-panel-wrapper ${filtersOpen ? 'open' : ''}`}>
                <div className="pm-filter-panel">
                    <div className="pm-search-input-container">
                        <Search size={15} color="#64748b" />
                        <input
                            type="text"
                            placeholder="Search projects or clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pm-search-input"
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="pm-search-clear"><X size={14} /></button>}
                    </div>
                    <div className="pm-status-chips">
                        <span className="pm-status-label">Status:</span>
                        <div className="pm-status-chips-scroll">
                            {STATUS_OPTIONS.map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} className={`pm-status-chip-btn ${filterStatus === s ? 'active' : ''}`}>
                                    {s === 'All' ? 'All Statuses' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectsFilterPanel;
