import React, { useState, useEffect, useCallback } from 'react';
import type { Pokemon } from '../types';
import { getPokemon } from '../services/pokeapi';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import { IconMdiPokeball } from '../components/IconMdiPokeball';

interface SearchPageProps {
  onNavigateToList: () => void;
  onNavigateToTeamBuilder: () => void;
  onNavigateToBattle: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onNavigateToList, onNavigateToTeamBuilder, onNavigateToBattle }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('1');

  const fetchPokemon = useCallback(async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setPokemon(null);
    try {
      const data = await getPokemon(query);
      setPokemon(data);
      setIsShiny(false); // Reset shiny state on new search
    } catch (err) {
      setError('Pokemon not found. Try another name or ID.');
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!pokemon) {
      fetchPokemon(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    fetchPokemon(query);
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </div>
      <div className="flex justify-center gap-4 my-4">
          <button
            onClick={onNavigateToList}
            className="bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            View Full Pokédex
          </button>
          <button
            onClick={onNavigateToTeamBuilder}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Create Team
          </button>
          <button
            onClick={onNavigateToBattle}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Battle
          </button>
      </div>
      <div className="mt-2 min-h-[500px] w-full">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <IconMdiPokeball height="60" width="60" className="animate-spin-smooth text-white" />
            <p className="mt-4 text-lg font-bold">Loading...</p>
          </div>
        )}
        {error && !loading && (
           <div className="bg-red-800/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
             <p className="font-bold">Error</p>
             <p className="text-sm">{error}</p>
           </div>
        )}
        {pokemon && !loading && (
          <PokemonCard 
            pokemon={pokemon}
            isShiny={isShiny}
            onToggleShiny={() => setIsShiny(prev => !prev)}
          />
        )}
      </div>
    </>
  );
};

export default SearchPage;