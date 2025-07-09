import React, { useState, useEffect } from 'react';
import { getPokemon } from '../services/pokeapi';
import type { Pokemon } from '../types';
import { POKEBALL_ICON, TYPE_COLORS } from '../constants.tsx';
import StatBar from './StatBar';

interface PokemonModalProps {
    pokemonId: string;
    onClose: () => void;
    onNavigateToDetail: (pokemonId: string) => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemonId, onClose, onNavigateToDetail }) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            if (!pokemonId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getPokemon(pokemonId);
                setPokemon(data);
            } catch (err) {
                setError('Could not load Pokémon details.');
            } finally {
                setLoading(false);
            }
        };
        fetchPokemonDetails();
    }, [pokemonId]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const primaryType = pokemon?.types[0]?.type.name || 'default';
    const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.default;
    
    const initialMoves = pokemon?.moves
        .filter(move => move.version_group_details.some(detail => detail.level_learned_at === 1 && detail.move_learn_method.name === 'level-up'))
        .map(move => move.move.name.replace('-', ' '))
        .slice(0, 5) ?? [];

    const formatId = (id: number) => `#${id.toString().padStart(4, '0')}`;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-3 right-3 text-white bg-slate-700/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10">
                    &times;
                </button>
                {loading && (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-300">
                        <div className="animate-spin text-6xl">{POKEBALL_ICON}</div>
                        <p className="mt-4 text-lg font-bold">Loading...</p>
                    </div>
                )}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center h-96 text-red-300">
                         <p className="font-bold text-lg">Error</p>
                         <p>{error}</p>
                    </div>
                )}
                {pokemon && !loading && (
                     <div className="flex flex-col lg:flex-row">
                        {/* Left Side */}
                        <div className="lg:w-1/2 p-6 flex flex-col items-center text-center bg-slate-900/50">
                            <p className="font-press-start text-xl text-amber-300 mb-2">{formatId(pokemon.id)}</p>
                             <img 
                                src={pokemon.sprites.other['official-artwork'].front_default} 
                                alt={pokemon.name} 
                                className="h-48 w-48 object-contain animate-pulse-slow"
                            />
                            <h2 className="text-4xl font-bold capitalize text-white mt-2">{pokemon.name.replace('-', ' ')}</h2>
                            <div className="flex justify-center gap-2 my-4">
                                {pokemon.types.map(({ type }) => (
                                <span
                                    key={type.name}
                                    className={`px-4 py-1 rounded-full text-sm font-bold capitalize border-b-4 ${TYPE_COLORS[type.name] || TYPE_COLORS.default}`}
                                >
                                    {type.name}
                                </span>
                                ))}
                            </div>
                            <div className="flex justify-around text-center w-full bg-slate-700/50 p-3 rounded-lg">
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
                        {/* Right Side */}
                        <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                            <div>
                                <h3 className="text-center font-bold text-xl text-slate-300 mb-3">Base Stats</h3>
                                <div className="space-y-2">
                                    {pokemon.stats.map((stat, index) => (
                                        <StatBar key={index} stat={stat} typeColor={typeColor} />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-center font-bold text-xl text-slate-300 mb-2">Initial Moves</h3>
                                {initialMoves.length > 0 ? (
                                    <p className="text-slate-400 text-center capitalize text-sm">
                                        {initialMoves.join(', ')}
                                    </p>
                                ) : (
                                    <p className="text-slate-500 text-center text-sm">No initial level-up moves found.</p>
                                )}
                            </div>
                             <div className="mt-6 text-center">
                                <button
                                    onClick={() => onNavigateToDetail(pokemon.id.toString())}
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors w-full"
                                >
                                    More Info & Tools
                                </button>
                            </div>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default PokemonModal;