import React from 'react';
import { CheckSquare } from 'lucide-react';
import LeaveApprovals from './components/Approvals/LeaveApprovals';
import './Engineer.css';

const EngineerApprovals = () => {
    return (
        <div className="eng-dashboard">

            <div style={{ marginTop: 20 }}>
                <LeaveApprovals />
            </div>
        </div>
    );
};

export default EngineerApprovals;
