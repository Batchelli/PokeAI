import React from 'react';

interface TeamNeededModalProps {
    onClose: () => void;
    onGoToTeamBuilder: () => void;
}

const TeamNeededModal: React.FC<TeamNeededModalProps> = ({ onClose, onGoToTeamBuilder }) => {
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 relative p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Team Required</h2>
                <p className="text-slate-300 mb-6">
                    You have an incomplete or empty team. Most battle modes require at least one Pokémon.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Close
                    </button>
                    <button onClick={onGoToTeamBuilder} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Go to Team Builder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamNeededModal;