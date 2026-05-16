import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, CheckCircle } from 'lucide-react';

const ProjectFilterBar = ({ 
    searchTerm, setSearchTerm, stageFilter, setStageFilter, statusFilter, setStatusFilter,
    showStageDropdown, setShowStageDropdown, showStatusDropdown, setShowStatusDropdown,
    showGroupByDropdown, setShowGroupByDropdown,
    groupBy, setGroupBy,
    hideSearch = false
}) => {
    return (
        <div className="filters-bar" style={{ marginTop: '10px' }}>
            {!hideSearch && (
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}
            
            <div className="filter-group">
                {/* Stages Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => { setShowStageDropdown(p => !p); setShowStatusDropdown(false); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 14px', borderRadius: '8px', height: '42px',
                            border: '1px solid #e2e8f0',
                            background: stageFilter ? '#eef2ff' : '#fff',
                            color: stageFilter ? '#4f46e5' : '#64748b',
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <SlidersHorizontal size={15} />
                        {stageFilter || 'All Stages'}
                        <ChevronDown size={14} style={{ opacity: 0.6, transform: showStageDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {showStageDropdown && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowStageDropdown(false)} />
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50,
                                minWidth: '160px', padding: '4px'
                            }}>
                                <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Stage</p>
                                {[
                                    { value: '',            label: 'All Stages',   dot: '#94a3b8' },
                                    { value: 'Design',      label: 'Design',       dot: '#6366f1' },
                                    { value: 'Procurement', label: 'Procurement',  dot: '#f59e0b' },
                                    { value: 'Production',  label: 'Production',   dot: '#3b82f6' },
                                    { value: 'Completed',   label: 'Completed',    dot: '#10b981' },
                                ].map(opt => (
                                    <button key={opt.value}
                                        onClick={() => { setStageFilter(opt.value); setShowStageDropdown(false); }}
                                        className="dropdown-item"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            width: '100%', padding: '8px 10px', borderRadius: '7px',
                                            border: 'none',
                                            background: stageFilter === opt.value ? '#f1f5f9' : 'transparent',
                                            color: stageFilter === opt.value ? '#0f172a' : '#475569',
                                            fontWeight: stageFilter === opt.value ? 700 : 500,
                                            fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                                        {opt.label}
                                        {stageFilter === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Status Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => { setShowStatusDropdown(p => !p); setShowStageDropdown(false); setShowGroupByDropdown(false); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 14px', borderRadius: '8px', height: '42px',
                            border: '1px solid #e2e8f0',
                            background: statusFilter ? '#eef2ff' : '#fff',
                            color: statusFilter ? '#4f46e5' : '#64748b',
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <SlidersHorizontal size={15} />
                        {statusFilter || 'All Status'}
                        <ChevronDown size={14} style={{ opacity: 0.6, transform: showStatusDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {showStatusDropdown && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowStatusDropdown(false)} />
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50,
                                minWidth: '160px', padding: '4px'
                            }}>
                                <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Status</p>
                                {[
                                    { value: '',            label: 'All Status',  dot: '#94a3b8' },
                                    { value: 'Not Started', label: 'Not Started', dot: '#64748b' },
                                    { value: 'In Progress', label: 'In Progress', dot: '#3b82f6' },
                                    { value: 'On Hold',     label: 'On Hold',     dot: '#f59e0b' },
                                    { value: 'Completed',   label: 'Completed',   dot: '#10b981' },
                                ].map(opt => (
                                    <button key={opt.value}
                                        onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false); }}
                                        className="dropdown-item"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            width: '100%', padding: '8px 10px', borderRadius: '7px',
                                            border: 'none',
                                            background: statusFilter === opt.value ? '#f1f5f9' : 'transparent',
                                            color: statusFilter === opt.value ? '#0f172a' : '#475569',
                                            fontWeight: statusFilter === opt.value ? 700 : 500,
                                            fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                                        {opt.label}
                                        {statusFilter === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Group By Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => { setShowGroupByDropdown(p => !p); setShowStageDropdown(false); setShowStatusDropdown(false); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 14px', borderRadius: '8px', height: '42px',
                            border: '1px solid #e2e8f0',
                            background: groupBy !== 'none' ? '#eef2ff' : '#fff',
                            color: groupBy !== 'none' ? '#4f46e5' : '#64748b',
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <SlidersHorizontal size={15} style={{ transform: 'rotate(90deg)' }} />
                        {groupBy === 'none' ? 'No Grouping' : `By ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`}
                        <ChevronDown size={14} style={{ opacity: 0.6, transform: showGroupByDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {showGroupByDropdown && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowGroupByDropdown(false)} />
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50,
                                minWidth: '160px', padding: '4px'
                            }}>
                                <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Group By</p>
                                {[
                                    { value: 'none',     label: 'None',     dot: '#94a3b8' },
                                    { value: 'priority', label: 'Priority', dot: '#f43f5e' },
                                    { value: 'client',   label: 'Client',   dot: '#0ea5e9' },
                                    { value: 'deadline', label: 'Deadline', dot: '#8b5cf6' },
                                ].map(opt => (
                                    <button key={opt.value}
                                        onClick={() => { setGroupBy(opt.value); setShowGroupByDropdown(false); }}
                                        className="dropdown-item"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            width: '100%', padding: '8px 10px', borderRadius: '7px',
                                            border: 'none',
                                            background: groupBy === opt.value ? '#f1f5f9' : 'transparent',
                                            color: groupBy === opt.value ? '#0f172a' : '#475569',
                                            fontWeight: groupBy === opt.value ? 700 : 500,
                                            fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                                        {opt.label}
                                        {groupBy === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectFilterBar;
