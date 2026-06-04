import React from 'react';
import { Building2 } from 'lucide-react';

const PMPipelineSection = ({ projects }) => {
    return (
        <div className="pipeline-section">
            <h3><Building2 size={18} /> Project Pipeline</h3>
            <div className="pipeline-columns">
                {['Design', 'Procurement', 'Production'].map(stage => (
                    <div key={stage} className="pipeline-column">
                        <div className="column-header">
                            <span className="column-name">{stage}</span>
                            <span className="column-count">{projects.filter(p => p.stage === stage).length}</span>
                        </div>
                        <div className="column-projects">
                            {projects.filter(p => p.stage === stage).map(project => (
                                <div key={project._id} className="pipeline-card">
                                    <span className="card-name">{project.name}</span>
                                    <div className="card-progress">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${project.progress || 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PMPipelineSection;
