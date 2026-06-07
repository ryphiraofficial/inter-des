import React, { useMemo } from 'react';
import { FileText, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import '../css/ManagerDashboard.css';

const Reports = ({ staffList = [], tasks = [] }) => {
    // Generate report data per staff
    const reportData = useMemo(() => {
        return staffList.map(staff => {
            const staffTasks = tasks.filter(task => 
                task.assignedTo?.some(t => typeof t === 'object' ? t._id === staff._id : t === staff._id)
            );
            const total = staffTasks.length;
            const completed = staffTasks.filter(t => t.status === 'Completed' || t.status === 'Approved').length;
            const overdue = staffTasks.filter(t => {
                if (t.status === 'Completed' || t.status === 'Approved') return false;
                return t.dueDate && new Date(t.dueDate) < new Date();
            }).length;
            
            return {
                ...staff,
                stats: { total, completed, overdue }
            };
        });
    }, [staffList, tasks]);

    return (
        <div className="dashboard-content-area fade-in">
            <div className="dashboard-header" style={{ position: 'relative', padding: 0, marginBottom: '2rem', background: 'transparent' }}>
                <div className="header-left">
                    <div className="header-content">
                        <h1>Staff Reports</h1>
                        <p>Performance metrics and task completion overview.</p>
                    </div>
                </div>
            </div>

            <div className="reports-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {reportData.map(staff => (
                    <div key={staff._id} className="section-card primary" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '16px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                            <div className="workflow-icon" style={{ background: '#f8fafc', color: '#6366f1' }}><User size={20} /></div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{staff.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{staff.email}</p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}><FileText size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> TOTAL TASKS</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{staff.stats.total}</div>
                            </div>
                            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginBottom: '4px' }}><CheckCircle size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> COMPLETED</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>{staff.stats.completed}</div>
                            </div>
                            {staff.stats.overdue > 0 ? (
                                <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '12px', gridColumn: 'span 2' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginBottom: '4px' }}><AlertCircle size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> OVERDUE TASKS</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{staff.stats.overdue}</div>
                                </div>
                            ) : (
                                <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px', gridColumn: 'span 2' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, marginBottom: '4px' }}><Clock size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> ON TRACK</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>0 Overdue</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
