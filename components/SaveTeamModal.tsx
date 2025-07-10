import React, { useState } from 'react';

interface SaveTeamModalProps {
    onClose: () => void;
    onSave: (teamName: string) => void;
    existingTeamNames: string[];
}

const SaveTeamModal: React.FC<SaveTeamModalProps> = ({ onClose, onSave, existingTeamNames }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('Team name cannot be empty.');
            return;
        }
        if (existingTeamNames.map(n => n.toLowerCase()).includes(trimmedName.toLowerCase())) {
            setError('A team with this name already exists.');
            return;
        }
        onSave(trimmedName);
    };

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
            <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 relative p-6">
                 <button onClick={onClose} className="absolute top-3 right-3 text-white bg-slate-700/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10">
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">Save New Team</h2>
                <div className="space-y-4">
                    <label htmlFor="team-name" className="block text-sm font-medium text-slate-300">
                        Team Name
                    </label>
                    <input
                        id="team-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="e.g., Kanto Champions"
                        className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all text-white"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                </div>
                <div className="mt-6 flex gap-4">
                    <button onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveTeamModal;