import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

/**
 * Shadcn-style Time Picker
 * Returns time as "HH:MM" in 24h format internally.
 * Shows 12h scroll UI with AM/PM.
 *
 * Props:
 *   value    — "HH:MM" string (24h)
 *   onChange — called with "HH:MM" (24h)
 */

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));   // 01–12
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));        // 00–59
const PERIODS  = ['AM', 'PM'];

function parse24h(val) {
    if (!val || !val.includes(':')) return { h12: '12', min: '00', period: 'AM' };
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr, 10);
    const min = mStr?.slice(0, 2).padStart(2, '0') || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h = h - 12;
    return { h12: String(h).padStart(2, '0'), min, period };
}

function to24h(h12Str, minStr, period) {
    let h = parseInt(h12Str, 10);
    if (period === 'AM') {
        if (h === 12) h = 0;
    } else {
        if (h !== 12) h = h + 12;
    }
    return `${String(h).padStart(2, '0')}:${minStr}`;
}

const ScrollColumn = ({ items, selected, onSelect }) => {
    const listRef = useRef(null);
    const ITEM_H = 36;

    // Scroll selected into center on mount and selection change
    useEffect(() => {
        const idx = items.indexOf(selected);
        if (idx < 0 || !listRef.current) return;
        listRef.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
    }, [selected, items]);

    return (
        <div
            ref={listRef}
            style={{
                height: ITEM_H * 5,
                overflowY: 'auto',
                scrollSnapType: 'y mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
            className="scroll-column"
        >
            {items.map(item => (
                <div
                    key={item}
                    onClick={() => onSelect(item)}
                    style={{
                        height: ITEM_H,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: selected === item ? 700 : 400,
                        color: selected === item ? '#fff' : '#374151',
                        background: selected === item ? '#6366f1' : 'transparent',
                        scrollSnapAlign: 'start',
                        transition: 'background 0.15s, color 0.15s',
                        userSelect: 'none',
                        flexShrink: 0,
                    }}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};

export const TimePicker = ({ value, onChange, required }) => {
    const { h12, min, period } = parse24h(value);
    const [open, setOpen]   = useState(false);
    const wrapRef           = useRef(null);

    const handleH   = (v) => onChange(to24h(v, min, period));
    const handleMin = (v) => onChange(to24h(h12, v, period));
    const handlePer = (v) => onChange(to24h(h12, min, v));

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const displayTime = value && value.includes(':')
        ? (() => {
            const { h12: dh, min: dm, period: dp } = parse24h(value);
            return `${dh}:${dm} ${dp}`;
          })()
        : 'Pick a time';

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            {/* Trigger */}
            <button
                type="button"
                className={`sdcn-date-trigger ${!value ? 'placeholder' : ''}`}
                onClick={() => setOpen(v => !v)}
            >
                <Clock size={15} style={{ flexShrink: 0 }} />
                {displayTime}
            </button>

            {/* Popover */}
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        zIndex: 201,
                        background: '#fff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                        padding: '12px 8px',
                        display: 'flex',
                        gap: 4,
                        alignItems: 'center',
                        minWidth: 180,
                        animation: 'modal-in 0.15s ease',
                    }}
                >
                    {/* Hours */}
                    <div style={{ flex: 1 }}>
                        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 6 }}>HH</div>
                        <ScrollColumn items={HOURS} selected={h12} onSelect={handleH} />
                    </div>

                    {/* Separator */}
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', paddingBottom: 4 }}>:</div>

                    {/* Minutes */}
                    <div style={{ flex: 1 }}>
                        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', marginBottom: 6 }}>MM</div>
                        <ScrollColumn items={MINUTES} selected={min} onSelect={handleMin} />
                    </div>

                    {/* Separator */}
                    <div style={{ width: 8 }} />

                    {/* AM / PM */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 22 }}>
                        {PERIODS.map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handlePer(p)}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 8,
                                    border: 'none',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    background: period === p ? '#6366f1' : '#f1f5f9',
                                    color: period === p ? '#fff' : '#64748b',
                                    transition: 'background 0.15s',
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
