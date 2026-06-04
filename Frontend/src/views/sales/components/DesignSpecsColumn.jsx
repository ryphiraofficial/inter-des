import React from 'react';
import { Package, MessageSquare, Clipboard } from 'lucide-react';

const DesignSpecsColumn = ({ notes, items }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Designer Notes */}
            <div style={{ 
                background: '#ffffff', 
                borderRadius: '20px', 
                padding: '1.5rem', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', letterSpacing: '-0.1px' }}>
                    <MessageSquare size={16} /> Designer Notes
                </h3>
                <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem', 
                    color: '#475569', 
                    lineHeight: '1.6', 
                    background: '#f8fafc', 
                    padding: '12px 16px', 
                    borderRadius: '12px',
                    borderLeft: '3px solid #6366f1' 
                }}>
                    {notes}
                </p>
            </div>

            {/* Item Specifications */}
            <div style={{ 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '20px', 
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', letterSpacing: '-0.1px' }}>
                    <Package size={16} color="#6366f1" /> Item Specifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {items.map((item, i) => (
                        <div key={i} style={{ 
                            background: '#f8fafc', 
                            padding: '12px 16px', 
                            borderRadius: '12px', 
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clipboard size={14} color="#94a3b8" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                                    {item.name}
                                </span>
                            </div>
                            <span style={{ 
                                background: '#eef2ff', 
                                color: '#6366f1', 
                                fontSize: '0.8rem', 
                                fontWeight: 700, 
                                padding: '3px 10px', 
                                borderRadius: '8px',
                                border: '1px solid #c7d2fe'
                            }}>
                                {item.quantity} {item.unit}
                            </span>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div style={{ 
                            color: '#94a3b8', 
                            fontSize: '0.85rem', 
                            textAlign: 'center', 
                            padding: '2rem 1rem', 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '12px'
                        }}>
                            <Package size={20} strokeWidth={1.5} />
                            <span>No item list provided.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesignSpecsColumn;
