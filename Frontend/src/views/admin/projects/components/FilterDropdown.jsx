import React from 'react';
import { SlidersHorizontal, ChevronDown, CheckCircle } from 'lucide-react';

/**
 * Generic filter dropdown used by ProjectFilterBar.
 * Renders a trigger button + a popup list of options.
 */
const FilterDropdown = ({ label, value, isOpen, setOpen, closeOthers, options, onChange, rotateIcon = false }) => {
    const isActive = value && value !== 'none';
    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => { closeOthers(); setOpen(p => !p); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 14px', borderRadius: '8px', height: '42px',
                    border: '1px solid #e2e8f0',
                    background: isActive ? '#eef2ff' : '#fff',
                    color: isActive ? '#4f46e5' : '#64748b',
                    fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
            >
                <SlidersHorizontal size={15} style={rotateIcon ? { transform: 'rotate(90deg)' } : {}} />
                {label}
                <ChevronDown size={14} style={{ opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isOpen && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
                    <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '160px', padding: '4px' }}>
                        {options.map(opt => (
                            <button key={opt.value}
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className="dropdown-item"
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 10px', borderRadius: '7px', border: 'none', background: value === opt.value ? '#f1f5f9' : 'transparent', color: value === opt.value ? '#0f172a' : '#475569', fontWeight: value === opt.value ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}
                            >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                                {opt.label}
                                {value === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterDropdown;
