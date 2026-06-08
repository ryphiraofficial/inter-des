import React from 'react';
import { ArrowLeft, Edit, Printer, Download } from 'lucide-react';

const ActionHeader = ({ handleBack, handleEdit, handlePrint, handleDownload }) => {
    return (
        <div className="qv-actions-bar no-print">
            <button className="btn-back" onClick={handleBack}>
                <ArrowLeft size={18} /> Back
            </button>
            <div className="qv-right-actions">
                <button className="btn-secondary" onClick={handlePrint}>
                    <Printer size={18} /> Print
                </button>
                <button className="btn-primary" onClick={handleDownload}>
                    <Download size={18} /> Download
                </button>
            </div>
        </div>
    );
};

export default ActionHeader;
