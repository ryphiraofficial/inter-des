import React from 'react';
import { ArrowRight } from 'lucide-react';
import Skeleton from '../../common/Skeleton';
import '../css/SourcingHub.css';
import ProjectsGrid from './components/ProjectsGrid';
import SavedDrafts from './components/SavedDrafts';
import SourcingWorkspace from './components/SourcingWorkspace';

const SourcingHub = ({ 
    sourcingSearch, 
    setSourcingSearch, 
    selectedSourcingProject, 
    setSelectedSourcingProject, 
    projects, 
    vendors, 
    sourcingBucket, 
    setSourcingBucket, 
    dailyUpdate, 
    setDailyUpdate, 
    savedSourcing, 
    handleSaveSourcing, 
    handleAddToBucket, 
    handleRemoveFromBucket, 
    handleDeleteSaved,
    loading 
}) => {
    const marketResults = vendors.filter(v => 
        v.status === 'Active' && (
            v.name.toLowerCase().includes(sourcingSearch.toLowerCase()) ||
            v.products?.some(p => p.itemName.toLowerCase().includes(sourcingSearch.toLowerCase()))
        )
    );

    return (
        <div className="fade-in sourcing-hub">
            {selectedSourcingProject && (
                <div className="sourcing-header-row" style={{ justifyContent: 'flex-end' }}>
                    <button 
                        onClick={() => setSelectedSourcingProject(null)}
                        className="btn-back-projects"
                    >
                        <ArrowRight size={16} /> Back to Projects
                    </button>
                </div>
            )}

            {!selectedSourcingProject ? (
                <ProjectsGrid 
                    loading={loading}
                    projects={projects}
                    setSelectedSourcingProject={setSelectedSourcingProject}
                />
            ) : (
                <SourcingWorkspace
                    loading={loading}
                    sourcingBucket={sourcingBucket}
                    handleRemoveFromBucket={handleRemoveFromBucket}
                    dailyUpdate={dailyUpdate}
                    setDailyUpdate={setDailyUpdate}
                    handleSaveSourcing={handleSaveSourcing}
                    sourcingSearch={sourcingSearch}
                    setSourcingSearch={setSourcingSearch}
                    marketResults={marketResults}
                    handleAddToBucket={handleAddToBucket}
                />
            )}

            <SavedDrafts 
                savedSourcing={savedSourcing}
                handleDeleteSaved={handleDeleteSaved}
                setSelectedSourcingProject={setSelectedSourcingProject}
                setSourcingBucket={setSourcingBucket}
                setDailyUpdate={setDailyUpdate}
            />
        </div>
    );
};

export default SourcingHub;
