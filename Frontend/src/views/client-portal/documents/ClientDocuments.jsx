import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Image as ImageIcon, Box, File, Download } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import { selectToken } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import './ClientDocuments.css';

const ClientDocuments = () => {
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!selectedProjectId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/client/documents?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setDocuments(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
                showToast('Failed to load project documents', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [token, showToast, selectedProjectId]);

    const formatFullDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getFileIcon = (filename, type) => {
        const ext = filename.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) || type === '2D') {
            return { icon: <ImageIcon size={24} />, className: 'image' };
        }
        if (['pdf'].includes(ext)) {
            return { icon: <FileText size={24} />, className: 'pdf' };
        }
        if (['obj', 'fbx', 'blend', 'skp'].includes(ext) || type === '3D') {
            return { icon: <Box size={24} />, className: 'model' };
        }
        
        return { icon: <File size={24} />, className: 'generic' };
    };

    if (loading) {
        return (
            <div className="client-documents-page">
                <div className="client-page-header">
                    <h1 className="client-page-title">Documents & Files</h1>
                    <p className="client-page-subtitle">Loading your project files...</p>
                </div>
                <div className="client-documents-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="client-skeleton-box client-document-card" style={{ height: '140px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="client-documents-page">
            <div className="client-page-header">
                <h1 className="client-page-title">Documents & Files</h1>
                <p className="client-page-subtitle">Access your 2D/3D layouts, contracts, and attachments</p>
            </div>

            {documents.length === 0 ? (
                <div className="client-empty-state">
                    <div className="client-empty-icon">
                        <FileText size={32} />
                    </div>
                    <h3 className="client-empty-title">No Documents Found</h3>
                    <p className="client-empty-desc">Your project files and design submissions will appear here once uploaded by the team.</p>
                </div>
            ) : (
                <div className="client-documents-grid">
                    {documents.map(doc => {
                        const fileDetails = getFileIcon(doc.filename, doc.type);
                        return (
                            <div key={doc._id} className="client-document-card">
                                <div className={`client-document-icon ${fileDetails.className}`}>
                                    {fileDetails.icon}
                                </div>
                                <div className="client-document-content">
                                    <div className="client-document-name" title={doc.filename}>
                                        {doc.filename}
                                    </div>
                                    <div className="client-document-meta">
                                        <span className="client-document-task">{doc.taskTitle}</span>
                                        <span>Uploaded: {formatFullDate(doc.uploadedAt)}</span>
                                    </div>
                                    <a 
                                        href={doc.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="client-document-action"
                                        download
                                    >
                                        <Download size={14} /> View File
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClientDocuments;
