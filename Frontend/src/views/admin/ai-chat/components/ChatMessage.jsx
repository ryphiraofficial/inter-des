import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles } from 'lucide-react';
import MiniForm from './MiniForm';

const ChatMessage = ({ msg, onFormConfirm }) => {
    return (
        <div className={`message-wrapper ${msg.role}`}>
            {msg.role === 'bot' && (
                <div className="msg-bot-avatar">
                    <Sparkles size={16} />
                </div>
            )}
            <div className={`ai-message-bubble ${msg.role}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>

                {msg.actionData && msg.actionData.action === 'SHOW_FORM' && (
                    <MiniForm
                        type={msg.actionData.formType}
                        initialData={msg.actionData.data}
                        onConfirm={onFormConfirm}
                    />
                )}

                <span className="ai-time">{msg.time}</span>
            </div>
        </div>
    );
};

export default ChatMessage;
