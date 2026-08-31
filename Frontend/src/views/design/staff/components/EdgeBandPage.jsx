import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, CheckCircle2, Tag, Search, Send, History, AlertCircle, Plus, Trash2, ShoppingBag } from 'lucide-react';
import EdgeBandDimensions from './EdgeBandDimensions';
import * as api from './edgeBandApi';

const EdgeBandPage = ({ user }) => {
    const [searchParams] = useSearchParams();
    const paramProjectId = searchParams.get('projectId');
    const paramTaskId = searchParams.get('taskId');

    // ── Navigation Tabs ──
    const [activeTab, setActiveTab] = useState('selection'); // 'selection' | 'history'

    // ── Task/Project assignment state ──
    const [assignedOptions, setAssignedOptions] = useState([]);
    const [selectedAssignmentKey, setSelectedAssignmentKey] = useState('');
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    // ── Lamination & Match Search State ──
    const [laminationBrands, setLaminationBrands] = useState([]);
    const [selectedLamBrand, setSelectedLamBrand] = useState('');
    const [laminationCodeInput, setLaminationCodeInput] = useState('');
    const [lookupStatus, setLookupStatus] = useState('idle'); // idle | loading | found | not_found
    const [resolvedLamination, setResolvedLamination] = useState(null);
    const [matchedEdgeBands, setMatchedEdgeBands] = useState([]);

    // ── Currently Selected Edge Bands & Quantities for active lookup ──
    const [selectedBandIds, setSelectedBandIds] = useState(new Set());
    const [quantities, setQuantities] = useState({}); // { [bandId]: { [dim]: number } }

    // ── ACCUMULATED / STAGED SELECTIONS (Cart for multi-lamination support) ──
    const [stagedItems, setStagedItems] = useState([]);

    // ── Request & History State ──
    const [allRequests, setAllRequests] = useState([]);
    const [activeRequest, setActiveRequest] = useState(null);
    const [submittingReq, setSubmittingReq] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Load initial options & brands
    useEffect(() => {
        api.getLaminationBrands()
            .then(d => setLaminationBrands(d.data || d.brands || []))
            .catch(() => {});

        Promise.all([
            api.getTasks().catch(() => ({ success: false })),
            api.getProjects().catch(() => ({ success: false }))
        ]).then(([tasksRes, projectsRes]) => {
            const rawTasks = tasksRes?.data || tasksRes?.tasks || (Array.isArray(tasksRes) ? tasksRes : []);
            const rawProjects = projectsRes?.data || projectsRes?.projects || (Array.isArray(projectsRes) ? projectsRes : []);

            const optionsMap = new Map();

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

    // Current Assignment key
    const currentAssignment = useMemo(() => {
        if (!selectedAssignmentKey) return { projectId: '', taskId: '' };
        const [projectId, taskId] = selectedAssignmentKey.split('|');
        return { projectId: projectId || '', taskId: taskId || '' };
    }, [selectedAssignmentKey]);

    // Load request history whenever project changes
    useEffect(() => {
        if (!currentAssignment.projectId) {
            setAllRequests([]);
            setActiveRequest(null);
            return;
        }
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

    // Step 1: Lookup Lamination Code
    const handleLookupLamination = async () => {
        if (!selectedLamBrand) {
            alert('Please select a Lamination Brand first.');
            return;
        }
        if (!laminationCodeInput.trim()) {
            alert('Please enter a Lamination Code.');
            return;
        }

        try {
            setLookupStatus('loading');
            setResolvedLamination(null);
            setMatchedEdgeBands([]);
            setSelectedBandIds(new Set());
            setQuantities({});

            const res = await api.lookupLamination(selectedLamBrand, laminationCodeInput.trim());
            if (res.item) {
                setResolvedLamination(res.item);
                setLookupStatus('found');

                // Fetch matched edge bands for this lamination item
                const matchRes = await api.getMatchedEdgeBands(res.item._id);
                setMatchedEdgeBands(matchRes.matches || matchRes.results || []);
            } else {
                setLookupStatus('not_found');
            }
        } catch (err) {
            setLookupStatus('not_found');
        }
    };

    // Select/deselect Edge Band candidates
    const handleToggleBandSelect = (id) => {
        setSelectedBandIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                setQuantities(q => { const copy = { ...q }; delete copy[id]; return copy; });
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Prepare selected bands array for EdgeBandDimensions component
    const selectedBandsArray = useMemo(() => {
        return matchedEdgeBands
            .filter(m => selectedBandIds.has(m.edgeBandItemId || m.matchId))
            .map(m => {
                const id = m.edgeBandItemId || m.matchId;
                return {
                    _id: id,
                    code: m.code,
                    name: m.name,
                    brand: m.brand,
                    finish: m.finish,
                    color: m.color,
                    matchPercent: m.matchPercent,
                    edgeBandItemId: m.edgeBandItemId,
                    inventoryId: m.inventoryId,
                    dimensions: [
                        { dimension: '22x0.8', available: true },
                        { dimension: '22x2', available: true },
                        { dimension: '45x0.8', available: true },
                        { dimension: '45x2', available: true }
                    ]
                };
            });
    }, [matchedEdgeBands, selectedBandIds]);

    // Add current selection to Staged List (Cart)
    const handleAddCurrentToStaged = () => {
        if (selectedBandsArray.length === 0) {
            alert('Please select at least one matched Edge Band candidate.');
            return;
        }

        const newStaged = [];
        for (const band of selectedBandsArray) {
            const bandQtys = quantities[band._id] || {};
            const dims = Object.entries(bandQtys).filter(([, q]) => Number.isInteger(q) && q > 0);

            if (dims.length === 0) {
                newStaged.push({
                    id: `${band._id}-22x0.8-${Date.now()}`,
                    laminationBrand: resolvedLamination?.brandName || selectedLamBrand,
                    laminationCode: laminationCodeInput.trim().toUpperCase(),
                    brand: band.brand,
                    enteredCode: laminationCodeInput.trim().toUpperCase(),
                    matchedCode: band.code,
                    matchedName: band.name,
                    matchPercentage: band.matchPercent || 100,
                    edgeBandId: band.edgeBandItemId || band.inventoryId || band._id,
                    dimension: '22x0.8',
                    quantity: 1
                });
            } else {
                for (const [dim, qty] of dims) {
                    newStaged.push({
                        id: `${band._id}-${dim}-${Date.now()}`,
                        laminationBrand: resolvedLamination?.brandName || selectedLamBrand,
                        laminationCode: laminationCodeInput.trim().toUpperCase(),
                        brand: band.brand,
                        enteredCode: laminationCodeInput.trim().toUpperCase(),
                        matchedCode: band.code,
                        matchedName: band.name,
                        matchPercentage: band.matchPercent || 100,
                        edgeBandId: band.edgeBandItemId || band.inventoryId || band._id,
                        dimension: dim,
                        quantity: qty
                    });
                }
            }
        }

        setStagedItems(prev => [...prev, ...newStaged]);

        // Reset active lookup section so user can lookup another Lamination code!
        setLaminationCodeInput('');
        setResolvedLamination(null);
        setMatchedEdgeBands([]);
        setSelectedBandIds(new Set());
        setQuantities({});
        setLookupStatus('idle');

        setSaveMsg(`✓ Added ${newStaged.length} item(s) to project selection list! You can now look up another Lamination brand/code.`);
    };

    const handleRemoveStagedItem = (id) => {
        setStagedItems(prev => prev.filter(item => item.id !== id));
    };

    // One-Click Save & Submit All Staged Items to Manager
    const handleOneClickSubmit = async () => {
        if (!currentAssignment.projectId) {
            alert('Please select an assigned task/project.');
            return;
        }

        // If user hasn't pushed to staged list yet but has active selections, auto-stage them!
        let itemsToSubmit = [...stagedItems];
        if (itemsToSubmit.length === 0 && selectedBandsArray.length > 0) {
            for (const band of selectedBandsArray) {
                const bandQtys = quantities[band._id] || {};
                const dims = Object.entries(bandQtys).filter(([, q]) => Number.isInteger(q) && q > 0);

                if (dims.length === 0) {
                    itemsToSubmit.push({
                        brand: band.brand,
                        enteredCode: laminationCodeInput.trim().toUpperCase(),
                        matchedCode: band.code,
                        matchPercentage: band.matchPercent || 100,
                        edgeBandId: band.edgeBandItemId || band.inventoryId || band._id,
                        dimension: '22x0.8',
                        quantity: 1
                    });
                } else {
                    for (const [dim, qty] of dims) {
                        itemsToSubmit.push({
                            brand: band.brand,
                            enteredCode: laminationCodeInput.trim().toUpperCase(),
                            matchedCode: band.code,
                            matchPercentage: band.matchPercent || 100,
                            edgeBandId: band.edgeBandItemId || band.inventoryId || band._id,
                            dimension: dim,
                            quantity: qty
                        });
                    }
                }
            }
        }

        if (itemsToSubmit.length === 0) {
            alert('Please select at least one matched Edge Band candidate and add to selection list.');
            return;
        }

        try {
            setSubmittingReq(true);
            setSaveMsg('');

            // Save & Submit directly
            await api.saveSelections(currentAssignment.projectId, currentAssignment.taskId || null, itemsToSubmit);
            const res = await api.submitRequest(currentAssignment.projectId, currentAssignment.taskId || null, itemsToSubmit);

            setActiveRequest(res.request);
            setAllRequests(prev => [res.request, ...prev.filter(r => r._id !== res.request._id)]);

            // Reset active selection workspace & staged cart
            setStagedItems([]);
            setSelectedLamBrand('');
            setLaminationCodeInput('');
            setResolvedLamination(null);
            setMatchedEdgeBands([]);
            setSelectedBandIds(new Set());
            setQuantities({});
            setLookupStatus('idle');

            setSaveMsg(`✓ Submitted ${itemsToSubmit.length} Edge Band selection(s) across lamination brands to Manager! Switched to Request History tab.`);
            setActiveTab('history'); // Switch to history tab cleanly
        } catch (err) {
            alert('Failed to submit request: ' + err.message);
        } finally {
            setSubmittingReq(false);
        }
    };

    return (
        <div style={{ padding: '0' }}>
            {/* Header & Task Selection Bar */}
            <div style={{
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                padding: '1.25rem 2rem', marginBottom: '1.5rem',
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
                            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Edge Band Library & Selection</h2>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Select multiple lamination brands/codes, match Edge Bands, and build project order</p>
                        </div>
                    </div>

                    {/* Task Selector */}
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

                {/* Tab Switcher */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('selection')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 18px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'selection' ? '#4f46e5' : '#f8fafc',
                            color: activeTab === 'selection' ? 'white' : '#64748b',
                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Layers size={16} /> Edge Band Selection Workspace ({stagedItems.length} staged)
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 18px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'history' ? '#4f46e5' : '#f8fafc',
                            color: activeTab === 'history' ? 'white' : '#64748b',
                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <History size={16} /> Request History & Approval Status ({allRequests.length})
                    </button>
                </div>
            </div>

            {/* Notification Bar */}
            {saveMsg && (
                <div style={{
                    padding: '12px 20px', borderRadius: '12px', marginBottom: '1.5rem',
                    background: '#f0fdf4', color: '#166534', fontWeight: 600, fontSize: '0.9rem',
                    border: '1px solid #bbf7d0'
                }}>
                    {saveMsg}
                </div>
            )}

            {/* TAB 1: EDGE BAND SELECTION WORKSPACE */}
            {activeTab === 'selection' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Step 1: Select Lamination Brand & Code */}
                    <div style={{
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                        padding: '1.5rem 2rem', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                            Step 1: Lookup Lamination Code from Library
                        </h3>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Lamination Brand */}
                            <select
                                value={selectedLamBrand}
                                onChange={e => setSelectedLamBrand(e.target.value)}
                                style={{
                                    padding: '10px 14px', borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0', fontSize: '0.88rem',
                                    fontWeight: 600, color: '#0f172a', background: 'white',
                                    outline: 'none', cursor: 'pointer', minWidth: '200px'
                                }}
                            >
                                <option value="">-- Select Lamination Brand --</option>
                                {laminationBrands.map(b => (
                                    <option key={b._id || b.name} value={b._id || b.name}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>

                            {/* Lamination Code plain text input */}
                            <input
                                type="text"
                                placeholder="Enter Lamination Code (e.g. 1123, 1025)"
                                value={laminationCodeInput}
                                onChange={e => setLaminationCodeInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleLookupLamination()}
                                style={{
                                    flex: 1, padding: '10px 14px', borderRadius: '12px',
                                    border: '1.5px solid #e2e8f0', fontSize: '0.88rem',
                                    fontWeight: 600, outline: 'none', minWidth: '220px'
                                }}
                            />

                            <button
                                onClick={handleLookupLamination}
                                disabled={lookupStatus === 'loading'}
                                style={{
                                    background: '#4f46e5', color: 'white', border: 'none',
                                    borderRadius: '12px', padding: '10px 22px', fontSize: '0.88rem',
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <Search size={16} /> Lookup Matches
                            </button>
                        </div>

                        {/* Lookup Feedback */}
                        {lookupStatus === 'not_found' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', marginTop: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                <AlertCircle size={16} /> No matching lamination code found for this brand. Please verify code.
                            </div>
                        )}

                        {resolvedLamination && (
                            <div style={{
                                marginTop: '1rem', padding: '10px 16px', borderRadius: '12px',
                                background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
                                display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700
                            }}>
                                <CheckCircle2 size={18} color="#166534" />
                                Resolved Lamination: {resolvedLamination.brandName} — Code: {resolvedLamination.code} ({resolvedLamination.name})
                            </div>
                        )}
                    </div>

                    {/* Step 2: Matched Edge Bands Table */}
                    {resolvedLamination && (
                        <div style={{
                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                            padding: '1.5rem 2rem', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                Step 2: Matched Edge Bands for Lamination ({resolvedLamination.code})
                            </h3>

                            {matchedEdgeBands.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                                    No matched edge bands linked in library for this lamination code.
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                                            <th style={{ padding: '10px 14px', width: '40px' }}></th>
                                            <th style={{ padding: '10px 16px', textAlign: 'left' }}>Brand</th>
                                            <th style={{ padding: '10px 16px', textAlign: 'left' }}>Edge Band Code</th>
                                            <th style={{ padding: '10px 16px', textAlign: 'left' }}>Name / Finish</th>
                                            <th style={{ padding: '10px 16px', textAlign: 'center' }}>Match %</th>
                                            <th style={{ padding: '10px 16px', textAlign: 'right' }}>Live Stock (m)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matchedEdgeBands.map(m => {
                                            const key = m.edgeBandItemId || m.matchId;
                                            const isSelected = selectedBandIds.has(key);
                                            return (
                                                <tr
                                                    key={key}
                                                    onClick={() => handleToggleBandSelect(key)}
                                                    style={{
                                                        borderTop: '1px solid #f1f5f9',
                                                        background: isSelected ? '#f5f3ff' : 'white',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleToggleBandSelect(key)}
                                                            style={{ accentColor: '#4f46e5', cursor: 'pointer' }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#1e293b' }}>{m.brand}</td>
                                                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>{m.code}</td>
                                                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{m.name} ({m.color || '—'})</td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                            {m.matchPercent}% match
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: m.stockQtyM > 0 ? '#166534' : '#dc2626' }}>
                                                        {m.stockQtyM}m ({m.stockStatus})
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Step 3: Fixed Dimensions & Quantities Component */}
                    {selectedBandsArray.length > 0 && (
                        <div style={{
                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                            padding: '1.5rem 2rem', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                Step 3: Enter Dimension Quantities
                            </h3>

                            <EdgeBandDimensions
                                selectedBands={selectedBandsArray}
                                quantities={quantities}
                                setQuantities={setQuantities}
                                onDeselect={(id) => handleToggleBandSelect(id)}
                            />

                            {/* Add to Staged List button */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={handleAddCurrentToStaged}
                                    style={{
                                        background: '#4f46e5', color: 'white', border: 'none',
                                        borderRadius: '12px', padding: '10px 24px', fontSize: '0.88rem',
                                        fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                                    }}
                                >
                                    <Plus size={18} /> Add Selection to Project List (Cart)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Staged Project Selections List (Cart) */}
                    {stagedItems.length > 0 && (
                        <div style={{
                            background: 'white', border: '2px solid #6366f1', borderRadius: '20px',
                            padding: '1.5rem 2rem', boxShadow: '0 8px 30px rgba(99, 102, 241, 0.12)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ShoppingBag size={20} color="#4f46e5" />
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                        Staged Project Selections ({stagedItems.length} items ready to submit)
                                    </h3>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                    You can look up more lamination codes above and keep adding them here!
                                </span>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
                                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Lamination Brand & Code</th>
                                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Matched Edge Band</th>
                                        <th style={{ padding: '10px 16px', textAlign: 'center' }}>Match %</th>
                                        <th style={{ padding: '10px 16px', textAlign: 'left' }}>Dimension</th>
                                        <th style={{ padding: '10px 16px', textAlign: 'right' }}>Qty</th>
                                        <th style={{ padding: '10px 14px', width: '40px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stagedItems.map((item) => (
                                        <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                                                {item.laminationBrand} <span style={{ fontFamily: 'monospace', color: '#64748b' }}>({item.laminationCode})</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontWeight: 800, color: '#4f46e5' }}>
                                                {item.brand} <span style={{ fontFamily: 'monospace' }}>{item.matchedCode}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <span style={{ padding: '2px 8px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                    {item.matchPercentage}%
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#475569' }}>
                                                {item.dimension?.replace('x', ' × ') || '22 × 0.8'}
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                                {item.quantity}
                                            </td>
                                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleRemoveStagedItem(item.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* One Click Submit All Staged Button */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={handleOneClickSubmit}
                                    disabled={submittingReq}
                                    style={{
                                        background: '#059669', color: 'white', border: 'none',
                                        borderRadius: '12px', padding: '12px 28px', fontSize: '0.92rem',
                                        fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
                                    }}
                                >
                                    <Send size={18} /> {submittingReq ? 'Submitting All...' : `🚀 Submit All ${stagedItems.length} Selection(s) to Manager`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: REQUEST HISTORY & APPROVAL STATUS */}
            {activeTab === 'history' && (
                <div style={{
                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
                    padding: '1.5rem 2rem', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.06)'
                }}>
                    <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Submitted Edge Band Requests & Approval Pipeline ({allRequests.length})
                    </h3>

                    {allRequests.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                            No requests submitted yet for this project.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {allRequests.map(req => (
                                <div key={req._id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                                    <div style={{
                                        background: '#f8fafc', padding: '12px 18px', borderBottom: '1px solid #e2e8f0',
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
                                                <span style={{ padding: '4px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                    ⏳ Pending Manager Review
                                                </span>
                                            )}
                                            {req.status === 'pending_admin' && (
                                                <span style={{ padding: '4px 12px', background: '#e0e7ff', color: '#3730a3', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                    🛡️ Manager Approved — Pending Admin
                                                </span>
                                            )}
                                            {req.status === 'approved' && (
                                                <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                    ✅ Approved & Released to Procurement
                                                </span>
                                            )}
                                            {req.status === 'rejected' && (
                                                <span style={{ padding: '4px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                    ❌ Recheck Requested by Manager
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {req.managerNote && (
                                        <div style={{ background: '#fffbeb', padding: '8px 18px', borderBottom: '1px solid #fde68a', fontSize: '0.82rem', color: '#92400e' }}>
                                            <strong>Manager Note:</strong> {req.managerNote}
                                        </div>
                                    )}

                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ background: '#fafafa', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Brand</th>
                                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Lamination Code</th>
                                                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Matched Edge Band Code</th>
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
                                                    <td style={{ padding: '8px 16px', fontFamily: 'monospace', color: '#475569' }}>{item.dimension?.replace('x', ' × ') || '22 × 0.8'}</td>
                                                    <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EdgeBandPage;
