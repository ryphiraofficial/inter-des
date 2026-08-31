import React from 'react';
import { Search, Loader } from 'lucide-react';

const EdgeBandSearch = ({ code, setCode, loading }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Edge Band Code / Hexcode Search
        </label>
        <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
            <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter edge band code or hexcode to search across brands…"
                style={{
                    width: '100%', padding: '12px 14px 12px 42px',
                    borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', outline: 'none',
                    boxSizing: 'border-box', background: '#f8fafc',
                    transition: 'all 0.2s ease', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                }}
                onFocus={e => {
                    e.target.style.borderColor = '#4f46e5';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.12)';
                }}
                onBlur={e => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
                }}
            />
            {loading && <Loader size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', animation: 'spin 1s linear infinite' }} />}
        </div>
    </div>
);

export default EdgeBandSearch;

