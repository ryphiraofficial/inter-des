import React from 'react';
import { Search, Loader } from 'lucide-react';

const EdgeBandSearch = ({ brands, brand, setBrand, code, setCode, loading }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', alignItems: 'end', marginBottom: '1.5rem' }}>
        {/* Brand */}
        <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Brand
            </label>
            <select
                value={brand}
                onChange={e => setBrand(e.target.value)}
                style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', fontSize: '0.9rem',
                    background: 'white', color: '#1e293b', cursor: 'pointer',
                    outline: 'none', appearance: 'auto'
                }}
            >
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
        </div>

        {/* Code input */}
        <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Edge Band Code
            </label>
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Enter code to search…"
                    style={{
                        width: '100%', padding: '10px 12px 10px 36px',
                        borderRadius: '10px', border: '1.5px solid #e2e8f0',
                        fontSize: '0.9rem', color: '#1e293b', outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#4f46e5'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                {loading && <Loader size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', animation: 'spin 1s linear infinite' }} />}
            </div>
        </div>
    </div>
);

export default EdgeBandSearch;
