import React from 'react';
import { Wallet } from 'lucide-react';

const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
};

const BudgetOverview = ({ budgetData, budgetPercent }) => {
    return (
        <div className="pm-card pm-budget-card">
            <div className="pm-card-header">
                <h3><Wallet size={18} /> Budget Overview</h3>
            </div>
            {budgetData ? (
                <div className="pm-budget-content">
                    <div className="pm-budget-ring-container">
                        <div className="pm-budget-ring" style={{ '--budget-percent': budgetPercent }}>
                            <svg viewBox="0 0 120 120" className="pm-ring-svg">
                                <circle cx="60" cy="60" r="52" className="pm-ring-bg" />
                                <circle
                                    cx="60" cy="60" r="52"
                                    className="pm-ring-fill"
                                    style={{ strokeDasharray: `${budgetPercent * 3.267} 326.7` }}
                                />
                            </svg>
                            <div className="pm-ring-center">
                                <span className="pm-ring-value">{budgetPercent}%</span>
                                <span className="pm-ring-label">Utilized</span>
                            </div>
                        </div>
                        <div className="pm-budget-totals">
                            <div className="pm-budget-total-row">
                                <span>Total Budget</span>
                                <strong>{formatCurrency(budgetData.total)}</strong>
                            </div>
                            <div className="pm-budget-total-row">
                                <span>Spent</span>
                                <strong style={{ color: '#e11d48' }}>{formatCurrency(budgetData.spent)}</strong>
                            </div>
                            <div className="pm-budget-total-row">
                                <span>Remaining</span>
                                <strong style={{ color: '#10b981' }}>{formatCurrency(budgetData.total - budgetData.spent)}</strong>
                            </div>
                        </div>
                    </div>
                    {budgetData.categories && (
                        <div className="pm-budget-breakdown">
                            {budgetData.categories.map((cat, idx) => (
                                <div className="pm-budget-category" key={idx}>
                                    <div className="pm-budget-cat-header">
                                        <div className="pm-budget-cat-dot" style={{ background: cat.color }}></div>
                                        <span>{cat.name}</span>
                                        <span className="pm-budget-cat-amount">{formatCurrency(cat.amount)}</span>
                                    </div>
                                    <div className="pm-budget-cat-bar">
                                        <div
                                            className="pm-budget-cat-fill"
                                            style={{
                                                width: `${(cat.amount / budgetData.spent) * 100}%`,
                                                background: cat.color
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p className="pm-empty-text" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading budget...</p>
            )}
        </div>
    );
};

export default BudgetOverview;
