import React, { useState, useEffect } from 'react';
import type { BattlePokemon, MoveDetail, BattleLogEntry } from '../../types';
import { TYPE_COLORS } from '../../constants.tsx';
import Typewriter from './Typewriter';

interface BattleInterfaceProps {
    logEntries: BattleLogEntry[];
    phase: 'intro' | 'player_action' | 'move_selection' | 'turn_processing' | 'forced_switch' | 'game_over';
    onPhaseEnd: () => void;
    playerPokemon: BattlePokemon | null;
    onMoveSelect: (move: MoveDetail) => void;
    onShowMoves: () => void;
    onReturnToActions: () => void;
    onRun: () => void;
    winner: string | null;
}

const BattleInterface: React.FC<BattleInterfaceProps> = ({ logEntries, phase, onPhaseEnd, playerPokemon, onMoveSelect, onShowMoves, onReturnToActions, onRun, winner }) => {
    const [currentLogIndex, setCurrentLogIndex] = useState(0);

    useEffect(() => {
        setCurrentLogIndex(0);
    }, [logEntries.length === 1 && logEntries[0]?.message.includes('appeared')]);

    useEffect(() => {
        if (logEntries[currentLogIndex] && !logEntries[currentLogIndex].typewriter) {
            const timer = setTimeout(() => {
                handleNextLog();
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [currentLogIndex, logEntries]);

    const handleNextLog = () => {
        if (currentLogIndex < logEntries.length - 1) {
            setCurrentLogIndex(prev => prev + 1);
        } else {
            if (phase === 'intro') {
                onPhaseEnd();
            }
        }
    };
    
    const currentEntry = logEntries[currentLogIndex];
    const showNextIndicator = phase === 'intro' && currentLogIndex < logEntries.length - 1 && currentEntry?.typewriter;

    const renderActionMenu = () => (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            <button onClick={onShowMoves} className="bg-red-700 hover:bg-red-600 font-press-start text-white font-bold rounded-lg transition-colors shadow-md text-lg">FIGHT</button>
            <button disabled className="bg-slate-700/60 text-slate-500 font-press-start font-bold rounded-lg cursor-not-allowed">BAG</button>
            <button disabled className="bg-slate-700/60 text-slate-500 font-press-start font-bold rounded-lg cursor-not-allowed">POKÉMON</button>
            <button onClick={onRun} className="bg-slate-600 hover:bg-slate-500 font-press-start text-white font-bold rounded-lg transition-colors">RUN</button>
        </div>
    );

    const renderMoveSelection = () => {
        const moves = playerPokemon?.moves ?? [];
        return (
            <div className="relative h-full w-full">
                <div className="grid grid-cols-2 grid-rows-2 gap-2.5 h-full">
                    {moves.map((move, i) => {
                        const typeClass = TYPE_COLORS[move.type.name] || TYPE_COLORS.default;
                        const borderColor = typeClass.split(' ').find(cls => cls.startsWith('border-')) || 'border-gray-600';
                        return (
                            <button key={i} onClick={() => onMoveSelect(move)} className={`group bg-slate-700/80 hover:bg-amber-500/10 text-white font-press-start rounded-lg transition-all duration-200 text-sm p-3 capitalize flex flex-col justify-between items-start text-left relative overflow-hidden border-l-8 ${borderColor} hover:border-amber-400`}>
                                <div className="flex justify-between w-full">
                                    <span className="truncate pr-2">{move.name.replace('-', ' ')}</span>
                                    <span className="font-roboto-mono text-xs opacity-70">PP {move.pp}/{move.pp}</span>
                                </div>
                                <div className="font-roboto-mono flex items-center gap-2 text-xs opacity-70 mt-1">
                                    <span>{move.type.name.toUpperCase()}</span>
                                    <div className="w-px h-3 bg-slate-600 group-hover:bg-amber-500/50"></div>
                                    <span>{move.damage_class.name.toUpperCase()}</span>
                                </div>
                            </button>
                        )
                    })}
                    {moves.length < 4 && Array.from({length: 4 - moves.length}).map((_, i) => <div key={i} className="bg-slate-700/50 rounded-lg"></div>)}
                </div>
                <button onClick={onReturnToActions} className="absolute bottom-1 right-1 bg-slate-600 hover:bg-slate-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg font-press-start">&larr;</button>
            </div>
        )
    };
    
    const renderLog = () => (
         <div onClick={phase === 'intro' ? handleNextLog : undefined} className={`p-1 h-full w-full relative font-press-start text-xl leading-relaxed ${phase === 'intro' ? 'cursor-pointer' : ''}`}>
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
            {phase === 'game_over' && (
                 <button onClick={onRun} className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors px-3 py-1.5 text-base">Exit</button>
            )}
         </div>
    );

    const renderControls = () => {
       if (phase === 'player_action') return renderActionMenu();
       if (phase === 'move_selection') return renderMoveSelection();
       // Render empty placeholders during other phases
       return <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">{Array.from({length: 4}).map((_,i) => <div key={i} className="bg-slate-700/20 rounded-lg" />)}</div>
    }

    return (
        <div className="grid grid-cols-12 gap-4 h-40 text-white">
            <div className="col-span-8 p-1">
                {renderControls()}
            </div>
            <div className="col-span-4 bg-slate-900/80 rounded-lg p-3 relative flex items-center justify-center">
                {renderLog()}
            </div>
        </div>
    );
};

export default BattleInterface;