import React from 'react';
import { Building2, Calendar, Users } from 'lucide-react';

const ProjectInfoCards = ({ project, getStageColor }) => {
    return (
        <div className="info-cards-grid">
            <div className="info-card-premium">
                <div className="info-card-header">
                    <div className="info-card-icon-container">
                        <Building2 size={18} strokeWidth={2.5} />
                    </div>
                    <h4>Client Information</h4>
                </div>
                <div className="info-content-grid">
                    <div className="info-item">
                        <span className="label">Primary Contact</span>
                        <strong className="value">{project.client?.name}</strong>
                    </div>
                    <div className="info-item">
                        <span className="label">Email Address</span>
                        <span className="value text-muted">{project.client?.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Phone Number</span>
                        <span className="value text-muted">{project.client?.phone || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="info-card-premium">
                <div className="info-card-header">
                    <div className="info-card-icon-container bg-indigo">
                        <Calendar size={18} strokeWidth={2.5} />
                    </div>
                    <h4>Project Timeline</h4>
                </div>
                <div className="info-content-grid">
                    <div className="info-item">
                        <span className="label">Date Created</span>
                        <span className="value">{new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Last Modified</span>
                        <span className="value">{new Date(project.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Current Stage</span>
                        <strong className="value" style={{ color: getStageColor(project.stage) }}>{project.stage}</strong>
                    </div>
                </div>
            </div>

            <div className="info-card-premium">
                <div className="info-card-header">
                    <div className="info-card-icon-container bg-emerald">
                        <Users size={18} strokeWidth={2.5} />
                    </div>
                    <h4>Project Team</h4>
                </div>
                <div className="info-content-grid">
                    <div className="info-item">
                        <span className="label">Design Manager</span>
                        <strong className="value">{project.assignedDesignManager?.fullName || 'Unassigned'}</strong>
                    </div>
                    <div className="info-item">
                        <span className="label">Procurement Manager</span>
                        <strong className="value">{project.assignedProcurementManager?.fullName || 'Unassigned'}</strong>
                    </div>
                    <div className="info-item">
                        <span className="label">Production Manager</span>
                        <strong className="value">{project.assignedProductionManager?.fullName || 'Unassigned'}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInfoCards;
