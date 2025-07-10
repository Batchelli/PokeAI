import React from 'react';
import type { BattlePokemon } from '../../types';
import TeamSidebarItem from './TeamSidebarItem';

interface TeamSidebarProps {
    team: BattlePokemon[];
    isPlayer: boolean;
    onPokemonSelect?: (index: number) => void;
    disabled?: boolean;
    activeIndex: number;
}

const TeamSidebar: React.FC<TeamSidebarProps> = ({ team, isPlayer, onPokemonSelect, disabled = false, activeIndex }) => {
    return (
        <div className="hidden md:flex flex-col w-64 flex-shrink-0 bg-slate-800/60 p-3 rounded-2xl border-2 border-slate-700/80">
            <h3 className="text-center font-press-start text-base mb-4 text-slate-300">{isPlayer ? 'Your Team' : 'Opponent'}</h3>
            <div className="space-y-2 overflow-y-auto pr-1">
                {team.map((pokemon, index) => (
                    <TeamSidebarItem
                        key={`${pokemon.id}-${index}`}
                        pokemon={pokemon}
                        isActive={index === activeIndex}
                        onClick={isPlayer && onPokemonSelect ? () => onPokemonSelect(index) : undefined}
                        disabled={disabled || !isPlayer || pokemon.isFainted || index === activeIndex}
                    />
                ))}
                 {team.length < 6 && Array.from({length: 6 - team.length}).map((_, i) => (
                    <div key={`empty-${i}`} className="h-[68px] bg-slate-900/40 rounded-lg flex items-center justify-center">
                        <div className="w-5 h-5 bg-slate-700 rounded-full" />
                    </div>
                 ))}
            </div>
        </div>
    );
};

export default TeamSidebar;
