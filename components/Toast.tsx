import React, { useEffect } from 'react';
import { SUCCESS_ICON } from '../constants.tsx';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
    type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000, type = 'success' }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose, duration]);

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return (
        <div 
            className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-2xl flex items-center gap-4 z-[60] animate-fade-in-up`}
            role="alert"
            aria-live="assertive"
        >
            {type === 'success' && SUCCESS_ICON}
            <span>{message}</span>
            <button onClick={onClose} className="text-lg opacity-80 hover:opacity-100 transition-opacity" aria-label="Dismiss">
                &times;
            </button>
        </div>
    );
};

export default Toast;
