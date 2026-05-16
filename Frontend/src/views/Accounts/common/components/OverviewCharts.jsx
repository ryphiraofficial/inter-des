import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '../../components/UI/Skeleton';

const OverviewCharts = ({ loading, cashFlowData, invoiceStatusData }) => {
    return (
        <div className="charts-grid-3">
            <div className="card-v3 main-chart-card">
                <div className="card-header-v3"><h3>Cash Flow Projection</h3></div>
                <div style={{ width: '100%', height: '220px' }}>
                    {loading ? <Skeleton width="100%" height="100%" /> : (
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
                    )}
                </div>
            </div>

            <div className="card-v3">
                <div className="card-header-v3"><h3>Invoice Status</h3></div>
                <div style={{ height: '220px' }}>
                    {loading ? <Skeleton width="100%" height="100%" /> : invoiceStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={invoiceStatusData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                    {invoiceStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <div className="empty-chart-text">No data</div>}
                </div>
            </div>
        </div>
    );
};

export default OverviewCharts;
