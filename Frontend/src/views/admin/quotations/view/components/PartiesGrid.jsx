import React from 'react';
import { Calendar } from 'lucide-react';

const PartiesGrid = ({ client, projectName, projectDescription, validUntil }) => {
    return (
        <section className="parties-grid">
            <div className="party-box client-box">
                <h3>Prepared For</h3>
                <div className="party-details">
                    <p className="client-name">{client?.name || 'Walk-in Client'}</p>
                    <p>{client?.email}</p>
                    <p>{client?.phone}</p>
                    <p>{client?.company}</p>
                </div>
            </div>
            <div className="party-box project-box">
                <h3>Project Details</h3>
                <div className="party-details">
                    <p className="project-title">{projectName}</p>
                    <p className="project-desc">{projectDescription}</p>
                    {validUntil && (
                        <p className="validity">
                            <Calendar size={14} /> Valid Until: {new Date(validUntil).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PartiesGrid;
