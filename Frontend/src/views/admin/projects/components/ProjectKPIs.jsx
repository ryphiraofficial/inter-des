import React from 'react';
import { LayoutGrid, Briefcase, Clock, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

const ProjectKPIs = ({ projects }) => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.stage !== 'Completed').length;
    const completedProjects = projects.filter(p => p.stage === 'Completed').length;
    const delayedProjects = projects.filter(p => p.status === 'On Hold' || (p.targetEndDate && new Date(p.targetEndDate) < new Date() && p.stage !== 'Completed')).length;
    
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgProgress = totalProjects > 0 
        ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects) 
        : 0;

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    const kpis = [
        { label: 'Total Projects', value: totalProjects, icon: Briefcase, color: '#6366f1' },
        { label: 'Active Pipeline', value: activeProjects, icon: TrendingUp, color: '#f59e0b' },
        { label: 'Delayed/Hold', value: delayedProjects, icon: AlertCircle, color: '#ef4444' },
        { label: 'Completed', value: completedProjects, icon: CheckCircle2, color: '#10b981' },
        { label: 'Total Value', value: formatCurrency(totalBudget), icon: LayoutGrid, color: '#8b5cf6' },
        { label: 'Avg Progress', value: `${avgProgress}%`, icon: Clock, color: '#3b82f6' }
    ];

    return (
        <div className="project-kpis">
            {kpis.map((kpi, index) => (
                <div key={index} className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                        <kpi.icon size={20} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">{kpi.label}</span>
                        <h4 className="kpi-value">{kpi.value}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectKPIs;
