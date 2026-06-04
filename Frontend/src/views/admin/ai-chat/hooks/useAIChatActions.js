import { useAiQueryMutation } from '../../../../store/api/sharedApi';

export const useAIChatActions = ({ 
    input, setInput, messages, setMessages, setIsLoading, isLoading, location, navigate 
}) => {
    const [aiQuery] = useAiQueryMutation();

    const handleAIAction = (actionObj) => {
        const { action, path, data, formType } = actionObj;

        if (action === 'NAVIGATE' && path) {
            navigate(path);
        } else if (action === 'SUBMIT_FORM' && formType && data) {
            sessionStorage.setItem('AI_PENDING_DATA', JSON.stringify({ type: formType, data }));

            if (formType === 'QUOTATION') {
                window.dispatchEvent(new CustomEvent('AI_POPULATE_QUOTATION', { detail: data }));
                if (location.pathname !== '/quotations/new') navigate('/quotations/new');
            } else if (formType === 'CLIENT') {
                window.dispatchEvent(new CustomEvent('AI_POPULATE_CLIENT', { detail: data }));
                if (location.pathname !== '/clients') navigate('/clients');
            } else if (formType === 'INVENTORY') {
                window.dispatchEvent(new CustomEvent('AI_POPULATE_INVENTORY', { detail: data }));
                if (location.pathname !== '/inventory') navigate('/inventory');
            } else if (formType === 'TASK') {
                window.dispatchEvent(new CustomEvent('AI_POPULATE_TASK', { detail: data }));
                if (location.pathname !== '/tasks') navigate('/tasks');
            }
        }
    };

    const handleSend = async (text = input) => {
        const query = text || input;
        if (!query.trim() || isLoading) return;

        const userMsg = {
            role: 'user',
            content: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await aiQuery({ prompt: query, currentPath: location.pathname, pageState: {} }).unwrap();

            if (response.success) {
                let botText = response.data;
                let actionData = null;

                const jsonPattern = /\{[\s\S]*"action"[\s\S]*\}/;
                const jsonMatch = botText.match(jsonPattern);

                if (jsonMatch) {
                    try {
                        actionData = JSON.parse(jsonMatch[0]);
                        botText = botText.replace(jsonMatch[0], '').trim();
                        if (botText === '') botText = "I've prepared that for you! Check the form.";
                    } catch (e) {
                        try {
                            actionData = JSON.parse(botText);
                            botText = "I've handled that for you! ✨";
                        } catch (innerE) {
                            console.error('Action parsing error:', innerE);
                        }
                    }
                }

                setMessages(prev => [...prev, {
                    role: 'bot',
                    content: botText,
                    actionData: actionData,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);

                if (actionData && actionData.action !== 'SHOW_FORM') {
                    handleAIAction(actionData);
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: "I'm having trouble connecting to my creative brain right now. Please try again in a moment.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSend, handleAIAction };
};
