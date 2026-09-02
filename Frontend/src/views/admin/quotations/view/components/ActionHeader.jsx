import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ActionHeader = ({ handleBack }) => {
    return (
        <div className="qv-actions-bar no-print">
            <button className="btn-back" onClick={handleBack}>
                <ArrowLeft size={14} /> Back
            </button>
        </div>
    );
};

export default ActionHeader;
