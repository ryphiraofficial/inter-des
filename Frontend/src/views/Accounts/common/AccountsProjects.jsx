import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccountsProjectLogic } from '../hooks/useAccountsProjectLogic';
import { ProjectKPIs, AccountsProjectTable } from './components/projects/ProjectElements';


const AccountsProjects = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, filtered, activeView, setActiveView } = useAccountsProjectLogic(id);

    return (
        <div className="accounts-projects-view">
            <ProjectKPIs projects={filtered} loading={loading} />
            
            <div className="accounts-card" style={{ marginTop: '2rem' }}>
                <div className="card-header-simple">
                    <h2>Projects Inventory</h2>
                    <div className="tabs-mini">
                        <button className={activeView === 'table' ? 'active' : ''} onClick={() => setActiveView('table')}>List</button>
                        <button className={activeView === 'kanban' ? 'active' : ''} onClick={() => setActiveView('kanban')}>Workflow</button>
                    </div>
                </div>
                
                <AccountsProjectTable 
                    projects={filtered} 
                    loading={loading} 
                    onProjectClick={(p) => navigate(`/accounts/projects/${p._id}`)} 
                />
            </div>
        </div>
    );
};

export default AccountsProjects;
