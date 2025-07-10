import React from 'react';
import type { BattlePokemon } from '../../types';

interface BattleSceneProps {
    playerPokemon: BattlePokemon | null;
    opponentPokemon: BattlePokemon | null;
}

const BattleScene: React.FC<BattleSceneProps> = ({ playerPokemon, opponentPokemon }) => {
    
    const playerSpriteUrl = playerPokemon?.sprites.back_default;
    const opponentSpriteUrl = opponentPokemon?.sprites.front_default;
    
    return (
        <div className="absolute inset-0 w-full h-full">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 to-sky-500"></div>
            
            {/* Platforms */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                     <ellipse cx="200" cy="120" rx="250" ry="60" fill="#65a30d" />
                </svg>
            </div>
             <div className="absolute -top-10 left-0 right-0 h-1/2">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                     <ellipse cx="200" cy="-20" rx="180" ry="35" fill="#84cc16" />
                </svg>
            </div>

            {/* Sprites */}
            {playerPokemon && playerSpriteUrl && (
                <div className={`absolute bottom-[10%] left-[15%] w-1/2 max-w-[200px] sm:max-w-[250px] transition-opacity duration-500 ${playerPokemon.isFainted ? 'animate-faint' : 'animate-player-idle'}`}>
                    <img src={playerSpriteUrl} alt={playerPokemon.name} className="w-full h-auto object-contain" style={{ imageRendering: 'pixelated' }} />
                </div>
            )}
            
            {opponentPokemon && opponentSpriteUrl && (
                 <div className={`absolute top-[18%] right-[15%] w-1/3 max-w-[150px] sm:max-w-[180px] transition-opacity duration-500 ${opponentPokemon.isFainted ? 'animate-faint' : 'animate-opponent-idle'}`}>
                    <img src={opponentSpriteUrl} alt={opponentPokemon.name} className="w-full h-auto object-contain" style={{ imageRendering: 'pixelated' }}/>
                </div>
            )}

        </div>
    );
};

export default BattleScene;
