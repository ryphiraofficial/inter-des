import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import { useGetPublicSettingsQuery } from '../../../store/api/authApi';
import { BASE_IMAGE_URL } from '../../../config/constants';
import axios from 'axios';
import './ClientLogin.css';

const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`) : null;

const ClientLogin = () => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    
    const { data: settingsData } = useGetPublicSettingsQuery();
    const companyLogo = settingsData?.data?.company?.companyLogo;
    const companyName = settingsData?.data?.company?.companyName || 'Company';
    const [imageError, setImageError] = useState(false);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (!phone || phone.length < 10) {
            showToast('Please enter a valid mobile number', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/client-auth/request-otp', { phone });
            if (response.data.success) {
                showToast(response.data.message || 'OTP sent successfully', 'success');
                setStep(2);
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to send OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            showToast('Please enter the valid OTP', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/client-auth/verify-otp', { phone, otp });
            if (response.data.success) {
                // Set auth state
                dispatch(loginSuccess({
                    user: response.data.data,
                    token: response.data.token
                }));
                showToast('Login successful!', 'success');
                navigate('/client/dashboard');
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Invalid OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-login-container">
            <div className="client-login-card">
                <div className="client-login-logo">
                    {companyLogo && !imageError ? (
                        <img 
                            src={getImageUrl(companyLogo)} 
                            alt="Company Logo" 
                            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="client-login-logo-circle">
                            {companyName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                
                {step === 1 ? (
                    <>
                        <h2 className="client-login-title">{companyName}</h2>
                        <p className="client-login-subtitle">Enter your registered mobile number to track your project</p>
                        
                        <form className="client-login-form" onSubmit={handleRequestOTP}>
                            <div>
                                <label className="client-login-label">Mobile Number</label>
                                <input 
                                    type="tel" 
                                    className="client-login-input" 
                                    placeholder="+91 9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="client-login-btn" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Get OTP'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="client-login-title">Verify OTP</h2>
                        <p className="client-login-subtitle">Enter the OTP sent to {phone}</p>
                        
                        <form className="client-login-form" onSubmit={handleVerifyOTP}>
                            <div>
                                <label className="client-login-label">Secure OTP</label>
                                <input 
                                    type="text" 
                                    className="client-login-input" 
                                    placeholder="Enter OTP (Test: 123456)"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                    maxLength={6}
                                />
                            </div>
                            <button type="submit" className="client-login-btn" disabled={loading}>
                                {loading ? 'Verifying...' : 'Login securely'}
                            </button>
                        </form>
                        
                        <button 
                            className="client-login-back" 
                            onClick={() => {
                                setStep(1);
                                setOtp('');
                            }}
                            disabled={loading}
                        >
                            Change mobile number
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientLogin;
