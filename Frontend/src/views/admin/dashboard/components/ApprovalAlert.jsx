import React from 'react';
import { Palette, ArrowUpRight } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const ApprovalAlert = ({ count, loading, onClick }) => {
    if (loading) {
        return (
            <div className="approval-alert-card skeleton">
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div style={{ flex: 1, marginLeft: '20px' }}>
                    <Skeleton width="220px" height="18px" />
                    <div style={{ marginTop: '8px' }}>
                        <Skeleton width="400px" height="14px" />
                    </div>
                </div>
            </div>
        );
    }

    if (!count || count <= 0) return null;

    return (
        <div className="approval-alert-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="alert-content">
                <div className="alert-icon-box">
                    <Palette size={20} />
                </div>
                <div className="alert-text">
                    <h3>{count} Designs Awaiting Your Approval</h3>
                    <p>Designs from the studio are ready for final sign-off and procurement push.</p>
                </div>
            </div>
            <div className="alert-action">
                <span>Review Now</span>
                <ArrowUpRight size={16} />
            </div>
        </div>
    );
};

export default ApprovalAlert;
