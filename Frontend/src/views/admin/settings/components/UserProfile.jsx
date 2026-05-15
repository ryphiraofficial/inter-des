import React from 'react';
import { Upload, Save, Shield, Eye, EyeOff } from 'lucide-react';

const UserProfile = ({ 
    profile, setProfile, avatarInputRef, handleFileUpload, getImageUrl, saveProfile, 
    passwords, setPasswords, showPasswords, setShowPasswords, changePassword, saving 
}) => {
    const initials = profile?.fullName
        ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        : '?';

    return (
        <>
            <h3 className="settings-section-title">My Profile</h3>
            <p className="settings-section-desc">Update your personal information and password.</p>
            <hr className="settings-divider" />

            <div className="profile-header-card">
                <div className="profile-avatar-large" onClick={() => avatarInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                    {profile?.avatar ? <img src={getImageUrl(profile.avatar)} alt="Avatar" /> : initials}
                </div>
                <div className="profile-info">
                    <h3>{profile?.fullName || 'User'}</h3>
                    <p>{profile?.email} · {profile?.role}</p>
                </div>
                <span className="settings-upload-btn" onClick={() => avatarInputRef.current?.click()}>
                    <Upload size={14} /> Change Photo
                </span>
                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                />
            </div>

            <div className="settings-form-grid">
                <div className="settings-form-group">
                    <label>Full Name</label>
                    <input className="settings-input" value={profile?.fullName || ''} onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))} />
                </div>
                <div className="settings-form-group">
                    <label>Email</label>
                    <input className="settings-input" type="email" value={profile?.email || ''} onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="settings-form-group">
                    <label>Phone</label>
                    <input className="settings-input" value={profile?.phone || ''} onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))} />
                </div>
                <div className="settings-form-group">
                    <label>Role</label>
                    <input className="settings-input" value={profile?.role || ''} disabled style={{ opacity: 0.6 }} />
                </div>
            </div>

            <div className="settings-save-row" style={{ borderTop: 'none', marginTop: '1rem', paddingTop: 0 }}>
                <button className="btn-settings-save" onClick={saveProfile} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Update Profile'}
                </button>
            </div>

            <div className="password-section">
                <h4>Change Password</h4>
                <div className="settings-form-grid" style={{ marginTop: '1rem' }}>
                    {['current', 'new', 'confirm'].map(type => (
                        <div className="settings-form-group" style={{ position: 'relative' }} key={type}>
                            <label>{type.charAt(0).toUpperCase() + type.slice(1)} Password</label>
                            <input
                                className="settings-input"
                                type={showPasswords[type] ? 'text' : 'password'}
                                value={passwords[`${type}Password`]}
                                onChange={(e) => setPasswords(prev => ({ ...prev, [`${type}Password`]: e.target.value }))}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, [type]: !prev[type] }))}
                                style={{ position: 'absolute', right: '12px', top: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                {showPasswords[type] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="settings-save-row">
                    <button className="btn-settings-save" onClick={changePassword} disabled={saving || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}>
                        <Shield size={16} /> {saving ? 'Changing...' : 'Change Password'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
