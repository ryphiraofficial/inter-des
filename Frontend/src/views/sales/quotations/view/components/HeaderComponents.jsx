import React from 'react';
import { ArrowLeft, Edit, Printer, Download, MapPin, Phone, Globe } from 'lucide-react';

export const ActionHeader = ({ handleBack, handlePrint, handleDownload }) => (
    <div className="qv-actions-bar no-print">
        <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={14} /> Back
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

export const DocHeader = ({ quotationNumber, createdAt, status }) => (
    <header className="doc-header">
        <div className="company-logo-section">
            <div className="qv-logo">
                <span className="logo-accent">I</span>nterior Design
            </div>
            <div className="company-details">
                <p><MapPin size={12} /> 123 Design Studio, Creative Avenue, NY</p>
                <p><Phone size={12} /> +1 234 567 890</p>
                <p><Globe size={12} /> www.interiordesign.com</p>
            </div>
        </div>
        <div className="doc-title-section">
            <h1>QUOTATION</h1>
            <div className="doc-meta">
                <div className="meta-item">
                    <label>Quote #</label>
                    <span>{quotationNumber}</span>
                </div>
                <div className="meta-item">
                    <label>Date</label>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                    <label>Status</label>
                    <span className={`status-badge ${status?.toLowerCase()}`}>{status}</span>
                </div>
            </div>
        </div>
    </header>
);
