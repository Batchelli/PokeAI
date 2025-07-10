import React from 'react';
import type { BattlePokemon, PokemonSpriteStatus } from '../../types';

interface BattleSceneProps {
    playerPokemon: BattlePokemon | null;
    opponentPokemon: BattlePokemon | null;
    playerSpriteStatus: PokemonSpriteStatus;
    opponentSpriteStatus: PokemonSpriteStatus;
}

const BattleScene: React.FC<BattleSceneProps> = ({ playerPokemon, opponentPokemon, playerSpriteStatus, opponentSpriteStatus }) => {
    
    const getPlayerSprite = () => {
        if (!playerPokemon) return null;
        return playerPokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.back_default
            || playerPokemon.sprites.back_default
            || playerPokemon.sprites.front_default; // Fallback to front if back is null
    }

    const playerSpriteUrl = getPlayerSprite();
    const playerAnimatedSprite = playerPokemon?.sprites.versions?.['generation-v']?.['black-white']?.animated?.back_default;

    const getPlayerAnimationClass = () => {
        if (playerPokemon?.isFainted) return 'animate-faint';
        switch (playerSpriteStatus) {
            case 'withdrawing': return 'animate-withdraw-player';
            case 'entering': return 'animate-enter-player';
            case 'attacking': return 'animate-attack-player';
            case 'idle':
            default:
                return playerAnimatedSprite ? '' : 'animate-player-idle';
        }
    };

    const opponentAnimatedSprite = opponentPokemon?.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
    const opponentSpriteUrl = opponentAnimatedSprite ?? opponentPokemon?.sprites.front_default;
    
    const getOpponentAnimationClass = () => {
        if (opponentPokemon?.isFainted) return 'animate-faint';
        if (opponentSpriteStatus === 'attacking') return 'animate-attack-opponent';
        return opponentAnimatedSprite ? '' : 'animate-opponent-idle';
    };
    
    return (
        <div className="absolute inset-0 w-full h-full">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-sky-600"></div>
            
            {/* Platforms */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                     <ellipse cx="200" cy="120" rx="400" ry="60" fill="#65a30d" />
                </svg>
            </div>
             <div className="absolute -top-10 left-0 right-0 h-1/2">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                     <ellipse cx="200" cy="-20" rx="350" ry="45" fill="#84cc16" />
                </svg>
            </div>

            {/* Sprites */}
            {playerPokemon && playerSpriteUrl && (
                <div className={`absolute bottom-[5%] left-[10%] w-[35%] max-w-[280px] transition-opacity duration-500 ${getPlayerAnimationClass()}`}>
                    <img src={playerSpriteUrl} alt={playerPokemon.name} className="w-full h-auto object-contain drop-shadow-2xl" style={{ imageRendering: 'pixelated' }} />
                </div>
            )}
            
            {opponentPokemon && opponentSpriteUrl && (
                 <div className={`absolute top-[12%] right-[10%] w-[28%] max-w-[200px] transition-opacity duration-500 ${getOpponentAnimationClass()}`}>
                    <img src={opponentSpriteUrl} alt={opponentPokemon.name} className="w-full h-auto object-contain drop-shadow-2xl" style={{ imageRendering: 'pixelated' }}/>
                </div>
            )}

        </div>
    );
};

export default BattleScene;