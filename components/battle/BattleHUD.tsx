import React from 'react';
import type { BattlePokemon } from '../../types';

interface BattleHUDProps {
    pokemon: BattlePokemon | null;
    isPlayer: boolean;
}

const getHealthBarColor = (percentage: number): string => {
    if (percentage < 20) return 'from-red-600 to-red-500';
    if (percentage < 50) return 'from-yellow-500 to-yellow-400';
    return 'from-green-500 to-lime-400';
};

const HealthBar: React.FC<{ currentHp: number, maxHp: number }> = ({ currentHp, maxHp }) => {
    const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    const barColorGradient = getHealthBarColor(percentage);

    return (
        <div className="h-2.5 w-full bg-slate-800/80 rounded-full border border-slate-900/50 shadow-inner">
            <div
                className={`h-full rounded-full bg-gradient-to-r ${barColorGradient} transition-all duration-500 ease-in-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

const BattleHUD: React.FC<BattleHUDProps> = ({ pokemon, isPlayer }) => {
    if (!pokemon) return null;

    const hudContainerClasses = isPlayer
        ? 'absolute bottom-4 right-2 sm:right-6 lg:right-10 rounded-tr-3xl rounded-bl-3xl'
        : 'absolute top-4 sm:top-6 lg:top-10 left-2 sm:left-6 lg:left-10 rounded-tl-3xl rounded-br-3xl';
    
    const hpTextClasses = 'font-roboto-mono text-base font-bold text-right tracking-tighter';

    return (
        <div className={`w-52 sm:w-60 md:w-64 bg-slate-900/80 backdrop-blur-sm p-3 border-2 border-slate-800/60 shadow-lg text-white ${hudContainerClasses}`}>
            <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-press-start text-sm sm:text-base capitalize truncate pr-2">{pokemon.name.replace('-', ' ')}</h3>
                <span className="font-roboto-mono font-bold text-sm">Lv{pokemon.level}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-press-start text-xs font-bold">HP</span>
                <HealthBar currentHp={pokemon.currentHp} maxHp={pokemon.maxHp} />
            </div>
            {isPlayer && (
                 <p className={hpTextClasses}>
                    {pokemon.currentHp}/{pokemon.maxHp}
                </p>
            )}
        </div>
    );
};

export default BattleHUD;