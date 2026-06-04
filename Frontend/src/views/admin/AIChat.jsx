import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Zap, Loader2 } from 'lucide-react';
import { useAIChatState } from './ai-chat/hooks/useAIChatState';
import { useAIChatActions } from './ai-chat/hooks/useAIChatActions';

import ChatMessage from './ai-chat/components/ChatMessage';
import ChatInputArea from './ai-chat/components/ChatInputArea';
import ChatFAB from './ai-chat/components/ChatFAB';

import './css/AIChat.css';

const AIChat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = useAIChatState();
    const messagesEndRef = useRef(null);

    const actions = useAIChatActions({
        input: state.input,
        setInput: state.setInput,
        messages: state.messages,
        setMessages: state.setMessages,
        setIsLoading: state.setIsLoading,
        isLoading: state.isLoading,
        location,
        navigate
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);

    const { setShowWelcome } = state;

    useEffect(() => {
        const timer = setTimeout(() => setShowWelcome(false), 8000);
        return () => clearTimeout(timer);
    }, [setShowWelcome]);

    const toggleChat = () => {
        state.setIsOpen(!state.isOpen);
        state.setShowWelcome(false);
    };

    return (
        <div className="ai-chat-container">
            {state.isOpen && (
                <div className="ai-window">
                    <div className="ai-header">
                        <div className="ai-header-info">
                            <div className="ai-bot-icon"><Zap size={20} /></div>
                            <div className="ai-title-group">
                                <h3>Antigravity Intel</h3>
                                <p>Powered by Gemini 1.5</p>
                            </div>
                        </div>
                        <button className="btn-close-chat" onClick={() => state.setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="ai-messages">
                        {state.messages.map((msg, idx) => (
                            <ChatMessage 
                                key={idx} 
                                msg={msg} 
                                onFormConfirm={(updatedData) => actions.handleAIAction({
                                    action: 'SUBMIT_FORM',
                                    formType: msg.actionData.formType,
                                    data: updatedData
                                })}
                            />
                        ))}
                        {state.isLoading && (
                            <div className="message-wrapper bot">
                                <div className="msg-bot-avatar"><Loader2 className="spinner" size={16} /></div>
                                <div className="ai-message-bubble bot loading">Thinking...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <ChatInputArea 
                        input={state.input}
                        setInput={state.setInput}
                        handleSend={actions.handleSend}
                        isLoading={state.isLoading}
                    />
                </div>
            )}

            <ChatFAB 
                isOpen={state.isOpen}
                toggleChat={toggleChat}
                showWelcome={state.showWelcome}
            />
        </div>
    );
};

export default AIChat;
