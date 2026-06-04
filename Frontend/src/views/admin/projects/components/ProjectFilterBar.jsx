import React from 'react';
import { Search } from 'lucide-react';
import FilterDropdown from './FilterDropdown';

const STAGE_OPTIONS = [
    { value: '',            label: 'All Stages',  dot: '#94a3b8' },
    { value: 'Design',      label: 'Design',      dot: '#6366f1' },
    { value: 'Procurement', label: 'Procurement', dot: '#f59e0b' },
    { value: 'Production',  label: 'Production',  dot: '#3b82f6' },
    { value: 'Completed',   label: 'Completed',   dot: '#10b981' },
];

const STATUS_OPTIONS = [
    { value: '',            label: 'All Status',  dot: '#94a3b8' },
    { value: 'Not Started', label: 'Not Started', dot: '#64748b' },
    { value: 'In Progress', label: 'In Progress', dot: '#3b82f6' },
    { value: 'On Hold',     label: 'On Hold',     dot: '#f59e0b' },
    { value: 'Completed',   label: 'Completed',   dot: '#10b981' },
];

const GROUPBY_OPTIONS = [
    { value: 'none',     label: 'None',     dot: '#94a3b8' },
    { value: 'priority', label: 'Priority', dot: '#f43f5e' },
    { value: 'client',   label: 'Client',   dot: '#0ea5e9' },
    { value: 'deadline', label: 'Deadline', dot: '#8b5cf6' },
];

const ProjectFilterBar = ({
    searchTerm, setSearchTerm, stageFilter, setStageFilter, statusFilter, setStatusFilter,
    showStageDropdown, setShowStageDropdown, showStatusDropdown, setShowStatusDropdown,
    showGroupByDropdown, setShowGroupByDropdown,
    groupBy, setGroupBy,
    hideSearch = false
}) => {
    const closeOthersForStage  = () => { setShowStatusDropdown(false); setShowGroupByDropdown(false); };
    const closeOthersForStatus = () => { setShowStageDropdown(false);  setShowGroupByDropdown(false); };
    const closeOthersForGroup  = () => { setShowStageDropdown(false);  setShowStatusDropdown(false); };

    const groupByLabel = groupBy === 'none' ? 'No Grouping' : `By ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`;

    return (
        <div className="filters-bar" style={{ marginTop: '10px' }}>
            {!hideSearch && (
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            )}

            <div className="filter-group">
                <FilterDropdown
                    label={stageFilter || 'All Stages'}
                    value={stageFilter}
                    isOpen={showStageDropdown}
                    setOpen={setShowStageDropdown}
                    closeOthers={closeOthersForStage}
                    options={STAGE_OPTIONS}
                    onChange={setStageFilter}
                />
                <FilterDropdown
                    label={statusFilter || 'All Status'}
                    value={statusFilter}
                    isOpen={showStatusDropdown}
                    setOpen={setShowStatusDropdown}
                    closeOthers={closeOthersForStatus}
                    options={STATUS_OPTIONS}
                    onChange={setStatusFilter}
                />
                <FilterDropdown
                    label={groupByLabel}
                    value={groupBy}
                    isOpen={showGroupByDropdown}
                    setOpen={setShowGroupByDropdown}
                    closeOthers={closeOthersForGroup}
                    options={GROUPBY_OPTIONS}
                    onChange={setGroupBy}
                    rotateIcon
                />
            </div>
        </div>
    );
};

export default ProjectFilterBar;
