import React from 'react';
import type { BattlePokemon } from '../../types';

interface BattleHUDProps {
    pokemon: BattlePokemon | null;
    isPlayer: boolean;
}

const HealthBar: React.FC<{ currentHp: number, maxHp: number }> = ({ currentHp, maxHp }) => {
    const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage < 50) barColor = 'bg-yellow-400';
    if (percentage < 20) barColor = 'bg-red-600';

    return (
        <div className="h-2 w-full bg-gray-600 rounded-full">
            <div
                className={`h-full rounded-full ${barColor} transition-all duration-500 ease-in-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

const BattleHUD: React.FC<BattleHUDProps> = ({ pokemon, isPlayer }) => {
    if (!pokemon) return null;

    const hudContainerClasses = isPlayer
        ? 'absolute bottom-[130px] sm:bottom-[150px] right-0 sm:right-4'
        : 'absolute top-4 left-4';

    const nameLevelClasses = 'flex justify-between items-baseline mb-1';
    const hpTextClasses = isPlayer ? 'text-sm font-bold text-right' : 'hidden';

    return (
        <div className={`w-64 bg-slate-200 p-2 rounded-lg border-4 border-gray-700 shadow-lg text-gray-800 ${hudContainerClasses}`}>
            <div className={nameLevelClasses}>
                <h3 className="text-lg font-bold capitalize">{pokemon.name.replace('-', ' ')}</h3>
                <span className="text-lg">Lv{pokemon.level}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-bold text-sm">HP</span>
                <HealthBar currentHp={pokemon.currentHp} maxHp={pokemon.maxHp} />
            </div>
            {isPlayer && (
                 <p className={hpTextClasses}>
                    {pokemon.currentHp} / {pokemon.maxHp}
                </p>
            )}
        </div>
    );
};

export default BattleHUD;
