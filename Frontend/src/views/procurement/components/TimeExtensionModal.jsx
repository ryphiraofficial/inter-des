import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Calendar as CalendarIcon } from 'lucide-react';
import 'react-day-picker/style.css';

const TimeExtensionModal = ({ 
    isOpen, 
    onClose, 
    extensionDate, 
    setExtensionDate, 
    extensionReason, 
    setExtensionReason, 
    onSubmit 
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const popoverRef = useRef(null);
    const dateBtnRef = useRef(null);

    // Click outside to close calendar popover
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                dateBtnRef.current && !dateBtnRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };
        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCalendarOpen]);

    if (!isOpen) return null;

    const selectedDate = extensionDate ? new Date(extensionDate) : undefined;

    const handleSelectDate = (date) => {
        if (date) {
            // Convert to local YYYY-MM-DD to preserve expected format
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset*60*1000));
            setExtensionDate(localDate.toISOString().split('T')[0]);
        } else {
            setExtensionDate('');
        }
        setIsCalendarOpen(false);
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={onClose}>
            <div className="modal-content fade-in" style={{ background: 'white', width: '100%', maxWidth: '420px', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>Request Time Extension</h3>
                    <button style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', transition: 'all 0.2s' }} onClick={onClose} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>×</button>
                </div>
                <div className="modal-body">
                    <div className="form-group" style={{ marginBottom: '1.25rem', position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Requested Date</label>
                        
                        <button 
                            ref={dateBtnRef}
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            style={{ 
                                width: '100%', padding: '10px 14px', borderRadius: '8px', 
                                border: '1px solid #e2e8f0', background: 'white', 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                cursor: 'pointer', color: selectedDate ? '#0f172a' : '#94a3b8',
                                fontSize: '0.9rem', transition: 'border-color 0.2s',
                                fontFamily: 'inherit'
                            }}
                        >
                            <span>{selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}</span>
                            <CalendarIcon size={16} color="#64748b" />
                        </button>

                        {isCalendarOpen && (
                            <div 
                                ref={popoverRef}
                                style={{ 
                                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px',
                                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                                    padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    zIndex: 50, animation: 'slideDown 0.2s ease-out',
                                    maxWidth: '100vw'
                                }}
                            >
                                <style>{`
                                    .rdp-root { --rdp-accent-color: #f59e0b; margin: 0; }
                                    .rdp-day_selected { font-weight: bold; }
                                    @media (max-width: 400px) {
                                        .rdp-root { --rdp-cell-size: 32px; }
                                    }
                                `}</style>
                                <DayPicker 
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleSelectDate}
                                    showOutsideDays
                                    className="p-3"
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason</label>
                        <textarea 
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.9rem', color: '#0f172a', resize: 'none', transition: 'border-color 0.2s' }}
                            rows="4"
                            value={extensionReason}
                            onChange={(e) => setExtensionReason(e.target.value)}
                            placeholder="Why is more time needed?"
                            onFocus={e => e.target.style.borderColor = '#cbd5e1'}
                            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        ></textarea>
                    </div>
                    <button 
                        style={{ width: '100%', padding: '12px', background: (!extensionDate || !extensionReason) ? '#fcd34d' : '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: (!extensionDate || !extensionReason) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                        onClick={onSubmit}
                        disabled={!extensionDate || !extensionReason}
                        onMouseEnter={e => { if(!e.target.disabled) e.target.style.background = '#d97706' }}
                        onMouseLeave={e => { if(!e.target.disabled) e.target.style.background = '#f59e0b' }}
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeExtensionModal;
