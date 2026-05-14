import React from 'react';
import { useSalesClients } from './hooks/useSalesClients';
import SalesClientsList from './components/SalesClientsList';
import SalesClientModal from './components/SalesClientModal';
import './css/SalesClients.css';

const SalesClients = ({ isOpportunities }) => {
    const {
        loading,
        submitting,
        showModal,
        formData,
        filteredClients,
        closeModal,
        handleInputChange,
        handleSubmit
    } = useSalesClients();

    return (
        <div className="sc-clients-container">
            <div className="sc-clients-wrapper">
                <SalesClientsList 
                    loading={loading} 
                    filteredClients={filteredClients} 
                />
            </div>

            <SalesClientModal
                showModal={showModal}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
                formData={formData}
                handleInputChange={handleInputChange}
                submitting={submitting}
            />
        </div>
    );
};

export default SalesClients;
