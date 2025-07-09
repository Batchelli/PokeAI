import React, { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getGeneration, getType } from '../services/pokeapi';
import type { PokemonListItem } from '../types';
import { POKEBALL_ICON, GENERATIONS, TYPE_COLORS } from '../constants.tsx';

interface PokemonSelectionModalProps {
    onClose: () => void;
    onSelect: (pokemonId: string) => void;
}

const PokemonSelectionModal: React.FC<PokemonSelectionModalProps> = ({ onClose, onSelect }) => {
    const [masterList, setMasterList] = useState<PokemonListItem[]>([]);
    const [filteredList, setFilteredList] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedGeneration, setSelectedGeneration] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    const getPokemonIdFromUrl = (url: string): string => {
        const parts = url.split('/').filter(part => part);
        return parts[parts.length - 1];
    };
    
    const applyFilters = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let genPokemonNames: Set<string> | null = null;
            if (selectedGeneration !== 'all') {
                const genData = await getGeneration(Number(selectedGeneration));
                genPokemonNames = new Set(genData.pokemon_species.map(p => p.name));
            }

            let typePokemon: PokemonListItem[] | null = null;
            if (selectedType !== 'all') {
                const typeData = await getType(selectedType);
                typePokemon = typeData.pokemon.map(p => p.pokemon);
            }

            let currentList = masterList;

            if (typePokemon) {
                const typePokemonNames = new Set(typePokemon.map(p => p.name));
                currentList = masterList.filter(p => typePokemonNames.has(p.name));
            }

            if (genPokemonNames) {
                currentList = currentList.filter(p => genPokemonNames!.has(p.name));
            }
            
            setFilteredList(currentList);

        } catch (err) {
            setError('Could not apply filters. Please try again.');
            setFilteredList([]);
        } finally {
            setLoading(false);
        }

    }, [selectedGeneration, selectedType, masterList]);


    useEffect(() => {
        const fetchInitialList = async () => {
            if (masterList.length > 0) {
                setFilteredList(masterList);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getPokemonList();
                setMasterList(data.results);
                setFilteredList(data.results);
            } catch (err) {
                setError('Failed to load Pokédex. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialList();
    }, [masterList]);

    useEffect(() => {
        if (masterList.length > 0) {
            applyFilters();
        }
    }, [selectedGeneration, selectedType, masterList, applyFilters]);

    const handlePokemonClick = (id: string) => {
        onSelect(id);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const getPokemonImageUrl = (id: string): string => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    };


    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
            <div className="w-full max-w-4xl h-[90vh] bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700 relative flex flex-col">
                 <button onClick={onClose} className="absolute top-3 right-3 text-white bg-slate-700/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors z-10">
                    &times;
                </button>
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-white">Select a Pokémon</h2>
                     <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex-1">
                            <label htmlFor="generation-filter-modal" className="block text-sm font-medium text-slate-300 mb-1">Generation</label>
                            <select id="generation-filter-modal" value={selectedGeneration} onChange={e => setSelectedGeneration(e.target.value)} className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all text-white">
                                <option value="all">All Generations</option>
                                {GENERATIONS.map(gen => (
                                    <option key={gen.id} value={gen.id}>{gen.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="type-filter-modal" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                            <select id="type-filter-modal" value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all text-white capitalize">
                                <option value="all">All Types</option>
                                {Object.keys(TYPE_COLORS).filter(t => t !== 'default').map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    {loading && (
                         <div className="flex flex-col items-center justify-center h-full text-slate-300 min-h-[300px]">
                            <div className="animate-spin text-6xl">{POKEBALL_ICON}</div>
                            <p className="mt-4 text-lg font-bold">Loading Pokédex...</p>
                        </div>
                    )}
                    {!loading && error && <p className="text-red-400 text-center">{error}</p>}
                    {!loading && filteredList.length === 0 && <p className="text-slate-400 text-center">No Pokémon match filters.</p>}
                    {!loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredList.map(pokemon => {
                                const id = getPokemonIdFromUrl(pokemon.url);
                                if (isNaN(parseInt(id))) return null;
                                return (
                                    <div key={id} onClick={() => handlePokemonClick(id)} className="bg-slate-900/80 p-3 rounded-lg text-center cursor-pointer border-2 border-slate-700 hover:border-amber-400 hover:scale-105 transition-all duration-200 flex flex-col justify-between">
                                        <img src={getPokemonImageUrl(id)} alt={pokemon.name} className="w-full h-auto object-contain aspect-square" loading="lazy" />
                                        <div className="mt-2">
                                            <p className="text-slate-400 text-sm">#{id.toString().padStart(4, '0')}</p>
                                            <p className="font-bold capitalize text-white text-sm">{pokemon.name.replace('-', ' ')}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PokemonSelectionModal;
