import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useDateFilter } from '../../context/DateFilterContext';

const PRESETS = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'prev_month', label: 'Previous Month' },
    { id: 'this_quarter', label: 'This Quarter' },
    { id: 'this_fy', label: 'This Financial Year' },
    { id: 'all_time', label: 'All Time' },
];

export const DateFilterDropdown = ({ value, onChange }) => {
    const context = useDateFilter();
    
    // Controlled or context state
    const currentPreset = value?.preset || context.preset || 'this_month';
    const currentRange = value?.range || context.customRange || { from: undefined, to: undefined };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(currentPreset);
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customRange, setCustomRange] = useState(currentRange);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelectedPreset(currentPreset);
    }, [currentPreset]);

    useEffect(() => {
        setCustomRange(currentRange);
    }, [currentRange]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsCustomMode(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectPreset = (presetId) => {
        setSelectedPreset(presetId);
        setIsCustomMode(false);
        setIsOpen(false);
        if (onChange) {
            onChange({ preset: presetId, range: null });
        } else if (context.setDateFilter) {
            context.setDateFilter({ preset: presetId, range: null });
        }
    };

    const handleApplyCustomRange = () => {
        if (customRange?.from) {
            setSelectedPreset('custom');
            setIsOpen(false);
            if (onChange) {
                onChange({ preset: 'custom', range: customRange });
            } else if (context.setDateFilter) {
                context.setDateFilter({ preset: 'custom', range: customRange });
            }
        }
    };

    // Formatted display label for the button
    const getDisplayLabel = () => {
        if (selectedPreset === 'custom' && customRange?.from) {
            const fromStr = customRange.from.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            const toStr = customRange.to ? customRange.to.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
            return toStr ? `${fromStr} – ${toStr}` : fromStr;
        }

        const presetObj = PRESETS.find(p => p.id === selectedPreset);
        if (presetObj) return presetObj.label;
        return 'This Month';
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: isOpen ? '#eff6ff' : '#ffffff',
                    border: isOpen ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: isOpen ? '#2563eb' : '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                }}
            >
                <CalendarIcon size={14} color="#2563eb" />
                <span>{getDisplayLabel()}</span>
                <ChevronDown size={13} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {/* Shadcn-Style Floating Dropdown Popover */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 9999,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)',
                    minWidth: isCustomMode ? '310px' : '200px',
                    padding: '6px',
                    animation: 'fadeIn 0.15s ease-out'
                }}>
                    {!isCustomMode ? (
                        /* Preset Options */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ padding: '6px 10px 4px', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Filter Period
                            </div>
                            {PRESETS.map((p) => {
                                const isSelected = selectedPreset === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleSelectPreset(p.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px 10px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: isSelected ? '#eff6ff' : 'transparent',
                                            color: isSelected ? '#2563eb' : '#334155',
                                            fontSize: '0.82rem',
                                            fontWeight: isSelected ? 700 : 500,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'background-color 0.1s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <span>{p.label}</span>
                                        {isSelected && <Check size={14} color="#2563eb" />}
                                    </button>
                                );
                            })}

                            <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

                            <button
                                type="button"
                                onClick={() => setIsCustomMode(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: selectedPreset === 'custom' ? '#eff6ff' : 'transparent',
                                    color: selectedPreset === 'custom' ? '#2563eb' : '#334155',
                                    fontSize: '0.82rem',
                                    fontWeight: selectedPreset === 'custom' ? 700 : 500,
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedPreset !== 'custom') e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedPreset !== 'custom') e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span>Custom Date Range...</span>
                                <ArrowRight size={13} color="#94a3b8" />
                            </button>
                        </div>
                    ) : (
                        /* Calendar Mode */
                        <div style={{ padding: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCustomMode(false)}
                                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                >
                                    ← Back to Presets
                                </button>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Select Range</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <DayPicker
                                    mode="range"
                                    selected={customRange}
                                    onSelect={setCustomRange}
                                    style={{ margin: 0 }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCustomMode(false)}
                                    style={{
                                        flex: 1,
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        background: '#ffffff',
                                        color: '#64748b',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApplyCustomRange}
                                    disabled={!customRange?.from}
                                    style={{
                                        flex: 1,
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: customRange?.from ? '#2563eb' : '#cbd5e1',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: customRange?.from ? 'pointer' : 'not-allowed',
                                        boxShadow: customRange?.from ? '0 2px 6px rgba(37, 99, 235, 0.2)' : 'none'
                                    }}
                                >
                                    Apply Range
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DateFilterDropdown;
