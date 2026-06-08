import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Phone, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { selectToken } from '../../../store/slices/authSlice';
import { useToast } from '../../../models/context/ToastContext';
import './ClientWorkingMembers.css';

const ClientWorkingMembers = () => {
    const token = useAppSelector(selectToken);
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedProjectId = useAppSelector(state => state.clientPortal.selectedProjectId);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!selectedProjectId) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/client/members?projectId=${selectedProjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setMembers(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching members:", error);
                showToast('Failed to load project members', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [token, showToast, selectedProjectId]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const handleChatClick = (member) => {
        // Route to the internal messaging system if it exists, otherwise show toast
        // Assuming /client/messages is the route based on the context
        navigate(`/client/messages?staffId=${member._id}`);
    };

    if (loading) {
        return (
            <div className="client-members-page">
                <div className="client-page-header">
                    <h1 className="client-page-title">Working Members</h1>
                    <p className="client-page-subtitle">Loading your project team...</p>
                </div>
                <div className="client-members-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="client-skeleton-box client-member-card" style={{ height: '280px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="client-members-page">
            <div className="client-page-header">
                <h1 className="client-page-title">Working Members</h1>
                <p className="client-page-subtitle">Meet the team dedicated to your project</p>
            </div>

            {members.length === 0 ? (
                <div className="client-empty-state">
                    <div className="client-empty-icon">
                        <Users size={32} />
                    </div>
                    <h3 className="client-empty-title">Team Not Assigned</h3>
                    <p className="client-empty-desc">Your project team will be assigned shortly and will appear here.</p>
                </div>
            ) : (
                <div className="client-members-grid">
                    {members.map(member => (
                        <div key={member._id} className="client-member-card">
                            <div className="client-member-header">
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.fullName} className="client-member-avatar" />
                                ) : (
                                    <div className="client-member-avatar">
                                        {getInitials(member.fullName)}
                                    </div>
                                )}
                                <div className="client-member-info">
                                    <div className="client-member-name">{member.fullName}</div>
                                    <div className="client-member-role">{member.projectRole}</div>
                                </div>
                            </div>

                            <div className="client-member-contact">
                                {member.phone && (
                                    <div className="client-member-contact-item">
                                        <Phone size={16} />
                                        <span>{member.phone}</span>
                                    </div>
                                )}
                                {member.email && (
                                    <div className="client-member-contact-item">
                                        <Mail size={16} />
                                        <span>{member.email}</span>
                                    </div>
                                )}
                                {!member.phone && !member.email && (
                                    <div className="client-member-contact-item" style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                        Contact details restricted
                                    </div>
                                )}
                            </div>

                            <div className="client-member-actions">
                                {member.phone && (
                                    <a href={`tel:${member.phone}`} className="client-member-action-btn call">
                                        <Phone size={18} /> Call
                                    </a>
                                )}
                                <button 
                                    className="client-member-action-btn chat"
                                    onClick={() => handleChatClick(member)}
                                >
                                    <MessageSquare size={18} /> Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientWorkingMembers;
