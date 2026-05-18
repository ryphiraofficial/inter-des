import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, CheckCircle } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const CustomDatePicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = value ? new Date(value + 'T00:00:00') : new Date();
    const [view, setView] = useState({ month: selected.getMonth(), year: selected.getFullYear() });

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const prevMonth = () => setView(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year });
    const nextMonth = () => setView(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year });

    const selectDay = (d) => {
        const mm = String(view.month + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        onChange(`${view.year}-${mm}-${dd}`);
        setOpen(false);
    };

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="custom-picker-btn"
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                    background: '#fff', fontSize: '14px', cursor: 'pointer', color: value ? '#0f172a' : '#94a3b8',
                    fontWeight: value ? 500 : 400, textAlign: 'left', boxSizing: 'border-box'
                }}
            >
                <Calendar size={15} style={{ color: '#6366f1', flexShrink: 0 }} />
                {value ? new Date(value + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select date'}
            </button>
            {open && (
                <div className="custom-picker-dropdown" style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15)', zIndex: 9999,
                    padding: '16px', width: '280px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <button type="button" onClick={prevMonth} className="p-1 rounded bg-slate-100"><ChevronLeft size={16} /></button>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{MONTHS[view.month]} {view.year}</span>
                        <button type="button" onClick={nextMonth} className="p-1 rounded bg-slate-100"><ChevronRight size={16} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
                        {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{d}</div>)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                        {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                            const isSel = value && new Date(value + 'T00:00:00').getDate() === d && new Date(value + 'T00:00:00').getMonth() === view.month;
                            return (
                                <button key={d} type="button" onClick={() => selectDay(d)}
                                    style={{
                                        width: '100%', aspectRatio: '1', border: 'none', borderRadius: '6px',
                                        cursor: 'pointer', fontSize: '13px', 
                                        background: isSel ? '#6366f1' : 'transparent',
                                        color: isSel ? '#fff' : '#334155'
                                    }}
                                >{d}</button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected = options.find(o => (o.value ?? o) === value);
    const label = selected ? (selected.label ?? (typeof selected === 'object' ? (selected.value ?? '') : selected)) : placeholder;

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                    background: '#fff', fontSize: '14px', cursor: 'pointer',
                    color: value ? '#0f172a' : '#94a3b8', fontWeight: value ? 500 : 400,
                    textAlign: 'left', boxSizing: 'border-box', justifyContent: 'space-between'
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={15} style={{ color: '#6366f1', flexShrink: 0 }} />}
                    {label}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none' }} />
            </button>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 9999, padding: '4px'
                }}>
                    {options.map(opt => {
                        const v = opt.value ?? opt;
                        const l = opt.label ?? (typeof opt === 'object' ? (opt.value ?? '') : opt);
                        const isActive = v === value;
                        return (
                            <button key={v} type="button"
                                onClick={() => { onChange(v); setOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    width: '100%', padding: '9px 10px', borderRadius: '7px',
                                    border: 'none', background: isActive ? '#f1f5f9' : 'transparent',
                                    color: isActive ? '#0f172a' : '#475569',
                                    fontWeight: isActive ? 700 : 500, fontSize: '14px', cursor: 'pointer', textAlign: 'left'
                                }}
                            >
                                {opt.dot && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot }} />}
                                {l}
                                {isActive && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#6366f1' }} />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
