import React from 'react';
import { Wand2, X } from 'lucide-react';

const ChatFAB = ({ isOpen, toggleChat, showWelcome }) => {
    return (
        <div className="ai-chat-fab-wrapper">
            {showWelcome && !isOpen && (
                <div className="ai-welcome-popup">
                    Need a hand? I can write quotations for you! ✨
                </div>
            )}
            
            <button
                className={`ai-fab ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
            >
                {!isOpen && (
                    <div className="sparkle-container">
                        <div className="sparkle s1"></div>
                        <div className="sparkle s2"></div>
                        <div className="sparkle s3"></div>
                    </div>
                )}
                {isOpen ? <X size={28} /> : <Wand2 size={28} />}
            </button>
        </div>
    );
};

export default ChatFAB;
