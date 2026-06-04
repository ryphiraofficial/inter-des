import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './SdcnSelect.css';

const SdcnSelect = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div className="sdcn-select" ref={ref}>
            <button
                type="button"
                className={`sdcn-select-trigger ${!selected ? 'placeholder' : ''}`}
                onClick={() => setOpen(o => !o)}
            >
                <span className="sdcn-select-value">{selected ? selected.label : (placeholder || 'Select…')}</span>
                <ChevronDown size={15} className={`sdcn-select-chevron ${open ? 'open' : ''}`} />
            </button>

            {open && (
                <div className="sdcn-select-content">
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`sdcn-select-item ${opt.value === value ? 'selected' : ''}`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                        >
                            <span>{opt.label}</span>
                            {opt.value === value && <Check size={14} className="sdcn-select-check" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SdcnSelect;
