import React from 'react';
import { Filter, ChevronDown, X, Search } from 'lucide-react';

const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Urgent'];

const TasksFilterPanel = ({ 
    filtersOpen, setFiltersOpen, 
    filterPriority, setFilterPriority, 
    searchTerm, setSearchTerm 
}) => {
    const activeFilterCount = (filterPriority !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

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
                    {filterPriority !== 'All' && (
                        <div className="pm-filter-chip">
                            {filterPriority}
                            <button onClick={() => setFilterPriority('All')} className="pm-filter-chip-close">
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
                            placeholder="Search tasks..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pm-search-input"
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="pm-search-clear"><X size={14} /></button>}
                    </div>
                    <div className="pm-status-chips">
                        <span className="pm-status-label">Priority:</span>
                        <div className="pm-status-chips-scroll">
                            {PRIORITY_OPTIONS.map(p => (
                                <button key={p} onClick={() => setFilterPriority(p)} className={`pm-status-chip-btn ${filterPriority === p ? 'active' : ''}`}>
                                    {p === 'All' ? 'All Priorities' : p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TasksFilterPanel;
