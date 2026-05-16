import React, { useState } from 'react';
import { X, CheckCircle, IndianRupee } from 'lucide-react';
import { accountsAPI } from '../../../models/api';

const RecordPaymentModal = ({ isOpen, onClose, project, onSuccess }) => {
    const [amount, setAmount] = useState(project?.advanceAmount || '');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !project) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await accountsAPI.verifyPayment({
                projectId: project._id,
                collectedAmount: amount,
                paymentNotes: notes
            });
            if (res.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            alert('Failed to record payment: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Record Advance Payment</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Project</label>
                        <input type="text" value={project.name} disabled className="form-input disabled" />
                    </div>
                    
                    <div className="form-group">
                        <label>Expected Advance Amount</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="input-icon" />
                            <input 
                                type="number" 
                                value={project.advanceAmount} 
                                disabled 
                                className="form-input disabled with-icon" 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Amount Collected</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="input-icon" />
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                required 
                                className="form-input with-icon"
                                min="0" 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Payment Notes</label>
                        <textarea 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            placeholder="Transaction ID, Cheque No, or other details"
                            className="form-input"
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Recording...' : <><CheckCircle size={16} /> Confirm Payment</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
