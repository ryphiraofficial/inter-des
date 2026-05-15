import React from 'react';
import { Send, Loader2, Zap, Search } from 'lucide-react';

const ChatInputArea = ({ input, setInput, handleSend, isLoading }) => {
    const suggestions = ['Bedroom Quote', 'Kitchen Modular', 'Living Room', 'Go to Inventory'];

    return (
        <>
            <div className="ai-quick-suggestions">
                {suggestions.map((hint) => (
                    <button
                        key={hint}
                        className="hint-chip"
                        onClick={() => handleSend(hint === 'Go to Inventory' ? 'Take me to inventory' : `Make a quote for ${hint}`)}
                        disabled={isLoading}
                    >
                        {hint.includes('Quote') || hint.includes('Room') || hint.includes('Kitchen') ? <Zap size={12} /> : <Search size={12} />}
                        {hint}
                    </button>
                ))}
            </div>

            <div className="ai-input-area">
                <div className="ai-input-wrapper">
                    <input
                        type="text"
                        placeholder="e.g., Make a quote for a 3BHK living room..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                </div>
                <button className="btn-ai-send" onClick={() => handleSend()} disabled={isLoading}>
                    {isLoading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
                </button>
            </div>
        </>
    );
};

export default ChatInputArea;
