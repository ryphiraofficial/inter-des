import React from 'react';
import { DollarSign, Briefcase, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { StatsSkeleton, TableSkeleton } from '../../../components/UI/Skeleton';

export const ProjectKPIs = ({ projects, loading }) => {
    if (loading) return <StatsSkeleton count={4} />;
    
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const activeProjects = projects.filter(p => p.status !== 'Completed').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const paymentCollected = projects.reduce((sum, p) => sum + (p.advanceAmount || 0), 0); // Simplified

    const kpis = [
        { label: 'Total Portfolio', val: `₹${totalBudget.toLocaleString()}`, icon: <Briefcase size={22} />, color: '#6366f1' },
        { label: 'Active Projects', val: activeProjects, icon: <TrendingUp size={22} />, color: '#3b82f6' },
        { label: 'Total Collections', val: `₹${paymentCollected.toLocaleString()}`, icon: <DollarSign size={22} />, color: '#10b981' },
        { label: 'Completed', val: completedProjects, icon: <CheckCircle size={22} />, color: '#8b5cf6' }
    ];

    return (
        <div className="project-kpi-grid">
            {kpis.map(k => (
                <div key={k.label} className="project-kpi-card">
                    <div className="kpi-icon" style={{ background: `${k.color}15`, color: k.color }}>{k.icon}</div>
                    <div className="kpi-info"><h3>{k.val}</h3><p>{k.label}</p></div>
                </div>
            ))}
        </div>
    );
};

export const AccountsProjectTable = ({ projects, loading, onProjectClick }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    
    const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;

    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [projects.length, totalPages, currentPage]);

    if (loading) return <TableSkeleton rows={8} cols={5} />;
    
    const currentProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="table-responsive-wrapper">
            <table className="accounts-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Budget</th>
                        <th>Collection</th>
                        <th>Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProjects.map(p => (
                        <tr key={p._id} onClick={() => onProjectClick(p)} style={{ cursor: 'pointer' }}>
                            <td><div className="proj-cell"><strong>{p.name}</strong><span>{p.projectNumber}</span></div></td>
                            <td><span className={`badge-${p.status?.toLowerCase()}`}>{p.status}</span></td>
                            <td>₹{(p.budget || 0).toLocaleString()}</td>
                            <td>₹{(p.advanceAmount || 0).toLocaleString()}</td>
                            <td>{p.stage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem', gap: '1rem', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, projects.length)} of {projects.length} entries
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                background: currentPage === 1 ? '#f8fafc' : 'white', 
                                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>&lt;</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ 
                                padding: '0.35rem 0.5rem', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0', 
                                background: currentPage === totalPages ? '#f8fafc' : 'white', 
                                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>&gt;</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
