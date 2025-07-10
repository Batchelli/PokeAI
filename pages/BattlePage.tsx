import React, { useState } from 'react';
import RandomBattleModal from '../components/RandomBattleModal';
import TeamNeededModal from '../components/TeamNeededModal';
import { useTeam } from '../context/TeamContext';
import { DICE_ICON, TROPHY_ICON, TARGET_ICON } from '../constants.tsx';

interface BattlePageProps {
    onBack: () => void;
    onNavigateToRandomBattle: () => void;
}

const BattleModeCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-amber-500 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer text-center flex flex-col items-center gap-4 animate-fade-in-up"
        >
            <div className="text-amber-400">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
};


const BattlePage: React.FC<BattlePageProps> = ({ onBack, onNavigateToRandomBattle }) => {
    const { team } = useTeam();
    const [isRandomModalOpen, setRandomModalOpen] = useState(false);
    const [isTeamNeededModalOpen, setIsTeamNeededModalOpen] = useState(false);

    const hasMinTeam = team.some(member => member !== null);

    const handleModeSelection = (mode: string) => {
        if (!hasMinTeam) {
            setIsTeamNeededModalOpen(true);
        } else {
            alert(`You selected ${mode} Battle! This feature is coming soon.`);
        }
    };

    const handleRandomBattleClick = () => {
        setRandomModalOpen(true);
    };

    return (
        <div className="w-full">
            {isRandomModalOpen && (
                <RandomBattleModal
                    onClose={() => setRandomModalOpen(false)}
                    onStartBattle={onNavigateToRandomBattle}
                    hasTeam={hasMinTeam}
                />
            )}
            {isTeamNeededModalOpen && (
                <TeamNeededModal
                    onClose={() => setIsTeamNeededModalOpen(false)}
                    onGoToTeamBuilder={onBack}
                />
            )}
            <div className="flex justify-between items-center mb-6 px-2">
                 <h2 className="text-3xl font-bold text-slate-200">Choose a Battle Mode</h2>
                 <button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    &larr; Back to Team Builder
                </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <BattleModeCard 
                    icon={DICE_ICON}
                    title="Random Battle"
                    description="Face a random opponent with a system-generated team. The ultimate test of adaptability."
                    onClick={handleRandomBattleClick}
                />
                 <BattleModeCard 
                    icon={TROPHY_ICON}
                    title="League Challenge"
                    description="Challenge the region's Gym Leaders and the Elite Four to become the Champion."
                    onClick={() => handleModeSelection('League')}
                />
                 <BattleModeCard 
                    icon={TARGET_ICON}
                    title="Training Battle"
                    description="Hone your skills against a controlled opponent. Choose your opponent's team and level."
                    onClick={() => handleModeSelection('Training')}
                />
            </div>
        </div>
    );
};

export default BattlePage;