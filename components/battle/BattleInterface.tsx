
import React, { useState, useEffect } from 'react';
import type { BattlePokemon, MoveDetail, BattleLogEntry } from '../../types';
import { TYPE_COLORS } from '../../constants.tsx';
import Typewriter from './Typewriter';

interface BattleInterfaceProps {
    logEntries: BattleLogEntry[];
    phase: 'intro' | 'player_action' | 'player_move' | 'turn_processing' | 'game_over';
    onPhaseEnd: () => void;
    playerPokemon: BattlePokemon | null;
    onMoveSelect: (move: MoveDetail) => void;
    onRun: () => void;
    winner: string | null;
}

const BattleInterface: React.FC<BattleInterfaceProps> = ({ logEntries, phase, onPhaseEnd, playerPokemon, onMoveSelect, onRun, winner }) => {
    const [currentLogIndex, setCurrentLogIndex] = useState(0);

    useEffect(() => {
        setCurrentLogIndex(0);
    }, [logEntries.length === 1]); // Reset when a new battle starts

    useEffect(() => {
        // Automatically advance non-typewriter logs
        if (logEntries[currentLogIndex] && !logEntries[currentLogIndex].typewriter) {
            const timer = setTimeout(() => {
                handleNextLog();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [currentLogIndex, logEntries]);

    const handleNextLog = () => {
        if (currentLogIndex < logEntries.length - 1) {
            setCurrentLogIndex(prev => prev + 1);
        } else {
            // Reached the end of the log sequence
            if (phase === 'intro') {
                onPhaseEnd();
            }
        }
    };
    
    const currentEntry = logEntries[currentLogIndex];
    const showNextIndicator = phase === 'intro' && currentLogIndex < logEntries.length - 1 && currentEntry?.typewriter;

    const renderContent = () => {
        if (phase === 'player_action') {
            return (
                <div className="grid grid-cols-2 gap-2 h-full">
                    <div className="col-span-1 flex items-center justify-center p-2">
                        <p>{logEntries[logEntries.length-1]?.message}</p>
                    </div>
                    <div className="col-span-1 grid grid-cols-2 gap-2 p-2 border-4 border-gray-700 rounded-lg">
                        <button onClick={() => onMoveSelect(playerPokemon!.moves[0])} className="bg-slate-50 hover:bg-slate-200 text-gray-800 font-bold rounded-lg transition-colors">FIGHT</button>
                        <button disabled className="bg-slate-50 text-gray-400 font-bold rounded-lg cursor-not-allowed">BAG</button>
                        <button disabled className="bg-slate-50 text-gray-400 font-bold rounded-lg cursor-not-allowed">POKÉMON</button>
                        <button onClick={onRun} className="bg-slate-50 hover:bg-slate-200 text-gray-800 font-bold rounded-lg transition-colors">RUN</button>
                    </div>
                </div>
            )
        }

        if (phase === 'player_move' || (phase === 'game_over' && winner)) {
            return (
                <div className="grid grid-cols-2 gap-4 h-full p-2">
                   {playerPokemon?.moves.map((move, i) => {
                       const typeClass = TYPE_COLORS[move.type.name] || TYPE_COLORS.default;
                       return (
                            <button key={i} onClick={() => onMoveSelect(move)} className={`text-white font-bold rounded-lg transition-colors text-base p-2 capitalize flex justify-between items-center ${typeClass}`}>
                               <span>{move.name.replace('-', ' ')}</span>
                               <span className="text-xs opacity-80">PP {move.pp}/{move.pp}</span>
                           </button>
                       )
                   })}
                </div>
            )
        }
        
        // Default log view for intro, processing, etc.
        return (
             <div onClick={phase === 'intro' ? handleNextLog : undefined} className="p-4 h-full w-full cursor-pointer relative">
                {currentEntry && (
                    currentEntry.typewriter ? (
                        <Typewriter text={currentEntry.message} speed={40} onComplete={handleNextLog} />
                    ) : (
                        <p>{currentEntry.message}</p>
                    )
                )}
                {showNextIndicator && (
                    <div className="absolute bottom-2 right-4 animate-bounce">▼</div>
                )}
             </div>
        )
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 h-[120px] sm:h-[140px] bg-slate-200 border-t-8 border-gray-700 text-gray-800 text-2xl p-2">
           {renderContent()}
        </div>
    );
};

export default BattleInterface;
