import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, Briefcase, CheckCircle2, CheckSquare } from 'lucide-react';
import EdgeBandSearch from './EdgeBandSearch';
import EdgeBandMatches from './EdgeBandMatches';
import EdgeBandDimensions from './EdgeBandDimensions';
import EdgeBandResultTable from './EdgeBandResultTable';
import * as api from './edgeBandApi';

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

    // Load saved selections when selected project changes
    useEffect(() => {
        if (!currentAssignment.projectId) {
            setSavedSelections([]);
            return;
        }
        api.getProjectSelections(currentAssignment.projectId)
            .then(d => setSavedSelections(d.selections || []))
            .catch(() => setSavedSelections([]));
    }, [currentAssignment.projectId]);

    // Debounced search when code or brand changes
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (code.trim().length < MIN_CODE_LEN) {
            setMatches([]);
            setSearchStatus('idle');
            setSelectedBands(new Map());
            setQuantities({});
            return;
        }
        setSearchStatus('loading');
        debounceRef.current = setTimeout(async () => {
            try {
                const data = await api.searchEdgeBands(brand, code.trim());
                setMatches(data.results || []);
                setSearchStatus('done');
            } catch {
                setSearchStatus('error');
            }
        }, DEBOUNCE_MS);
        return () => clearTimeout(debounceRef.current);
    }, [code, brand]);

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
        const allSelected = matches.every(m => selectedBands.has(m._id));
        if (allSelected) {
            setSelectedBands(new Map());
            setQuantities({});
        } else {
            setSelectedBands(new Map(matches.map(m => [m._id, m])));
        }
    }, [matches, selectedBands]);

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
            if (dims.length === 0) continue;
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

        if (newItems.length === 0) {
            alert('Please enter a quantity of at least 1 for at least one dimension across selected bands.');
            return;
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

        try {
            setSaving(true);
            setSaveMsg('');
            await api.saveSelections(
                currentAssignment.projectId,
                currentAssignment.taskId || null,
                results.map(r => ({
                    brand: r.brand,
                    enteredCode: r.enteredCode,
                    edgeBandId: r.edgeBandId,
                    dimension: r.dimension,
                    quantity: r.quantity
                }))
            );
            setSaveMsg('✓ Saved successfully to task project!');
            setResults([]);
            // Refresh saved selections
            const d = await api.getProjectSelections(currentAssignment.projectId);
            setSavedSelections(d.selections || []);
        } catch (err) {
            setSaveMsg('Unable to save edge band selection. Please try again.');
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

    const canAdd = selectedBands.size > 0 && Object.values(quantities).some(
        bandQtys => typeof bandQtys === 'object' && Object.values(bandQtys).some(q => Number.isInteger(q) && q >= 1)
    );

    return (
        <div style={{ padding: '0' }}>
            {/* Header & Task/Project Selector */}
            <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                padding: '1.75rem 2rem', marginBottom: '1.5rem',
                boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckSquare size={18} color="#4f46e5" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Assigned Task:</span>
                        <select
                            value={selectedAssignmentKey}
                            onChange={e => setSelectedAssignmentKey(e.target.value)}
                            disabled={loadingAssignments}
                            style={{
                                padding: '8px 14px', borderRadius: '10px',
                                border: '1.5px solid #e2e8f0', fontSize: '0.88rem',
                                fontWeight: 600, color: '#0f172a', background: 'white',
                                outline: 'none', cursor: 'pointer', maxWidth: '320px'
                            }}
                        >
                            {assignedOptions.length === 0 ? (
                                <option value="">Loading assigned tasks...</option>
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

                {/* Search */}
                <EdgeBandSearch
                    brands={brands}
                    brand={brand}
                    setBrand={setBrand}
                    code={code}
                    setCode={setCode}
                    loading={searchStatus === 'loading'}
                />

                {/* Matches — multi-select */}
                <EdgeBandMatches
                    matches={matches}
                    selectedIds={new Set(selectedBands.keys())}
                    onToggle={handleToggle}
                    onToggleAll={handleToggleAll}
                    searchStatus={searchStatus}
                />

                {/* Dimensions — one block per selected band */}
                {selectedBands.size > 0 && (
                    <>
                        <EdgeBandDimensions
                            selectedBands={Array.from(selectedBands.values())}
                            quantities={quantities}
                            setQuantities={setQuantities}
                            onDeselect={handleDeselect}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleAdd}
                                disabled={!canAdd}
                                style={{
                                    background: canAdd ? '#4f46e5' : '#e2e8f0',
                                    color: canAdd ? 'white' : '#94a3b8',
                                    border: 'none', borderRadius: '10px',
                                    padding: '10px 28px', fontSize: '0.9rem',
                                    fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => { if (canAdd) e.currentTarget.style.background = '#4338ca'; }}
                                onMouseLeave={e => { if (canAdd) e.currentTarget.style.background = '#4f46e5'; }}
                            >
                                + Add {selectedBands.size > 1 ? `${selectedBands.size} Bands` : ''} to Requirements
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Notification messages */}
            {saveMsg && (
                <div style={{
                    padding: '12px 20px', borderRadius: '12px', marginBottom: '1rem',
                    background: saveMsg.startsWith('✓') ? '#f0fdf4' : '#fef2f2',
                    color: saveMsg.startsWith('✓') ? '#166534' : '#991b1b',
                    fontWeight: 600, fontSize: '0.9rem', border: `1px solid ${saveMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {saveMsg}
                </div>
            )}

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <CheckCircle2 size={20} color="#10b981" />
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                            Confirmed Edge Bands Saved on Project ({savedSelections.length})
                        </h4>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Brand</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Entered Code</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Matched Code</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'center' }}>Match</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Dimension</th>
                                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Qty</th>
                                    <th style={{ padding: '10px 16px', width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedSelections.map((s, i) => (
                                    <tr key={s._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>{s.brand}</td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#64748b' }}>{s.enteredCode}</td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>{s.matchedCode}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{s.matchPercentage}%</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#475569' }}>{s.dimension.replace('x', ' × ')}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{s.quantity}</td>
                                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
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
                </div>
            )}
        </div>
    );
};

export default EdgeBandPage;
