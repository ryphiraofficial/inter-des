import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, CheckCircle2, Tag, Search, ChevronDown } from 'lucide-react';
import EdgeBandSearch from './EdgeBandSearch';
import EdgeBandMatches from './EdgeBandMatches';
import EdgeBandDimensions from './EdgeBandDimensions';
import EdgeBandResultTable from './EdgeBandResultTable';
import * as api from './edgeBandApi';
import { sendToProcurementQueue } from './edgeBandApi';

const DEBOUNCE_MS = 350;
const MIN_CODE_LEN = 2;

const EdgeBandPage = ({ user }) => {
    const [searchParams] = useSearchParams();
    const paramProjectId = searchParams.get('projectId');
    const paramTaskId = searchParams.get('taskId');

    // ── Task/Project assignment state ──
    const [assignedOptions, setAssignedOptions] = useState([]); // [{ projectId, taskId, label }]
    const [selectedAssignmentKey, setSelectedAssignmentKey] = useState(''); // "projectId|taskId"
    const [savedSelections, setSavedSelections] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    // ── Search state ──
    const [brands, setBrands] = useState([]);
    const [brand, setBrand] = useState('');
    const [code, setCode] = useState('');
    const [searchStatus, setSearchStatus] = useState('idle'); // idle | loading | done | error
    const [matches, setMatches] = useState([]);

    // ── Selection state (multi) ──
    // selectedBands: Map<bandId, matchObject>
    // quantities:    { [bandId]: { [dim]: number } }
    const [selectedBands, setSelectedBands] = useState(new Map());
    const [quantities, setQuantities] = useState({});

    // ── Result state ──
    const [results, setResults] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [sendingToProcurement, setSendingToProcurement] = useState(false);

    const debounceRef = useRef(null);

    // Load brands and staff's assigned tasks/projects on mount
    useEffect(() => {
        api.getBrands()
            .then(d => setBrands(d.brands || []))
            .catch(() => {});

        // Fetch staff's tasks and fallback projects
        Promise.all([
            api.getTasks().catch(() => ({ success: false })),
            api.getProjects().catch(() => ({ success: false }))
        ]).then(([tasksRes, projectsRes]) => {
            const rawTasks = tasksRes?.data || tasksRes?.tasks || (Array.isArray(tasksRes) ? tasksRes : []);
            const rawProjects = projectsRes?.data || projectsRes?.projects || (Array.isArray(projectsRes) ? projectsRes : []);

            const optionsMap = new Map();

            // 1. First add projects attached to staff tasks
            if (Array.isArray(rawTasks)) {
                rawTasks.forEach(task => {
                    const projObj = task.project || task.quotation;
                    const pId = projObj?._id || projObj || task._id;
                    const pName = projObj?.name || projObj?.projectName || projObj?.projectNumber || 'Project';
                    const key = `${pId}|${task._id}`;

                    optionsMap.set(key, {
                        projectId: pId,
                        taskId: task._id,
                        label: `${task.title} — (${pName})`
                    });
                });
            }

            // 2. If staff has projects direct, add project fallbacks
            if (Array.isArray(rawProjects)) {
                rawProjects.forEach(proj => {
                    const key = `${proj._id}|`;
                    if (![...optionsMap.keys()].some(k => k.startsWith(`${proj._id}|`))) {
                        optionsMap.set(key, {
                            projectId: proj._id,
                            taskId: null,
                            label: `${proj.name || proj.projectNumber} (${proj.projectNumber || 'PRJ'})`
                        });
                    }
                });
            }

            const options = Array.from(optionsMap.values());
            setAssignedOptions(options);

            // Determine default selection from URL parameters or first option
            if (paramProjectId) {
                const matchedOpt = options.find(o => o.projectId === paramProjectId && (!paramTaskId || o.taskId === paramTaskId))
                                 || options.find(o => o.projectId === paramProjectId);
                if (matchedOpt) {
                    setSelectedAssignmentKey(`${matchedOpt.projectId}|${matchedOpt.taskId || ''}`);
                } else {
                    const customKey = `${paramProjectId}|${paramTaskId || ''}`;
                    setAssignedOptions(prev => [{ projectId: paramProjectId, taskId: paramTaskId || null, label: `Assigned Task / Project` }, ...prev]);
                    setSelectedAssignmentKey(customKey);
                }
            } else if (options.length > 0) {
                setSelectedAssignmentKey(`${options[0].projectId}|${options[0].taskId || ''}`);
            }
        }).finally(() => setLoadingAssignments(false));
    }, [paramProjectId, paramTaskId]);

    // Parse active projectId & taskId from selectedAssignmentKey
    const currentAssignment = React.useMemo(() => {
        if (!selectedAssignmentKey) return { projectId: '', taskId: '' };
        const [projectId, taskId] = selectedAssignmentKey.split('|');
        return { projectId: projectId || '', taskId: taskId || '' };
    }, [selectedAssignmentKey]);

    const [activeRequest, setActiveRequest] = useState(null);
    const [allRequests, setAllRequests] = useState([]);
    const [submittingReq, setSubmittingReq] = useState(false);

    // Load saved selections & requests when selected project changes
    useEffect(() => {
        if (!currentAssignment.projectId) {
            setSavedSelections([]);
            setActiveRequest(null);
            setAllRequests([]);
            return;
        }
        api.getProjectSelections(currentAssignment.projectId)
            .then(d => setSavedSelections(d.selections || []))
            .catch(() => setSavedSelections([]));

        api.getRequests({ projectId: currentAssignment.projectId })
            .then(d => {
                const reqs = d.requests || [];
                setAllRequests(reqs);
                setActiveRequest(reqs[0] || null);
            })
            .catch(() => {
                setAllRequests([]);
                setActiveRequest(null);
            });
    }, [currentAssignment.projectId]);

    const handleSubmitForApproval = async () => {
        if (!savedSelections.length) return;
        if (!currentAssignment.projectId) return;

        try {
            setSubmittingReq(true);
            const items = savedSelections.map(s => ({
                brand: s.brand,
                enteredCode: s.enteredCode,
                matchedCode: s.matchedCode,
                matchPercentage: s.matchPercentage,
                edgeBandRef: s.edgeBandRef?._id || s.edgeBandRef || s._id,
                dimension: s.dimension,
                quantity: s.quantity
            }));
            const res = await api.submitRequest(currentAssignment.projectId, currentAssignment.taskId || null, items);
            setActiveRequest(res.request);
            setSaveMsg('✓ Edge band selections submitted for Manager Approval!');
        } catch (err) {
            alert('Failed to submit for approval: ' + err.message);
        } finally {
            setSubmittingReq(false);
        }
    };

    const handleSendToProcurement = async () => {
        if (!activeRequest?._id) return;
        try {
            setSendingToProcurement(true);
            await sendToProcurementQueue(activeRequest._id);
            setSaveMsg('✓ Sent to Procurement Queue! Procurement team will now resolve inventory.');
        } catch (err) {
            setSaveMsg('Failed to send to procurement: ' + err.message);
        } finally {
            setSendingToProcurement(false);
        }
    };

    // Debounced search across all brands when code changes (fetches all edge bands by default when code is empty)
    useEffect(() => {
        clearTimeout(debounceRef.current);
        setSearchStatus('loading');
        debounceRef.current = setTimeout(async () => {
            try {
                // Fetch candidate edge bands regardless of selected brand filter
                const data = await api.searchEdgeBands('', code.trim());
                setMatches(data.results || []);
                setSearchStatus('done');
            } catch {
                setSearchStatus('error');
            }
        }, DEBOUNCE_MS);
        return () => clearTimeout(debounceRef.current);
    }, [code]);

    // Count matches per brand from search results
    const brandCounts = useMemo(() => {
        const counts = {};
        (matches || []).forEach(m => {
            if (m.brand) {
                counts[m.brand] = (counts[m.brand] || 0) + 1;
            }
        });
        return counts;
    }, [matches]);

    // Filter displayed matches based on selected brand in Left Sidebar
    const displayedMatches = useMemo(() => {
        if (!brand) return matches;
        return matches.filter(m => m.brand === brand);
    }, [matches, brand]);

    // Toggle one band in/out of selection
    const handleToggle = useCallback((match) => {
        setSelectedBands(prev => {
            const next = new Map(prev);
            if (next.has(match._id)) {
                next.delete(match._id);
                // Also clear its quantities
                setQuantities(q => { const copy = { ...q }; delete copy[match._id]; return copy; });
            } else {
                next.set(match._id, match);
            }
            return next;
        });
    }, []);

    // Select all / deselect all visible matches
    const handleToggleAll = useCallback(() => {
        const allSelected = displayedMatches.every(m => selectedBands.has(m._id));
        if (allSelected) {
            setSelectedBands(new Map());
            setQuantities({});
        } else {
            setSelectedBands(new Map(displayedMatches.map(m => [m._id, m])));
        }
    }, [displayedMatches, selectedBands]);

    // Remove one band from selection (from the dimensions panel ×)
    const handleDeselect = useCallback((bandId) => {
        setSelectedBands(prev => { const next = new Map(prev); next.delete(bandId); return next; });
        setQuantities(prev => { const copy = { ...prev }; delete copy[bandId]; return copy; });
    }, []);

    const handleAdd = () => {
        if (selectedBands.size === 0) return;

        // Build items from all selected bands
        const newItems = [];
        for (const [bandId, band] of selectedBands) {
            const bandQtys = quantities[bandId] || {};
            const dims = Object.entries(bandQtys)
                .filter(([, qty]) => Number.isInteger(qty) && qty >= 1);
        if (dims.length === 0) {
                const defaultDim = band.dimensions?.find(d => d.available)?.dimension || band.dimensions?.[0]?.dimension || '22x0.8';
                newItems.push({
                    brand: band.brand || brand || '',
                    enteredCode: code.trim().toUpperCase() || band.code,
                    matchedCode: band.code,
                    matchPercentage: band.match,
                    edgeBandId: bandId,
                    dimension: defaultDim,
                    quantity: 1
                });
                continue;
            }
            for (const [dim, qty] of dims) {
                newItems.push({
                    brand: band.brand || brand || '',
                    enteredCode: code.trim().toUpperCase() || band.code,
                    matchedCode: band.code,
                    matchPercentage: band.match,
                    edgeBandId: bandId,
                    dimension: dim,
                    quantity: qty
                });
            }
        }


        setResults(prev => {
            let updated = [...prev];
            for (const item of newItems) {
                const key = `${item.brand}||${item.matchedCode}||${item.dimension}`;
                const idx = updated.findIndex(r =>
                    `${r.brand}||${r.matchedCode}||${r.dimension}` === key
                );
                if (idx >= 0) {
                    updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
                } else {
                    updated.push(item);
                }
            }
            return updated;
        });

        // Reset
        setSelectedBands(new Map());
        setQuantities({});
        setCode('');
        setMatches([]);
        setSearchStatus('idle');
    };

    const handleRemove = (index) => setResults(prev => prev.filter((_, i) => i !== index));

    const handleSave = async () => {
        if (!results.length) return;

        if (!currentAssignment.projectId) {
            alert('Please select an assigned task/project to save edge band selections.');
            return;
        }

        const validItems = results
            .filter(r => r.dimension && Number.isInteger(r.quantity) && r.quantity >= 1)
            .map(r => ({
                brand: r.brand,
                enteredCode: r.enteredCode,
                edgeBandId: r.edgeBandId,
                dimension: r.dimension,
                quantity: r.quantity
            }));

        if (!validItems.length) {
            alert('Please select valid dimensions and quantity (minimum 1) before saving.');
            return;
        }

        try {
            setSaving(true);
            setSaveMsg('');
            await api.saveSelections(
                currentAssignment.projectId,
                currentAssignment.taskId || null,
                validItems
            );
            setSaveMsg('✓ Saved successfully to task project!');
            setResults([]);
            // Refresh saved selections
            const d = await api.getProjectSelections(currentAssignment.projectId);
            setSavedSelections(d.selections || []);
        } catch (err) {
            alert('Unable to save edge band selection: ' + err.message);
            setSaveMsg('Unable to save edge band selection: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSaved = async (id) => {
        if (!window.confirm('Remove this saved edge band from project?')) return;
        try {
            await api.deleteSelection(id);
            setSavedSelections(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            alert('Failed to remove: ' + err.message);
        }
    };

    const canAdd = selectedBands.size > 0;

    return (
        <div style={{ padding: '0' }}>
            {/* Header & Task/Project Selector Card */}
            <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                padding: '1.5rem 2rem', marginBottom: '1.5rem',
                boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            background: '#f0f3ff', color: '#4f46e5', width: '44px', height: '44px',
                            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Layers size={22} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Edge Band Selection</h2>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Select edge bands for your assigned tasks & projects</p>
                        </div>
                    </div>

                    {/* Task / Project Assignment Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Task:</span>
                        <select
                            value={selectedAssignmentKey}
                            onChange={e => setSelectedAssignmentKey(e.target.value)}
                            disabled={loadingAssignments}
                            style={{
                                padding: '7px 12px', borderRadius: '10px',
                                border: '1.5px solid #e2e8f0', fontSize: '0.88rem',
                                fontWeight: 600, color: '#0f172a', background: 'white',
                                outline: 'none', cursor: 'pointer', maxWidth: '300px'
                            }}
                        >
                            {assignedOptions.length === 0 ? (
                                <option value="">Loading tasks...</option>
                            ) : (
                                assignedOptions.map(opt => (
                                    <option key={`${opt.projectId}|${opt.taskId || ''}`} value={`${opt.projectId}|${opt.taskId || ''}`}>
                                        {opt.label}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Notification messages */}
            {saveMsg && (
                <div style={{
                    padding: '12px 20px', borderRadius: '12px', marginBottom: '1.5rem',
                    background: saveMsg.startsWith('✓') ? '#f0fdf4' : '#fef2f2',
                    color: saveMsg.startsWith('✓') ? '#166534' : '#991b1b',
                    fontWeight: 600, fontSize: '0.9rem', border: `1px solid ${saveMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {saveMsg}
                </div>
            )}

            {/* Single Full-Width Selection Panel */}
            <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                marginBottom: '1.5rem', overflow: 'hidden',
                boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
            }}>
                {/* Search + Brand filter row */}
                <div style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    padding: '1.25rem 1.75rem',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                    {/* Search */}
                    <EdgeBandSearch
                        code={code}
                        setCode={setCode}
                        loading={searchStatus === 'loading'}
                    />

                    {/* Brand dropdown */}
                    <select
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        style={{
                            flexShrink: 0,
                            padding: '10px 14px', borderRadius: '12px',
                            border: '1.5px solid #e2e8f0', fontSize: '0.88rem',
                            fontWeight: 600, color: '#0f172a', background: 'white',
                            outline: 'none', cursor: 'pointer', minWidth: '160px'
                        }}
                    >
                        <option value="">All Brands ({matches.length})</option>
                        {brands.map(bName => (
                            <option key={bName} value={bName}>
                                {bName} ({brandCounts[bName] || 0})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Matches table */}
                <div style={{ padding: '0 1.75rem' }}>
                    <EdgeBandMatches
                        matches={displayedMatches}
                        selectedIds={new Set(selectedBands.keys())}
                        onToggle={handleToggle}
                        onToggleAll={handleToggleAll}
                        searchStatus={searchStatus}
                    />
                </div>

                {/* Dimensions & Quantities Panel (only when bands are selected) */}
                {selectedBands.size > 0 && (
                    <div style={{ padding: '0 1.75rem 1.5rem 1.75rem', marginTop: '0.5rem' }}>
                        <EdgeBandDimensions
                            selectedBands={Array.from(selectedBands.values())}
                            quantities={quantities}
                            setQuantities={setQuantities}
                            onDeselect={handleDeselect}
                        />
                    </div>
                )}

                {/* Sticky bottom action bar */}
                <div style={{
                    borderTop: '1px solid #e2e8f0',
                    padding: '1rem 1.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: selectedBands.size > 0 ? '#f5f3ff' : '#f8fafc',
                    transition: 'background 0.2s'
                }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedBands.size > 0 ? '#4f46e5' : '#94a3b8' }}>
                        {selectedBands.size > 0 ? `${selectedBands.size} selected` : 'Select rows to add to task'}
                    </span>
                    <button
                        onClick={handleAdd}
                        disabled={!canAdd}
                        style={{
                            background: canAdd ? '#4f46e5' : '#e2e8f0',
                            color: canAdd ? 'white' : '#94a3b8',
                            border: 'none', borderRadius: '10px',
                            padding: '9px 24px', fontSize: '0.88rem',
                            fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => { if (canAdd) e.currentTarget.style.background = '#4338ca'; }}
                        onMouseLeave={e => { if (canAdd) e.currentTarget.style.background = canAdd ? '#4f46e5' : '#e2e8f0'; }}
                    >
                        + Add to Task
                    </button>
                </div>
            </div>

            {/* Unsaved requirements waiting to be confirmed */}
            <EdgeBandResultTable
                results={results}
                onRemove={handleRemove}
                onSave={handleSave}
                saving={saving}
            />

            {/* Saved selections section */}
            {savedSelections.length > 0 && (
                <div style={{
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                    padding: '1.5rem 2rem', marginTop: '1.5rem',
                    boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={20} color="#10b981" />
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                Confirmed Edge Bands Saved on Project ({savedSelections.length})
                            </h4>
                        </div>

                        {/* Submit / Status Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {activeRequest?.status === 'pending_manager' && (
                                <span style={{ padding: '6px 14px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                                    ⏳ Pending Manager Approval
                                </span>
                            )}
                            {activeRequest?.status === 'pending_admin' && (
                                <span style={{ padding: '6px 14px', background: '#e0e7ff', color: '#3730a3', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                                    🛡️ Manager Approved — Pending Admin
                                </span>
                            )}
                            {activeRequest?.status === 'approved' && (
                                <span style={{ padding: '6px 14px', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                                    ✅ Fully Approved → Ready for Procurement
                                </span>
                            )}
                            {activeRequest?.status === 'rejected' && (
                                <span style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                                    ⚠️ Action Required: Recheck Requested
                                </span>
                            )}

                            {/* Approved: show Send to Procurement button instead of re-submit */}
                            {activeRequest?.status === 'approved' ? (
                                <button
                                    onClick={handleSendToProcurement}
                                    disabled={sendingToProcurement}
                                    style={{
                                        background: sendingToProcurement ? '#cbd5e1' : '#059669',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700,
                                        cursor: sendingToProcurement ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {sendingToProcurement ? 'Sending…' : '📦 Send to Procurement Queue'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitForApproval}
                                    disabled={submittingReq || activeRequest?.status === 'pending_manager' || activeRequest?.status === 'pending_admin'}
                                    style={{
                                        background: (activeRequest?.status === 'pending_manager' || activeRequest?.status === 'pending_admin') ? '#cbd5e1' : '#4f46e5',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700,
                                        cursor: (activeRequest?.status === 'pending_manager' || activeRequest?.status === 'pending_admin') ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {submittingReq ? 'Submitting...' : activeRequest?.status === 'rejected' ? '🔄 Resubmit Edge Bands for Approval' : '🚀 Submit for Manager Approval'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Manager / Admin Note Banner if rejected or commented */}
                    {activeRequest?.managerNote && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#92400e' }}>
                            <strong>Manager Note:</strong> {activeRequest.managerNote}
                        </div>
                    )}
                    {activeRequest?.adminNote && (
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '10px 16px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#1e40af' }}>
                            <strong>Admin Note:</strong> {activeRequest.adminNote}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(() => {
                            const map = new Map();
                            savedSelections.forEach(s => {
                                const b = s.brand || 'Other Brand';
                                if (!map.has(b)) map.set(b, []);
                                map.get(b).push(s);
                            });
                            return Array.from(map.entries()).map(([brandName, brandItems]) => (
                                <div key={brandName} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                                    <div style={{
                                        background: '#f8fafc', padding: '8px 16px', borderBottom: '1px solid #e2e8f0',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tag size={13} color="#10b981" />
                                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>{brandName}</span>
                                        </div>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                                            {brandItems.length} saved item{brandItems.length > 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                        <thead>
                                            <tr style={{ background: '#fafafa', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Entered Code</th>
                                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Matched Code</th>
                                                <th style={{ padding: '8px 16px', textAlign: 'center' }}>Match</th>
                                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Dimension</th>
                                                <th style={{ padding: '8px 16px', textAlign: 'right' }}>Qty</th>
                                                <th style={{ padding: '8px 16px', width: '40px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {brandItems.map((s, i) => (
                                                <tr key={s._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : 'none', background: 'white' }}>
                                                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#64748b' }}>{s.enteredCode}</td>
                                                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{s.matchedCode}</td>
                                                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{s.matchPercentage}%</span>
                                                    </td>
                                                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', color: '#475569' }}>{s.dimension.replace('x', ' × ')}</td>
                                                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{s.quantity}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                                        <button
                                                            onClick={() => handleDeleteSaved(s._id)}
                                                            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
                                                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                                            onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                                                            title="Delete selection"
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}

            {/* Submitted Edge Band Requests & Approval Status */}
            {allRequests.length > 0 && (
                <div style={{
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                    padding: '1.5rem 2rem', marginTop: '1.5rem',
                    boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                        <Layers size={20} color="#4f46e5" />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                            Submitted Edge Band Requests & Approval Pipeline ({allRequests.length})
                        </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {allRequests.map(req => (
                            <div key={req._id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                                <div style={{
                                    background: '#f8fafc', padding: '10px 16px', borderBottom: '1px solid #e2e8f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'
                                }}>
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                                            {req.project?.name || req.project?.projectNumber || 'Project Request'}
                                        </span>
                                        <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '12px' }}>
                                            Submitted on {new Date(req.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        {req.status === 'pending_manager' && (
                                            <span style={{ padding: '4px 10px', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                ⏳ Pending Manager Review
                                            </span>
                                        )}
                                        {req.status === 'pending_admin' && (
                                            <span style={{ padding: '4px 10px', background: '#e0e7ff', color: '#3730a3', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                🛡️ Manager Approved — Pending Admin
                                            </span>
                                        )}
                                        {req.status === 'approved' && (
                                            <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                ✅ Approved & Released to Procurement
                                            </span>
                                        )}
                                        {req.status === 'rejected' && (
                                            <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                ❌ Recheck Requested by Manager
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {req.managerNote && (
                                    <div style={{ background: '#fffbeb', padding: '8px 16px', borderBottom: '1px solid #fde68a', fontSize: '0.82rem', color: '#92400e' }}>
                                        <strong>Manager Feedback:</strong> {req.managerNote}
                                    </div>
                                )}

                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ background: '#fafafa', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                                            <th style={{ padding: '8px 16px', textAlign: 'left' }}>Brand</th>
                                            <th style={{ padding: '8px 16px', textAlign: 'left' }}>Entered Code</th>
                                            <th style={{ padding: '8px 16px', textAlign: 'left' }}>Matched Code</th>
                                            <th style={{ padding: '8px 16px', textAlign: 'center' }}>Match</th>
                                            <th style={{ padding: '8px 16px', textAlign: 'left' }}>Dimension</th>
                                            <th style={{ padding: '8px 16px', textAlign: 'right' }}>Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {req.items?.map((item, idx) => (
                                            <tr key={idx} style={{ borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}>
                                                <td style={{ padding: '8px 16px', fontWeight: 700, color: '#1e293b' }}>{item.brand}</td>
                                                <td style={{ padding: '8px 16px', fontFamily: 'monospace', color: '#64748b' }}>{item.enteredCode}</td>
                                                <td style={{ padding: '8px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>{item.matchedCode}</td>
                                                <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{item.matchPercentage}%</span>
                                                </td>
                                                <td style={{ padding: '8px 16px', fontFamily: 'monospace', color: '#475569' }}>{item.dimension.replace('x', ' × ')}</td>
                                                <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EdgeBandPage;
