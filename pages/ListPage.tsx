import React, { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getGeneration, getType } from '../services/pokeapi';
import type { PokemonListItem } from '../types';
import { POKEBALL_ICON, GENERATIONS, TYPE_COLORS } from '../constants.tsx';
import PokemonModal from '../components/PokemonModal';

interface ListPageProps {
    onBack: () => void;
    onNavigateToDetail: (pokemonId: string) => void;
}

const ListPage: React.FC<ListPageProps> = ({ onBack, onNavigateToDetail }) => {
    const [masterList, setMasterList] = useState<PokemonListItem[]>([]);
    const [filteredList, setFilteredList] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedGeneration, setSelectedGeneration] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(null);

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
            try {
                setLoading(true);
                const data = await getPokemonList();
                setMasterList(data.results);
                setFilteredList(data.results.filter(p => parseInt(getPokemonIdFromUrl(p.url)) <= 151)); // Default to Gen 1
                setSelectedGeneration('1');
            } catch (err) {
                setError('Failed to load Pokédex. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        if (masterList.length === 0) {
           fetchInitialList();
        }
    }, [masterList]);

    useEffect(() => {
        if (masterList.length > 0) {
            applyFilters();
        }
    }, [selectedGeneration, selectedType, masterList, applyFilters]);

    const handlePokemonClick = (id: string) => {
        setSelectedPokemonId(id);
        setIsModalOpen(true);
    };
    
    const handleNavigateAndClose = (id: string) => {
        setIsModalOpen(false);
        onNavigateToDetail(id);
    }

    const getPokemonImageUrl = (id: string): string => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 min-h-[500px]">
                    <div className="animate-spin text-6xl">{POKEBALL_ICON}</div>
                    <p className="mt-4 text-lg font-bold">Loading Pokédex...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-800/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
                    <p className="font-bold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (filteredList.length === 0) {
            return <div className="text-center text-slate-400 py-10">No Pokémon match the current filters.</div>
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredList.map(pokemon => {
                    const id = getPokemonIdFromUrl(pokemon.url);
                    // Some pokemon might not be in the gen filter but are in type filter, so we check if the ID is a number
                    if (isNaN(parseInt(id))) return null;
                    return (
                        <div key={id} onClick={() => handlePokemonClick(id)} className="bg-slate-800 p-3 rounded-lg text-center cursor-pointer border-2 border-slate-700 hover:border-amber-400 hover:scale-105 transition-all duration-200 flex flex-col justify-between">
                            <img 
                                src={getPokemonImageUrl(id)} 
                                alt={pokemon.name} 
                                className="w-full h-auto object-contain aspect-square"
                                loading="lazy"
                            />
                            <div className="mt-2">
                                <p className="text-slate-400 text-sm">#{id.toString().padStart(4, '0')}</p>
                                <p className="font-bold capitalize text-white">{pokemon.name.replace('-', ' ')}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="w-full">
            {isModalOpen && selectedPokemonId && (
                <PokemonModal 
                    pokemonId={selectedPokemonId} 
                    onClose={() => setIsModalOpen(false)}
                    onNavigateToDetail={handleNavigateAndClose}
                />
            )}
            <div className="flex justify-between items-center mb-6 px-2 flex-wrap gap-4">
                 <h2 className="text-3xl font-bold text-slate-200">Pokédex</h2>
                 <button onClick={onBack} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    &larr; Back to Search
                </button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="generation-filter" className="block text-sm font-medium text-slate-300 mb-1">Generation</label>
                    <select id="generation-filter" value={selectedGeneration} onChange={e => setSelectedGeneration(e.target.value)} className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all text-white">
                        <option value="all">All Generations</option>
                        {GENERATIONS.map(gen => (
                            <option key={gen.id} value={gen.id}>{gen.name}</option>
                        ))}
                    </select>
                </div>
                 <div className="flex-1">
                    <label htmlFor="type-filter" className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                    <select id="type-filter" value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full p-2 rounded-lg bg-slate-700 border-2 border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all text-white capitalize">
                        <option value="all">All Types</option>
                        {Object.keys(TYPE_COLORS).filter(t => t !== 'default').map(type => (
                             <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default ListPage;
