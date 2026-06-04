import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../css/ProductionManagement.css'; 
import { useProjectCompletion } from './hooks/useProjectCompletion';
import CompletionHeader from './components/ProjectCompletion/CompletionHeader';
import CompletionDetails from './components/ProjectCompletion/CompletionDetails';
import CompletionForm from './components/ProjectCompletion/CompletionForm';

const ProjectCompletion = () => {
    const { id } = useParams();
    const {
        project,
        loading,
        submitting,
        formData, setFormData,
        toast,
        handlePhotoUpload,
        removePhoto,
        handleSubmit,
        navigate
    } = useProjectCompletion(id);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading project details...</div>;
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: '24px', right: '24px', padding: '14px 28px',
                    borderRadius: '12px', color: 'white', fontWeight: 600, zIndex: 9999,
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}>
                    {toast.msg}
                </div>
            )}

            <button 
                onClick={() => navigate(-1)}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}
            >
                <ArrowLeft size={16} /> Back to Projects
            </button>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <CompletionHeader />

                <div style={{ padding: '32px' }}>
                    <CompletionDetails project={project} />

                    <CompletionForm 
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        submitting={submitting}
                        handlePhotoUpload={handlePhotoUpload}
                        removePhoto={removePhoto}
                        navigate={navigate}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectCompletion;
