import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginMutation, useGetPublicSettingsQuery } from '../../store/api/authApi';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/slices/authSlice';
import { BASE_IMAGE_URL } from '../../config/constants';
import './css/Login.css';

const getImageUrl = (path) => path ? (path.startsWith('http') ? path : `${BASE_IMAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`) : null;

const Login = () => {
    const dispatch = useAppDispatch();
    const { data: settingsData } = useGetPublicSettingsQuery();
    const companyLogo = settingsData?.data?.company?.companyLogo;
    
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const [login] = useLoginMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const identifier = formData.identifier.trim();
            const payload = { password: formData.password };

            if (/^STF-\d+$/i.test(identifier)) {
                payload.staffId = identifier.toUpperCase();
            } else {
                payload.email = identifier;
            }

            const response = await login(payload).unwrap();

            if (response.success) {
                dispatch(loginSuccess({ user: response.data, token: response.token }));
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fillDefaultCredentials = () => {
        setFormData({
            identifier: 'admin@interiordesign.com',
            password: 'admin123'
        });
    };

    const [imageError, setImageError] = useState(false);
    const companyName = settingsData?.data?.company?.companyName || 'Company';

    return (
        <div className="login-page-light">
            <div className="login-card">
                <div className="login-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {companyLogo && !imageError ? (
                        <img 
                            src={getImageUrl(companyLogo)} 
                            alt="Company Logo" 
                            style={{ width: '56px', height: '56px', marginBottom: '16px', objectFit: 'cover', borderRadius: '50%' }} 
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div style={{ width: '56px', height: '56px', marginBottom: '16px', borderRadius: '50%', background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)' }}>
                            {companyName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h1>Sign In</h1>
                    <p>Welcome back! Please enter your details.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <label>EMAIL ADDRESS</label>
                        <input
                            type="text"
                            name="identifier"
                            placeholder="Enter your email"
                            value={formData.identifier}
                            onChange={handleChange}
                            required
                            className="light-input"
                        />
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>PASSWORD</label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="light-input"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="keep-signed-in"
                            checked={keepSignedIn}
                            onChange={(e) => setKeepSignedIn(e.target.checked)}
                        />
                        <label htmlFor="keep-signed-in">Keep me signed in</label>
                    </div>

                    <button
                        type="submit"
                        className="btn-signin"
                        disabled={loading}
                    >
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </button>
                </form>

                <div className="login-footer-links">
                    <p className="signup-text">
                        Don't have an account? <a href="#">Join Us</a>
                    </p>
                    <button
                        type="button"
                        className="guest-btn"
                        onClick={fillDefaultCredentials}
                    >
                        ADMIN GUEST ACCESS
                    </button>
                </div>
            </div>

            <div className="page-footer">
                <a href="#">Privacy Policy</a>
                <span className="dot">•</span>
                <a href="#">Terms of Service</a>
                <span className="dot">•</span>
                <a href="#">Support</a>
            </div>
        </div>
    );
};

export default Login;
