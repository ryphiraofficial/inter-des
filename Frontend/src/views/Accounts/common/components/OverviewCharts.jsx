import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '../../components/UI/Skeleton';

const OverviewCharts = ({ loading, cashFlowData, invoiceStatusData }) => {
    return (
        <div className="charts-grid-3">
            <div className="card-v3 main-chart-card">
                <div className="card-header-v3">
                    <h3>Cash Flow Projection</h3>
                    <div className="chart-toggles" style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div> Income</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Expense</span>
                    </div>
                </div>
                <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                    {loading ? <Skeleton width="100%" height="100%" /> : cashFlowData?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashFlowData}>
                                <defs>
                                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Area type="monotone" dataKey="inflow" name="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorInflow)" strokeWidth={2} />
                                <Area type="monotone" dataKey="outflow" name="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutflow)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                            <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>No financial activity yet</p>
                            <button className="btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('open-create-invoice-modal'))}>Create your first invoice</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="card-v3" style={{ position: 'relative' }}>
                <div className="card-header-v3"><h3>Invoice Status</h3></div>
                <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {loading ? <Skeleton width="100%" height="100%" /> : invoiceStatusData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={invoiceStatusData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                        {invoiceStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{invoiceStatusData.reduce((acc, curr) => acc + curr.value, 0)}</span>
                                <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total</span>
                            </div>
                        </>
                    ) : (
                        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={[{ value: 1 }]} innerRadius={60} outerRadius={80} dataKey="value" fill="#f1f5f9" stroke="none" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>No Data</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewCharts;
