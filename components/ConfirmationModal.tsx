import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'bg-red-600 hover:bg-red-700',
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const handleConfirm = () => {
        onConfirm();
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirmation-title"
        >
            <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 relative p-6">
                <button onClick={onClose} className="absolute top-3 right-3 text-white bg-slate-700/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10" aria-label="Close">
                    &times;
                </button>
                <h2 id="confirmation-title" className="text-2xl font-bold text-white mb-4">{title}</h2>
                <p className="text-slate-300 mb-6">{message}</p>
                <div className="mt-6 flex gap-4">
                    <button onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        {cancelText}
                    </button>
                    <button onClick={handleConfirm} className={`flex-1 text-white font-bold py-2 px-4 rounded-lg transition-colors ${confirmButtonClass}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
