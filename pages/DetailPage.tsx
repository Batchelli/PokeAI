import React, { useState, useEffect, useMemo } from 'react';
import { getPokemon } from '../services/pokeapi';
import type { Pokemon, Move } from '../types';
import { POKEBALL_ICON, TYPE_COLORS, STAT_NICKNAMES } from '../constants.tsx';
import StatBar from '../components/StatBar';

interface DetailPageProps {
    pokemonId: string;
    onBack: () => void;
}

const calculateStat = (base: number, level: number, isHp: boolean = false): number => {
    // Simplified formula assuming neutral nature, 31 IVs, and 0 EVs
    if (isHp) {
        if (base === 1) return 1; // Shedinja case
        return Math.floor(0.01 * (2 * base + 31) * level) + level + 10;
    }
    return Math.floor(0.01 * (2 * base + 31) * level) + 5;
};

interface ProcessedMove {
    name: string;
    method: string;
    level: number;
    obj: Move['move'];
}

const DetailPage: React.FC<DetailPageProps> = ({ pokemonId, onBack }) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isShiny, setIsShiny] = useState<boolean>(false);
    const [level, setLevel] = useState<number>(50);
    const [moveset, setMoveset] = useState<Move['move'][]>([]);
    const [moveSearch, setMoveSearch] = useState('');

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            if (!pokemonId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getPokemon(pokemonId);
                setPokemon(data);
                setMoveset([]);
                setMoveSearch('');
                setLevel(50);
                setIsShiny(false);
            } catch (err) {
                setError('Could not load Pokémon details.');
            } finally {
                setLoading(false);
            }
        };
        fetchPokemonDetails();
    }, [pokemonId]);

    const primaryType = pokemon?.types[0]?.type.name || 'default';
    const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.default;
    const formatId = (id: number) => `#${id.toString().padStart(4, '0')}`;
    const imageUrl = isShiny 
        ? pokemon?.sprites.other['official-artwork'].front_shiny 
        : pokemon?.sprites.other['official-artwork'].front_default;

    const calculatedStats = useMemo(() => {
        if (!pokemon) return {};
        const stats: { [key: string]: number } = {};
        pokemon.stats.forEach(s => {
            stats[s.stat.name] = calculateStat(s.base_stat, level, s.stat.name === 'hp');
        });
        return stats;
    }, [pokemon, level]);
    
    const learnableMoves = useMemo((): ProcessedMove[] => {
        if (!pokemon) return [];
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
    
    const addMoveToMoveset = (move: Move['move']) => {
        if (moveset.length < 4 && !moveset.find(m => m.name === move.name)) {
            setMoveset([...moveset, move]);
        }
    };
    
    const removeMoveFromMoveset = (moveName: string) => {
        setMoveset(moveset.filter(m => m.name !== moveName));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-slate-300">
            <div className="animate-spin text-6xl">{POKEBALL_ICON}</div>
            <p className="mt-4 text-lg font-bold">Loading Details...</p>
        </div>
    );
    if (error || !pokemon) return (
         <div className="text-center py-10">
            <p className="text-red-400 font-bold text-lg">{error || 'Could not find this Pokémon.'}</p>
            <button onClick={onBack} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">&larr; Go Back</button>
        </div>
    );

    return (
        <div className="w-full">
            <div className="mb-6"><button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">&larr; Back</button></div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Info & Image */}
                <div className="lg:w-1/3 flex-shrink-0">
                    <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 sticky top-4">
                        <div className="flex justify-between items-start">
                           <p className="font-press-start text-2xl text-amber-300">{formatId(pokemon.id)}</p>
                           <button onClick={() => setIsShiny(s => !s)} className={`px-3 py-1.5 text-sm font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${isShiny ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30' : 'bg-slate-600 text-white hover:bg-slate-500'}`}>
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90"><path d="M12 .5l3.09 6.26L22 7.77l-5 4.87 1.18 6.88L12 16.31l-6.18 3.21L7 12.64 2 7.77l6.91-1.01L12 .5z"/></svg>
                               Shiny
                           </button>
                        </div>
                        <img src={imageUrl} alt={pokemon.name} className="h-64 w-full object-contain animate-pulse-slow my-4" key={imageUrl} />
                        <h2 className="text-4xl font-bold capitalize text-white text-center">{pokemon.name.replace('-', ' ')}</h2>
                        <div className="flex justify-center gap-2 my-4">
                            {pokemon.types.map(({ type }) => <span key={type.name} className={`px-4 py-1 rounded-full text-sm font-bold capitalize border-b-4 ${TYPE_COLORS[type.name] || TYPE_COLORS.default}`}>{type.name}</span>)}
                        </div>
                    </div>
                </div>

                {/* Right Column - Tools */}
                <div className="lg:w-2/3 min-w-0">
                    {/* Stats Calculator */}
                    <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 mb-8">
                        <h3 className="font-bold text-2xl text-slate-200 mb-4">Stat Calculator</h3>
                        <div className="mb-4">
                            <label htmlFor="level-slider" className="block mb-2 font-bold text-slate-300">Level: <span className="text-amber-400">{level}</span></label>
                            <input type="range" id="level-slider" min="1" max="100" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-300 mb-2 text-center">Base Stats</h4>
                                <div className="space-y-2">
                                    {pokemon.stats.map((stat, i) => <StatBar key={i} stat={stat} typeColor={typeColor} />)}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-bold text-lg text-slate-300 mb-2 text-center">Stats at Lvl {level}</h4>
                                 <div className="space-y-2">
                                    {pokemon.stats.map(stat => (
                                         <div key={stat.stat.name} className="flex items-center gap-2 w-full text-sm">
                                            <p className="w-1/4 text-right font-bold text-slate-400">{STAT_NICKNAMES[stat.stat.name]}</p>
                                            <div className="w-2/4 bg-slate-700 rounded-full h-5 flex items-center justify-center font-bold text-white">
                                                {calculatedStats[stat.stat.name]}
                                            </div>
                                            <p className="w-1/4"></p>
                                        </div>
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </div>

                    {/* Physical Attributes */}
                    <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 mb-8">
                        <h3 className="font-bold text-2xl text-slate-200 mb-4">Physical Attributes</h3>
                        <div className="flex justify-around text-center w-full">
                            <div>
                                <p className="text-slate-400 text-sm">Weight</p>
                                <p className="font-bold text-lg">{(pokemon.weight / 10).toFixed(1)} kg</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Height</p>
                                <p className="font-bold text-lg">{(pokemon.height / 10).toFixed(1)} m</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Moveset Builder */}
                    <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700">
                        <h3 className="font-bold text-2xl text-slate-200 mb-4">Moveset Builder</h3>
                         {/* Selected Moves */}
                        <div className="mb-4">
                            <h4 className="font-bold text-lg text-slate-300 mb-2">Selected Moves ({moveset.length}/4)</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-slate-900/80 h-12 rounded-lg flex items-center justify-between px-3 text-sm capitalize">
                                        {moveset[i] ? (
                                          <>
                                            <span>{moveset[i].name.replace('-', ' ')}</span>
                                            <button onClick={() => removeMoveFromMoveset(moveset[i].name)} className="text-red-500 hover:text-red-400 text-lg">&times;</button>
                                          </>
                                        ) : <span className="text-slate-500">Empty Slot</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Available Moves */}
                        <div>
                             <h4 className="font-bold text-lg text-slate-300 mb-2">Available Moves</h4>
                             <input type="text" placeholder="Search moves..." value={moveSearch} onChange={e => setMoveSearch(e.target.value)} className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-2"/>
                             <div className="max-h-80 overflow-y-auto pr-2">
                                <table className="w-full text-left text-sm text-slate-300">
                                     <thead className="bg-slate-900/50 sticky top-0"><tr><th className="p-2 w-1/6">Lvl</th><th className="p-2 w-4/6">Move</th><th className="p-2 w-1/6">Add</th></tr></thead>
                                     <tbody>
                                         {filteredMoves.map(move => (
                                             <tr key={move.name} className="border-b border-slate-700/50">
                                                 <td className="p-2 font-bold">{move.method === 'Lvl' ? move.level : '-'}</td>
                                                 <td className="p-2 capitalize">{move.name}</td>
                                                 <td className="p-2 text-center">
                                                     <button onClick={() => addMoveToMoveset(move.obj)} disabled={moveset.length >= 4 || !!moveset.find(m => m.name === move.obj.name)} className="bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-green-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center">+</button>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                </table>
                                {filteredMoves.length === 0 && <p className="text-center text-slate-500 p-4">No moves found.</p>}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;