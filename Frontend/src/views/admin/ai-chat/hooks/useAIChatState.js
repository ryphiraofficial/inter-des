import { useState } from 'react';

export const useAIChatState = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: "Hello! I'm your creative partner. I can help you draft quotations, manage inventory, or analyze your business. \n\nWhat are we building today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    return {
        isOpen, setIsOpen,
        showWelcome, setShowWelcome,
        input, setInput,
        messages, setMessages,
        isLoading, setIsLoading
    };
};
