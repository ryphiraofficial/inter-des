import React, { useState, useRef, useEffect } from 'react';
import './DateRangePicker.css';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS   = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

const toYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const parseLocal = (s) => {
    if (!s) return null;
    const [y,m,d] = s.split('-').map(Number);
    return new Date(y, m-1, d);
};

const fmtDisplay = (s) => {
    if (!s) return '';
    return parseLocal(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
};

function buildCells(year, month) {
    const firstDay   = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const cells = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

function Calendar({ year, month, from, to, hover, onSelect, onHover, onLeave }) {
    const cells     = buildCells(year, month);
    const fromD     = parseLocal(from);
    const toD       = parseLocal(to);
    const hoverD    = parseLocal(hover);
    const todayStr  = toYMD(new Date());
    const rangeEnd  = toD || hoverD;

    const getClass = (d) => {
        if (!d) return '';
        const dt  = new Date(year, month, d);
        const ymd = toYMD(dt);
        const isStart  = fromD && ymd === toYMD(fromD);
        const isEnd    = toD   && ymd === toYMD(toD);
        const isSingle = isStart && isEnd;
        const inRange  = fromD && rangeEnd && dt > fromD && dt < rangeEnd;
        const isHover  = !toD && hoverD && ymd === toYMD(hoverD);
        const isToday  = ymd === todayStr;

        if (isSingle) return 'sdrp-single';
        if (isStart)  return 'sdrp-start';
        if (isEnd)    return 'sdrp-end';
        if (isHover)  return 'sdrp-hover-end';
        if (inRange)  return 'sdrp-range';
        if (isToday)  return 'sdrp-today';
        return '';
    };

    const rows = [];
    for (let r = 0; r < cells.length / 7; r++) {
        rows.push(cells.slice(r * 7, r * 7 + 7));
    }

    return (
        <table className="sdrp-table" onMouseLeave={onLeave}>
            <thead>
                <tr>
                    {WEEKDAYS.map(w => <th key={w} className="sdrp-th">{w}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, ri) => (
                    <tr key={ri}>
                        {row.map((d, ci) => (
                            <td key={ci} className="sdrp-td">
                                {d && (
                                    <button
                                        className={`sdrp-btn ${getClass(d)}`}
                                        onClick={() => onSelect(new Date(year, month, d))}
                                        onMouseEnter={() => onHover(new Date(year, month, d))}
                                    >
                                        {d}
                                    </button>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function DateRangePicker({ dateFrom, dateTo, onFromChange, onToChange }) {
    const today = new Date();
    const [open, setOpen]     = useState(false);
    const [hover, setHover]   = useState('');
    const [vy, setVy]         = useState(today.getFullYear());
    const [vm, setVm]         = useState(today.getMonth());
    const ref = useRef(null);

    const m2 = vm === 11 ? 0  : vm + 1;
    const y2 = vm === 11 ? vy + 1 : vy;

    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const prev = () => vm === 0 ? (setVy(y => y-1), setVm(11)) : setVm(m => m-1);
    const next = () => vm === 11 ? (setVy(y => y+1), setVm(0)) : setVm(m => m+1);

    const handleSelect = (date) => {
        const ymd = toYMD(date);
        if (!dateFrom || (dateFrom && dateTo)) {
            onFromChange(ymd); onToChange('');
        } else {
            const f = parseLocal(dateFrom);
            if (date < f) { onToChange(dateFrom); onFromChange(ymd); }
            else if (ymd === dateFrom) { onFromChange(''); }
            else { onToChange(ymd); setOpen(false); }
        }
        setHover('');
    };

    const handleHover = (date) => {
        if (dateFrom && !dateTo) setHover(toYMD(date));
    };

    const clear = () => { onFromChange(''); onToChange(''); setHover(''); };

    const hasVal = !!(dateFrom || dateTo);
    const label = dateFrom && dateTo
        ? `${fmtDisplay(dateFrom)} → ${fmtDisplay(dateTo)}`
        : dateFrom ? `${fmtDisplay(dateFrom)} → select end`
        : 'Select date range';

    return (
        <div className="sdrp-root" ref={ref}>

            {/* Trigger */}
            <button
                className={`sdrp-trigger${open ? ' active' : ''}${hasVal ? ' filled' : ''}`}
                onClick={() => setOpen(v => !v)}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sdrp-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>{label}</span>
                {hasVal && (
                    <span className="sdrp-x-btn" onMouseDown={e => { e.stopPropagation(); clear(); }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </span>
                )}
            </button>

            {/* Popover */}
            {open && (
                <div className="sdrp-popover">

                    {/* Two calendars with individual headers */}
                    <div className="sdrp-grids">
                        <div className="sdrp-calendar-container">
                            <div className="sdrp-calendar-header">
                                <button className="sdrp-arrow" onClick={prev} aria-label="Previous month">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                </button>
                                <span className="sdrp-month-title">{MONTHS[vm]} {vy}</span>
                                <div className="sdrp-arrow-placeholder" />
                            </div>
                            <Calendar year={vy} month={vm}
                                from={dateFrom} to={dateTo} hover={hover}
                                onSelect={handleSelect} onHover={handleHover}
                                onLeave={() => setHover('')}
                            />
                        </div>

                        <div className="sdrp-vline" />

                        <div className="sdrp-calendar-container">
                            <div className="sdrp-calendar-header">
                                <div className="sdrp-arrow-placeholder" />
                                <span className="sdrp-month-title">{MONTHS[m2]} {y2}</span>
                                <button className="sdrp-arrow" onClick={next} aria-label="Next month">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </div>
                            <Calendar year={y2} month={m2}
                                from={dateFrom} to={dateTo} hover={hover}
                                onSelect={handleSelect} onHover={handleHover}
                                onLeave={() => setHover('')}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sdrp-footer">
                        <span className="sdrp-hint">
                            {!dateFrom ? 'Select start date' : !dateTo ? 'Now select end date' : '✓ Range selected'}
                        </span>
                        {hasVal && <button className="sdrp-clear" onClick={clear}>Clear</button>}
                    </div>

                </div>
            )}
        </div>
    );
}
