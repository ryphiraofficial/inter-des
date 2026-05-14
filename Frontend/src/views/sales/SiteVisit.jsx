import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../models/context/ToastContext';
import { CheckCircle, Loader } from 'lucide-react';
import { useSiteVisitForm } from './hooks/useSiteVisitForm';
import SiteVisitDetailsForm from './components/SiteVisitDetailsForm';
import SiteVisitImageUpload from './components/SiteVisitImageUpload';
import './css/SiteVisit.css';

const SiteVisit = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const {
        images,
        clients,
        tasks,
        uploading,
        visitData,
        setVisitData,
        handleImageChange,
        removeImage,
        handleUpload
    } = useSiteVisitForm(showToast, navigate);

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
