import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ADVANCE_OPTIONS = [10, 20, 25, 30, 40, 50];

// Summary card — project/client/total/advance
export const ProjectSummaryCard = ({ paymentTask, quotTotal, calcAmt }) => (
    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px' }}>
            {[
                { label: 'Project',          value: paymentTask.title },
                { label: 'Client',           value: paymentTask.client?.name || 'N/A' },
                { label: 'Quotation Total',  value: `₹${quotTotal.toLocaleString('en-IN')}`, bold: true },
                { label: 'Advance to Collect', value: `₹${calcAmt.toLocaleString('en-IN')}`, green: true },
            ].map(({ label, value, bold, green }) => (
                <div key={label}>
                    <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ margin: 0, fontWeight: bold || green ? (green ? 700 : 600) : 500, color: green ? '#10b981' : '#0f172a', fontSize: bold || green ? '14px' : '13px' }}>{value}</p>
                </div>
            ))}
        </div>
    </div>
);

// Advance percentage pill selector
export const AdvancePctSelector = ({ advancePct, setAdvancePct }) => (
    <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>
            Advance Percentage (Locked for Accounts Manager)
        </label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {ADVANCE_OPTIONS.map(pct => (
                <button key={pct} onClick={() => setAdvancePct(pct)}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: `1px solid ${advancePct === pct ? '#0f172a' : '#e2e8f0'}`, background: advancePct === pct ? '#0f172a' : 'white', color: advancePct === pct ? 'white' : '#475569', fontWeight: 500, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {pct}%
                </button>
            ))}
        </div>
        <span style={{ display: 'flex', margin: '6px 0 0', fontSize: '11px', color: '#64748b', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
            This percentage will be locked for the Accounts department
        </span>
    </div>
);
