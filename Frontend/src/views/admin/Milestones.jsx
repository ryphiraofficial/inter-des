import React from 'react';
import { 
    Trophy, Award, Medal, Crown, Target, Star, Users, 
    CheckCircle2, TrendingUp, Sparkles, ChevronRight, Zap 
} from 'lucide-react';
import { useGetMilestonesQuery, useGetSettingsQuery } from '../../store/api/adminApi';
import Skeleton from '../common/Skeleton';
import './css/Milestones.css';

const Milestones = () => {
    const { data: milestonesRes, isLoading, error } = useGetMilestonesQuery();
    const { data: settingsRes } = useGetSettingsQuery();
    const companyName = settingsRes?.company?.companyName || settingsRes?.application?.brandName || 'STUDIO';

    const data = milestonesRes?.data;
    const company = data?.company;
    const staffList = data?.staffList || [];
    const podium = data?.podium || [];
    const topManagers = data?.topManagers || [];
    const topSales = data?.topSales || [];
    const birthdaysToday = data?.birthdaysToday || [];

    const formatCurrency = (amount) => {
        if (!amount) return '₹0';
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    if (error) {
        return (
            <div className="milestones-error-state">
                <Trophy size={48} className="error-icon" />
                <h3>Failed to Load Achievements</h3>
                <p>There was an error retrieving milestones and stats. Please try again later.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="milestones-page loading">
                <div className="milestones-hero-skeleton">
                    <Skeleton width="40%" height="32px" style={{ marginBottom: '12px' }} />
                    <Skeleton width="60%" height="18px" />
                </div>
                <div className="milestones-grid-skeleton">
                    <Skeleton height="200px" style={{ borderRadius: '24px' }} />
                    <Skeleton height="350px" style={{ borderRadius: '24px' }} />
                </div>
            </div>
        );
    }

    // Sort podium: 2nd place on left, 1st place in center, 3rd place on right
    const getPodiumOrder = (pod) => {
        if (!pod || pod.length === 0) return [];
        const result = [];
        if (pod[1]) result.push({ ...pod[1], place: 2 }); // 2nd
        if (pod[0]) result.push({ ...pod[0], place: 1 }); // 1st
        if (pod[2]) result.push({ ...pod[2], place: 3 }); // 3rd
        return result;
    };

    const sortedPodium = getPodiumOrder(podium);

    return (
        <div className="milestones-page fade-in">
            {/* BIRTHDAY ANNOUNCEMENT BANNER */}
            {birthdaysToday && birthdaysToday.length > 0 && (
                <div className="birthday-announcement-banner fade-in">
                    <div className="birthday-icon-wrapper">🎂</div>
                    <div className="birthday-banner-content">
                        <h4>Today's Birthday Celebrations! 🎉</h4>
                        <p>
                            Join us in wishing a very Happy Birthday to{' '}
                            <strong>
                                {birthdaysToday.map(b => `${b.name} (${b.role})`).join(', ')}
                            </strong>
                            ! 🎈✨
                        </p>
                    </div>
                </div>
            )}

            {/* 1. HERO BANNER */}
            <div className="milestones-hero">
                <div className="hero-content">
                    <span className="hero-kicker">
                        <Sparkles size={14} /> {companyName.toUpperCase()} LEADERBOARD
                    </span>
                    <h2>Achievements & Milestones</h2>
                    <p>Track company growth milestones, celebrate staff badge completions, and spotlight top contributors.</p>
                </div>
                <div className="hero-stats">
                    <div className="hero-stat-card">
                        <Target size={20} className="stat-icon-proj" />
                        <div>
                            <strong>{company?.totalProjects || 0}</strong>
                            <span>Total Projects</span>
                        </div>
                    </div>
                    <div className="hero-stat-card">
                        <CheckCircle2 size={20} className="stat-icon-done" />
                        <div>
                            <strong>{company?.completedProjects || 0}</strong>
                            <span>Completed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. COMPANY MILESTONE TRACKER */}
            <section className="company-milestones-section">
                <div className="section-header">
                    <div>
                        <h3>Company Milestone Meter</h3>
                        <p>Our journey to completing projects and delivering premium interior spaces.</p>
                    </div>
                    <span className="milestone-badge">
                        Next: {company?.nextMilestone?.label} ({company?.nextMilestone?.target} Projects)
                    </span>
                </div>

                <div className="milestone-progress-container">
                    <div className="milestone-progress-bar-wrapper">
                        <div 
                            className="milestone-progress-bar" 
                            style={{ width: `${company?.nextMilestone?.progress || 0}%` }}
                        />
                        {company?.milestones?.map((m) => (
                            <div 
                                key={m.key} 
                                className={`milestone-marker ${m.unlocked ? 'unlocked' : ''}`}
                                style={{ left: `${Math.min(98, (m.target / (company?.nextMilestone?.target || 500)) * 100)}%` }}
                                title={`${m.label}: ${m.target} Projects`}
                            >
                                <span className="marker-dot" />
                                <span className="marker-label">{m.target}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="progress-details">
                        <span><strong>{company?.completedProjects || 0}</strong> projects completed</span>
                        <span>
                            {company?.nextMilestone?.remaining > 0 ? (
                                <><strong>{company?.nextMilestone?.remaining}</strong> projects left to unlock <strong>{company?.nextMilestone?.label}</strong></>
                            ) : (
                                <>All Milestones Completed! You are legendary! 🎉</>
                            )}
                        </span>
                    </div>
                </div>

                {/* Milestone Cards */}
                <div className="milestone-cards-grid">
                    {company?.milestones?.map((m) => (
                        <div key={m.key} className={`milestone-card ${m.unlocked ? 'unlocked' : 'locked'}`}>
                            <div className="milestone-card-icon">
                                <Trophy size={22} />
                            </div>
                            <div className="milestone-card-info">
                                <h4>{m.label}</h4>
                                <span className="milestone-desc">{m.description}</span>
                            </div>
                            <div className="milestone-status">
                                {m.unlocked ? (
                                    <span className="status-unlocked">UNLOCKED</span>
                                ) : (
                                    <span className="status-locked">{m.progress}%</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. PODIUM & HIGHLIGHT LEADERBOARDS */}
            <div className="leaderboards-grid">
                
                {/* Staff completed tasks podium */}
                <div className="podium-section-card">
                    <div className="card-header-with-icon">
                        <Crown size={20} className="header-icon-crown" />
                        <h3>Top Task Masters</h3>
                    </div>
                    <p className="card-subtext">Staff members who completed the most assigned tasks successfully.</p>
                    
                    {sortedPodium.length > 0 ? (
                        <div className="podium-wrapper">
                            <div className="podium-container">
                                {sortedPodium.map((staff) => (
                                    <div 
                                        key={staff._id} 
                                        className={`podium-column place-${staff.place}`}
                                    >
                                        <div className="avatar-container">
                                            <div className="podium-avatar">
                                                {staff.place === 1 && <Crown className="crown-gold" size={20} />}
                                                {staff.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`podium-medal medal-${staff.place}`}>
                                                {staff.place === 1 ? '🥇' : staff.place === 2 ? '🥈' : '🥉'}
                                            </span>
                                        </div>
                                        <div className="podium-info">
                                            <span className="podium-name">{staff.name}</span>
                                            <span className="podium-role">{staff.role}</span>
                                            <span className="podium-count">
                                                <strong>{staff.completedTasks}</strong> Tasks
                                            </span>
                                        </div>
                                        <div className="podium-block">
                                            <div className="podium-place-number">{staff.place}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="podium-empty">No task completions recorded yet.</div>
                    )}
                </div>

                {/* Managers & Sales highlights */}
                <div className="highlights-section-card">
                    <div className="card-header-with-icon">
                        <Zap size={20} className="header-icon-zap" />
                        <h3>Department Spotlights</h3>
                    </div>
                    <p className="card-subtext">Recognizing our leaders in project management and sales acquisition.</p>

                    <div className="spotlight-lists">
                        {/* Top managers list */}
                        <div className="spotlight-group">
                            <h4 className="spotlight-title">
                                <Target size={14} /> Project Leads (Most Managed Projects)
                            </h4>
                            {topManagers.length > 0 ? (
                                <div className="spotlight-items">
                                    {topManagers.map((mgr, index) => (
                                        <div key={mgr._id} className="spotlight-item">
                                            <div className="item-left">
                                                <span className="spotlight-rank">{index + 1}</span>
                                                <div className="spotlight-user-info">
                                                    <strong>{mgr.name}</strong>
                                                    <span>{mgr.role}</span>
                                                </div>
                                            </div>
                                            <span className="spotlight-stat">{mgr.projectCount} Projects</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="spotlight-empty">No projects managed yet.</p>
                            )}
                        </div>

                        {/* Quotation King list */}
                        <div className="spotlight-group">
                            <h4 className="spotlight-title">
                                <TrendingUp size={14} /> Sales Sourcing (Approved Quotations Value)
                            </h4>
                            {topSales.length > 0 ? (
                                <div className="spotlight-items">
                                    {topSales.map((sales, index) => (
                                        <div key={sales._id} className="spotlight-item">
                                            <div className="item-left">
                                                <span className="spotlight-rank rank-sales">{index + 1}</span>
                                                <div className="spotlight-user-info">
                                                    <strong>{sales.name}</strong>
                                                    <span>{sales.role}</span>
                                                </div>
                                            </div>
                                            <div className="item-right-value">
                                                <strong>{formatCurrency(sales.totalValue)}</strong>
                                                <span>{sales.quotationCount} Quotes</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="spotlight-empty">No quotation revenue sourced yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. ALL STAFF BADGES GRID */}
            <section className="staff-badges-section">
                <div className="section-header">
                    <div>
                        <h3>Staff Achievements & Badges</h3>
                        <p>Complete tasks to earn bronze, silver, and gold milestones.</p>
                    </div>
                </div>

                <div className="staff-badges-grid">
                    {staffList.map((staff) => {
                        const totalBadges = staff.badges?.length || 0;
                        const nextTarget = staff.completedTasks < 5 ? 5 : staff.completedTasks < 20 ? 20 : staff.completedTasks < 100 ? 100 : null;
                        const prevTarget = staff.completedTasks < 5 ? 0 : staff.completedTasks < 20 ? 5 : staff.completedTasks < 100 ? 20 : 100;
                        const progressToNext = nextTarget ? Math.min(100, Math.round(((staff.completedTasks - prevTarget) / (nextTarget - prevTarget)) * 100)) : 100;
                        const nextBadgeLabel = staff.completedTasks < 5 ? 'Rookie Achiever' : staff.completedTasks < 20 ? 'Rising Star' : staff.completedTasks < 100 ? 'Century Maker' : 'Legend';

                        return (
                            <div key={staff._id} className="staff-achievement-card">
                                <div className="staff-card-top">
                                    <div className="staff-avatar-circle">
                                        {staff.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="staff-meta">
                                        <h4>{staff.name}</h4>
                                        <span className="staff-role-badge">{staff.role}</span>
                                    </div>
                                </div>

                                <div className="staff-stats-row">
                                    <div className="staff-stat-mini">
                                        <span className="stat-label">Tasks Done</span>
                                        <span className="stat-value">{staff.completedTasks}</span>
                                    </div>
                                    <div className="staff-stat-mini">
                                        <span className="stat-label">On-Time</span>
                                        <span className="stat-value text-blue">{staff.onTimeRate}%</span>
                                    </div>
                                    <div className="staff-stat-mini">
                                        <span className="stat-label">Badges</span>
                                        <span className="stat-value text-gold">{totalBadges}</span>
                                    </div>
                                </div>

                                {/* Badges list */}
                                <div className="badges-list-chips">
                                    {totalBadges > 0 ? (
                                        staff.badges.map((badge) => (
                                            <span 
                                                key={badge.title} 
                                                className="badge-chip"
                                                style={{ borderColor: badge.color, color: badge.color }}
                                                title={badge.description}
                                            >
                                                <span className="chip-icon">{badge.icon}</span>
                                                {badge.title}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="no-badges-yet">No badges unlocked yet</span>
                                    )}
                                </div>

                                {/* Progress to next badge */}
                                {nextTarget && (
                                    <div className="staff-badge-progress">
                                        <div className="progress-labels">
                                            <span>Next Badge: {nextBadgeLabel}</span>
                                            <span>{staff.completedTasks}/{nextTarget} Tasks</span>
                                        </div>
                                        <div className="progress-bar-track">
                                            <div className="progress-bar-fill" style={{ width: `${progressToNext}%` }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Milestones;
