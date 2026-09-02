import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import Skeleton from '../../components/Skeleton';

const KPICard = ({ title, value, icon: Icon, color, bgColor, loading, details = [], trend = null, sparkData = [] }) => {
    if (loading) {
        return (
            <div className="kpi-card loading" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div className="kpi-header">
                    <div className="kpi-info">
                        <Skeleton width="80px" height="14px" />
                        <div style={{ marginTop: '12px' }}>
                            <Skeleton width="120px" height="32px" />
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Skeleton width="100%" height="40px" />
                </div>
                <div className="kpi-details" style={{ borderTop: 'none', marginTop: '15px' }}>
                    <Skeleton width="45%" height="20px" />
                    <Skeleton width="45%" height="20px" />
                </div>
            </div>
        );
    }

    const sparkId = `colorSpark-${title.replace(/\s+/g, '')}`;

    return (
        <div className="kpi-card" style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div className="kpi-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div className="kpi-info" style={{ width: '100%' }}>
                    <h3 className="kpi-title" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{title}</h3>
                    <div className="kpi-value-row" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                        <span className="kpi-value" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{value}</span>
                        {trend && (
                            <span className={`kpi-trend ${trend.type}`} style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                                background: trend.type === 'positive' ? '#f0fdf4' : trend.type === 'negative' ? '#fef2f2' : '#f8fafc',
                                color: trend.type === 'positive' ? '#15803d' : trend.type === 'negative' ? '#b91c1c' : '#64748b',
                                border: `1px solid ${trend.type === 'positive' ? '#bbf7d0' : trend.type === 'negative' ? '#fecaca' : '#e2e8f0'}`
                            }}>
                                {trend.type === 'positive' && <ArrowUpRight size={13} />}
                                {trend.type === 'negative' && <ArrowDownRight size={13} />}
                                {trend.type === 'neutral' && <Minus size={13} />}
                                {trend.value}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="kpi-sparkline" style={{ height: '36px', width: '100%', marginTop: '6px', outline: 'none', border: 'none', pointerEvents: 'none', userSelect: 'none' }}>
                {sparkData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={sparkData} style={{ outline: 'none', border: 'none' }}>
                            <defs>
                                <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                fill={`url(#${sparkId})`}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {details.length > 0 && (
                <div className="kpi-details">
                    {details.map((item, index) => (
                        <div key={index} className="kpi-detail-item">
                            <span className="dot" style={{ backgroundColor: item.color }}></span>
                            <span>{item.label}: {item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KPICard;
