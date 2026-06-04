import React from 'react';
import { CheckCircle } from 'lucide-react';

const CompletionHeader = () => {
    return (
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '32px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <CheckCircle size={28} />
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Project Completion</h1>
            </div>
            <p style={{ margin: 0, opacity: 0.9 }}>Finalize and close out the project</p>
        </div>
    );
};

export default CompletionHeader;
