import React from 'react';
import { CheckCircle } from 'lucide-react';

const HandoffEmptyState = () => {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ color: '#1e293b', fontSize: '1.25rem', marginBottom: '0.5rem' }}>You're all caught up!</h3>
            <p style={{ color: '#64748b' }}>There are no pending project handoffs requiring your attention right now.</p>
        </div>
    );
};

export default HandoffEmptyState;
