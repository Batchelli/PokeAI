import React from 'react';
import type { BattlePokemon } from '../../types';
import { IconMdiPokeball } from '../IconMdiPokeball';

interface TeamSidebarItemProps {
    pokemon: BattlePokemon;
    isActive: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

const getHealthBarColor = (percentage: number): string => {
    if (percentage <= 20) return 'bg-red-600';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
};

const TeamSidebarItem: React.FC<TeamSidebarItemProps> = ({ pokemon, isActive, onClick, disabled = false }) => {
    const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;
    const hpBarColor = getHealthBarColor(hpPercentage);
    
    const spriteUrl = pokemon.sprites.front_default;

    const containerClasses = `relative group flex items-center p-2 rounded-lg transition-all duration-200 border-2 
        ${isActive ? 'bg-slate-700/80 border-amber-400 shadow-lg' : 'bg-slate-900/60 border-transparent'}
        ${pokemon.isFainted ? 'opacity-40' : ''}
        ${!disabled && onClick ? 'cursor-pointer hover:border-amber-400' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60' : ''}
    `;

    return (
        <div className={containerClasses} onClick={!disabled ? onClick : undefined}>
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-800/50 rounded-md">
                {spriteUrl && <img src={spriteUrl} alt={pokemon.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />}
            </div>
            <div className="flex-grow ml-3 overflow-hidden">
                <p className="text-sm font-bold capitalize truncate text-white">{pokemon.name}</p>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-1 border border-slate-900/50">
                    <div className={`h-full rounded-full ${hpBarColor} transition-all duration-300`} style={{ width: `${hpPercentage}%` }}></div>
                </div>
                <p className="text-xs font-roboto-mono font-bold text-right mt-1 text-slate-300">{pokemon.currentHp}/{pokemon.maxHp}</p>
            </div>
             <div className="absolute top-1 right-1">
                <IconMdiPokeball 
                    height="20" 
                    width="20" 
                    className={`${pokemon.isFainted ? 'text-slate-600' : 'text-slate-400'} ${isActive && !pokemon.isFainted ? 'text-amber-400 animate-pulse' : ''}`}
                />
             </div>
        </div>
    );
};

export default TeamSidebarItem;
