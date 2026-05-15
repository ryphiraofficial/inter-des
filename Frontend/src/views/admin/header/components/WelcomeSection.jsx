import React from 'react';
import { Menu } from 'lucide-react';

const WelcomeSection = ({ title, subtitle, toggleMobileSidebar }) => {
    return (
        <div className="header-left">
            <button
                className="mobile-menu-btn"
                onClick={toggleMobileSidebar}
                title="Open Menu"
            >
                <Menu size={22} strokeWidth={2.4} />
            </button>
            <div className="welcome-text">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
        </div>
    );
};

export default WelcomeSection;
