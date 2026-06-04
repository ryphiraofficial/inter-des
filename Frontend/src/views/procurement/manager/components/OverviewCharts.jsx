import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewCharts = ({ performanceData, chartData, materialRequests }) => {
    return (
        <div className="premium-chart-grid">
            <div className="premium-chart-card">
                <div className="chart-header">
                    <h4 className="chart-title">Pipeline Velocity</h4>
                    <span className="banner-pill" style={{ margin: 0, border: '1px solid #e7e5e4', background: 'transparent' }}>7 Days</span>
                </div>
                <div style={{ height: '280px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1c1917" stopOpacity={0.08}/>
                                    <stop offset="95%" stopColor="#1c1917" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a8a29e', fontWeight: 400 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a8a29e', fontWeight: 400 }} dx={-10} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: '1px solid #f5f5f4', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', padding: '12px', fontWeight: 400, fontSize: '13px' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#1c1917" strokeWidth={1.5} fillOpacity={1} fill="url(#colorVelocity)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="premium-chart-card">
                <div className="chart-header">
                    <h4 className="chart-title">Status Distribution</h4>
                </div>
                <div style={{ height: '280px', width: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[{ value: 1 }]}
                                innerRadius={75}
                                outerRadius={95}
                                fill="#f5f5f4"
                                stroke="none"
                                dataKey="value"
                                isAnimationActive={false}
                            />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={95}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: '1px solid #f5f5f4', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', fontWeight: 400, fontSize: '13px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 300, color: '#1c1917', letterSpacing: '-0.02em' }}>{materialRequests.length}</div>
                        <div style={{ fontSize: '0.7rem', color: '#78716c', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewCharts;
