import React, { useState, useMemo } from 'react';
import type { Pokemon, Move } from '../types';

interface MoveEditorModalProps {
    pokemon: Pokemon;
    initialMoves?: Move['move'][];
    onClose: () => void;
    onSave: (moves: Move['move'][]) => void;
}

interface ProcessedMove {
    name: string;
    method: string;
    level: number;
    obj: Move['move'];
}

const MoveEditorModal: React.FC<MoveEditorModalProps> = ({ pokemon, initialMoves = [], onClose, onSave }) => {
    const [selectedMoves, setSelectedMoves] = useState<Move['move'][]>(initialMoves);
    const [moveSearch, setMoveSearch] = useState('');

    const learnableMoves = useMemo((): ProcessedMove[] => {
        const moveMap = new Map<string, { method: string; level: number, obj: Move['move'] }>();

        pokemon.moves.forEach(moveData => {
            const moveName = moveData.move.name.replace(/-/g, ' ');
            if (moveMap.has(moveName)) return;

            const levelUpDetail = moveData.version_group_details.find(d => d.move_learn_method.name === 'level-up' && d.level_learned_at > 0);
            if (levelUpDetail) {
                moveMap.set(moveName, { method: 'Lvl', level: levelUpDetail.level_learned_at, obj: moveData.move });
                return;
            }
            
            const machineDetail = moveData.version_group_details.find(d => d.move_learn_method.name === 'machine');
            if (machineDetail) {
                moveMap.set(moveName, { method: 'TM/HM', level: 0, obj: moveData.move });
                return;
            }
            
            const tutorDetail = moveData.version_group_details.find(d => d.move_learn_method.name === 'tutor');
            if (tutorDetail) {
                moveMap.set(moveName, { method: 'Tutor', level: 0, obj: moveData.move });
                return;
            }
        });
        
        return Array.from(moveMap.entries())
            .map(([name, details]) => ({ name, ...details }))
            .sort((a, b) => {
                if (a.method === 'Lvl' && b.method !== 'Lvl') return -1;
                if (a.method !== 'Lvl' && b.method === 'Lvl') return 1;
                if (a.method === 'Lvl' && b.method === 'Lvl') return a.level - b.level;
                return a.name.localeCompare(b.name);
            });
    }, [pokemon]);

    const filteredMoves = useMemo(() => {
        return learnableMoves.filter(move => move.name.toLowerCase().includes(moveSearch.toLowerCase()));
    }, [learnableMoves, moveSearch]);

    const addMove = (move: Move['move']) => {
        if (selectedMoves.length < 4 && !selectedMoves.find(m => m.name === move.name)) {
            setSelectedMoves([...selectedMoves, move]);
        }
    };

    const removeMove = (moveName: string) => {
        setSelectedMoves(selectedMoves.filter(m => m.name !== moveName));
    };
    
    const handleSave = () => {
        onSave(selectedMoves);
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
            <div className="w-full max-w-2xl h-[90vh] bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 relative flex flex-col">
                <button onClick={onClose} className="absolute top-3 right-3 text-white bg-slate-700/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10">
                    &times;
                </button>
                 <div className="p-6 border-b border-slate-700 flex items-center gap-4">
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} className="h-12 w-12 bg-slate-700/50 rounded-full" />
                    <h2 className="text-2xl font-bold text-white capitalize">Select Moves for {pokemon.name.replace('-', ' ')}</h2>
                </div>

                <div className="p-6 flex-grow overflow-y-hidden flex flex-col gap-4">
                     {/* Selected Moves */}
                    <div>
                        <h4 className="font-bold text-lg text-slate-300 mb-2">Selected Moves ({selectedMoves.length}/4)</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-slate-900/80 h-12 rounded-lg flex items-center justify-between px-3 text-sm capitalize">
                                    {selectedMoves[i] ? (
                                        <>
                                        <span>{selectedMoves[i].name.replace('-', ' ')}</span>
                                        <button onClick={() => removeMove(selectedMoves[i].name)} className="text-red-500 hover:text-red-400 text-lg">&times;</button>
                                        </>
                                    ) : <span className="text-slate-500">Empty Slot</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                     {/* Available Moves */}
                    <div className="flex-grow flex flex-col min-h-0">
                        <h4 className="font-bold text-lg text-slate-300 mb-2">Available Moves</h4>
                        <input type="text" placeholder="Search moves..." value={moveSearch} onChange={e => setMoveSearch(e.target.value)} className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2 flex-shrink-0"/>
                        <div className="flex-grow overflow-y-auto pr-2">
                            <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-900/50 sticky top-0"><tr><th className="p-2 w-1/6">Lvl</th><th className="p-2 w-4/6">Move</th><th className="p-2 w-1/6">Add</th></tr></thead>
                                    <tbody>
                                        {filteredMoves.map(move => (
                                            <tr key={move.name} className="border-b border-slate-700/50">
                                                <td className="p-2 font-bold">{move.method === 'Lvl' ? move.level : '-'}</td>
                                                <td className="p-2 capitalize">{move.name}</td>
                                                <td className="p-2 text-center">
                                                    <button onClick={() => addMove(move.obj)} disabled={selectedMoves.length >= 4 || !!selectedMoves.find(m => m.name === move.obj.name)} className="bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-green-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center">+</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                            {filteredMoves.length === 0 && <p className="text-center text-slate-500 p-4">No moves found.</p>}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700">
                    <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Confirm and Add to Team
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveEditorModal;
