import React from 'react';
import { DICE_ICON, SHUFFLE_ICON } from '../constants.tsx';

interface RandomBattleModalProps {
    onClose: () => void;
    onStartBattle: () => void;
    hasTeam: boolean;
}

const OptionCard = ({ icon, title, description, onClick, disabled = false }: { icon: React.ReactNode, title: string, description: string, onClick: () => void, disabled?: boolean }) => (
    <div 
        onClick={!disabled ? onClick : undefined} 
        className={`bg-slate-800 p-6 rounded-xl border-2 border-slate-700 transition-all duration-300 text-center flex flex-col items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-500 hover:bg-slate-700/50 cursor-pointer'}`}
        title={disabled ? 'This option requires at least one Pokémon in your team.' : ''}
    >
        <div className="text-amber-400">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
    </div>
);

const RandomBattleModal: React.FC<RandomBattleModalProps> = ({ onClose, onStartBattle, hasTeam }) => {
    
    const handleSelection = () => {
        // In the future, this could take a type and set some state in a context.
        // For now, it just triggers navigation.
        onStartBattle();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border-4 border-slate-700 relative p-6">
                <button onClick={onClose} className="absolute top-3 right-3 text-white bg-slate-700/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10">&times;</button>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Random Battle Options</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OptionCard 
                        icon={DICE_ICON}
                        title="Random Team"
                        description="Get a completely random team of 6 Pokémon with random moves and levels."
                        onClick={handleSelection}
                    />
                    <OptionCard 
                        icon={SHUFFLE_ICON}
                        title="Random Moveset"
                        description="Use your current team, but with randomized movesets. All Pokémon set to Level 50."
                        onClick={handleSelection}
                        disabled={!hasTeam}
                    />
                </div>
            </div>
        </div>
    );
};

export default RandomBattleModal;