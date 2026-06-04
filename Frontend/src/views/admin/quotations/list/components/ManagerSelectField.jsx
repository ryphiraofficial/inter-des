import React from 'react';
import { UserCheck } from 'lucide-react';

const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px'
};

const ManagerSelectField = ({ designManagers, selectedManagerId, setSelectedManagerId }) => (
    <div style={{ marginBottom: '24px' }}>
        <label htmlFor="designManager" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
            Assign Design Manager <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
            <select
                id="designManager"
                required
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                style={selectStyle}
                onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
            >
                <option value="">-- Choose a Design Manager --</option>
                {designManagers.map(m => (
                    <option key={m._id} value={m._id}>{m.fullName} ({m.email})</option>
                ))}
            </select>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck size={14} style={{ color: '#4f46e5' }} />
            This assignment is mandatory to approve the quotation and release to design.
        </p>
    </div>
);

export default ManagerSelectField;
