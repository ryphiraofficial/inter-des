import React, { useState } from 'react';
import { ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export const ShadSelect = ({ label, value, options, onChange, placeholder, error }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="site-form-group" style={{ position: 'relative' }}>
            <label className="shad-form-label">{label}</label>
            <div className={`shad-select-trigger ${error ? 'site-input-err' : ''}`} onClick={() => setOpen(!open)}>
                <span>{options.find(o => o.id === value || o === value)?.name || options.find(o => o.id === value || o === value) || placeholder}</span>
                <ChevronRight size={14} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />
            </div>
            {open && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
                    <div className="shad-popover">
                        {options.map(o => (
                            <div key={o.id || o} className={`shad-select-item ${value === (o.id || o) ? 'active' : ''}`}
                                onClick={() => { onChange(o.id || o); setOpen(false); }}>
                                {o.name || o}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {error && <span className="site-field-err">{error}</span>}
        </div>
    );
};

export const ShadCalendar = ({ label, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const date = new Date(value);

    return (
        <div className="site-form-group" style={{ position: 'relative' }}>
            <label className="shad-form-label">{label}</label>
            <div className="shad-date-trigger" onClick={() => setOpen(!open)}>
                <span>{format(date, 'PPP')}</span>
                <CalendarIcon size={14} style={{ color: '#94a3b8' }} />
            </div>
            {open && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
                    <div className="shad-popover" style={{ width: 'max-content', minWidth: 'auto' }}>
                        <div className="shad-calendar">
                            <div className="shad-cal-header">
                                <span className="shad-cal-month">{format(date, 'MMMM yyyy')}</span>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button type="button" className="site-filter-toggle" style={{ padding: 4 }}><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                                    <button type="button" className="site-filter-toggle" style={{ padding: 4 }}><ChevronRight size={14} /></button>
                                </div>
                            </div>
                            <div className="shad-cal-grid">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="shad-cal-day-label">{d}</div>)}
                                {[...Array(30)].map((_, i) => (
                                    <div key={i} className={`shad-cal-day ${i + 1 === date.getDate() ? 'selected' : ''}`}
                                        onClick={() => {
                                            const newDate = new Date(date);
                                            newDate.setDate(i + 1);
                                            onChange(format(newDate, 'yyyy-MM-dd'));
                                            setOpen(false);
                                        }}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="site-filter-chip" onClick={() => { onChange(format(new Date(), 'yyyy-MM-dd')); setOpen(false); }}>Today</button>
                                <button type="button" className="site-filter-chip" onClick={() => setOpen(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
