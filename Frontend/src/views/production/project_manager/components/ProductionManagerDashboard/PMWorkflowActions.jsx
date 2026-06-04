import React from 'react';
import { Plus, Users, ClipboardCheck, CheckCircle } from 'lucide-react';

const PMWorkflowActions = () => {
    return (
        <div className="workflow-actions">
            <h3>Production Workflow Actions</h3>
            <div className="action-buttons">
                <button className="action-btn">
                    <Plus size={18} /> Create Task
                </button>
                <button className="action-btn">
                    <Users size={18} /> Assign Workers
                </button>
                <button className="action-btn">
                    <ClipboardCheck size={18} /> Checklist
                </button>
                <button className="action-btn primary">
                    <CheckCircle size={18} /> Mark Complete
                </button>
            </div>
        </div>
    );
};

export default PMWorkflowActions;
