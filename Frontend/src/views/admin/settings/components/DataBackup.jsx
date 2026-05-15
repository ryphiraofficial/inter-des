import React from 'react';
import { Download, Trash2, Database } from 'lucide-react';

const DataBackup = ({ showToast }) => {
    return (
        <>
            <h3 className="settings-section-title">Data & Backup</h3>
            <p className="settings-section-desc">Export data and manage system cleanup.</p>
            <hr className="settings-divider" />

            <div className="data-info-card">
                <div className="info-icon"><Download size={20} /></div>
                <div className="info-text"><h4>Export All Data</h4><p>Download a CSV export of all data.</p></div>
                <button className="btn-data-action" onClick={() => showToast('success', 'Export feature coming soon!')}>Export CSV</button>
            </div>

            <div className="data-info-card">
                <div className="info-icon"><Trash2 size={20} /></div>
                <div className="info-text"><h4>Clear Old Notifications</h4><p>Delete notifications older than 30 days.</p></div>
                <button className="btn-data-action danger" onClick={() => showToast('success', 'Cleanup feature coming soon!')}>Clean Up</button>
            </div>

            <div className="data-info-card">
                <div className="info-icon"><Database size={20} /></div>
                <div className="info-text"><h4>System Information</h4><p>Server status and database connection.</p></div>
                <button className="btn-data-action" onClick={() => showToast('success', 'System info coming soon!')}>View Info</button>
            </div>
        </>
    );
};

export default DataBackup;
