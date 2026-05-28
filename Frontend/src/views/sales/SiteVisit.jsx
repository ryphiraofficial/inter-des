import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../models/context/ToastContext';
import { CheckCircle, Loader } from 'lucide-react';
import { useSiteVisitForm } from './hooks/useSiteVisitForm';
import SiteVisitDetailsForm from './components/SiteVisitDetailsForm';
import SiteVisitImageUpload from './components/SiteVisitImageUpload';
import Skeleton from './components/Skeleton';
import './css/SiteVisit.css';

const SiteVisit = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const {
        images,
        clients,
        tasks,
        uploading,
        initialLoading,
        visitData,
        setVisitData,
        handleImageChange,
        removeImage,
        handleUpload
    } = useSiteVisitForm(showToast, navigate);

    if (initialLoading) {
        return (
            <div className="site-visit">
                <div className="visit-form">
                    <div className="form-section">
                        <Skeleton width="150px" height="24px" style={{ marginBottom: '16px' }} />
                        <div className="form-group"><Skeleton width="100px" height="14px" style={{ marginBottom: '8px' }} /><Skeleton width="100%" height="48px" borderRadius="12px" /></div>
                        <div className="form-group"><Skeleton width="100px" height="14px" style={{ marginBottom: '8px' }} /><Skeleton width="100%" height="48px" borderRadius="12px" /></div>
                        <div className="form-row">
                            <div className="form-group"><Skeleton width="100px" height="14px" style={{ marginBottom: '8px' }} /><Skeleton width="100%" height="48px" borderRadius="12px" /></div>
                            <div className="form-group"><Skeleton width="100px" height="14px" style={{ marginBottom: '8px' }} /><Skeleton width="100%" height="48px" borderRadius="12px" /></div>
                        </div>
                        <div className="form-group"><Skeleton width="100px" height="14px" style={{ marginBottom: '8px' }} /><Skeleton width="100%" height="100px" borderRadius="12px" /></div>
                    </div>
                    
                    <div className="form-section">
                        <Skeleton width="150px" height="24px" style={{ marginBottom: '16px' }} />
                        <Skeleton width="100%" height="160px" borderRadius="12px" />
                    </div>
                    
                    <div className="form-actions">
                        <Skeleton width="200px" height="48px" borderRadius="12px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="site-visit">
            <form onSubmit={handleUpload} className="visit-form">
                
                <SiteVisitDetailsForm 
                    visitData={visitData} 
                    setVisitData={setVisitData} 
                    clients={clients} 
                    tasks={tasks} 
                />

                <SiteVisitImageUpload 
                    images={images} 
                    handleImageChange={handleImageChange} 
                    removeImage={removeImage} 
                />

                <div className="form-actions">
                    <button type="submit" className="submit-visit-btn" disabled={uploading}>
                        {uploading ? (
                            <>
                                <Loader size={20} className="spinner" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                <span>Complete Visit Log</span>
                            </>
                        )}
                    </button>
                </div>
                
            </form>
        </div>
    );
};

export default SiteVisit;
