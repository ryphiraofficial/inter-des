import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../../views/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const sanitizeMessage = (msg, type) => {
        if (!msg || typeof msg !== 'string') return 'An unexpected issue occurred. Please try again.';
        let clean = msg.trim();
        if (type === 'error' || clean.toLowerCase().includes('failed') || clean.toLowerCase().includes('error')) {
            if (clean.includes('E11000 duplicate key')) return 'A record with this information already exists.';
            if (clean.includes('Cast to ObjectId failed')) return 'Invalid reference ID provided.';
            if (clean.includes('ValidationError:')) clean = clean.replace(/^ValidationError:\s*/, '');
            if (clean.includes('TypeError:') || clean.includes('ReferenceError:') || clean.includes('SyntaxError:')) {
                return 'Unable to complete operation. Please verify input.';
            }
            clean = clean.replace(/^(Error|AxiosError|FetchError):\s*/i, '');
        }
        return clean;
    };

    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const cleanMsg = sanitizeMessage(message, type);
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message: cleanMsg, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
