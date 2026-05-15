import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import Skeleton from '../../components/Skeleton';

const KPICard = ({ title, value, icon: Icon, color, bgColor, loading, details = [], trend = null, sparkData = [] }) => {
    if (loading) {
        return (
            <div className="kpi-card loading">
                <div className="kpi-header">
                    <div className="kpi-info">
                        <Skeleton width="80px" height="14px" />
                        <div style={{ marginTop: '12px' }}>
                            <Skeleton width="120px" height="32px" />
                        </div>
                    </div>
                    <Skeleton width="36px" height="36px" borderRadius="10px" />
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
        <div className="kpi-card">
            <div className="kpi-header">
                <div className="kpi-info">
                    <h3 className="kpi-title">{title}</h3>
                    <div className="kpi-value-row">
                        <span className="kpi-value">{value}</span>
                        {trend && (
                            <span className={`kpi-trend ${trend.type}`}>
                                {trend.type === 'positive' && <ArrowUpRight size={14} />}
                                {trend.type === 'negative' && <ArrowDownRight size={14} />}
                                {trend.type === 'neutral' && <Minus size={14} />}
                                {trend.value}
                            </span>
                        )}
                    </div>
                </div>
                <div className="kpi-icon-wrapper" style={{ backgroundColor: bgColor, color: color }}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="kpi-sparkline" style={{ height: '40px', width: '100%', marginTop: '10px' }}>
                {sparkData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData}>
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
