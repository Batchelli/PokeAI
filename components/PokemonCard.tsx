
import React from 'react';
import type { Pokemon } from '../types';
import { TYPE_COLORS } from '../constants.tsx';
import StatBar from './StatBar';

interface PokemonCardProps {
  pokemon: Pokemon;
  isShiny: boolean;
  onToggleShiny: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isShiny, onToggleShiny }) => {
  const primaryType = pokemon.types[0]?.type.name || 'default';
  const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.default;

  const formatId = (id: number) => `#${id.toString().padStart(4, '0')}`;
  
  const imageUrl = isShiny 
    ? pokemon.sprites.other['official-artwork'].front_shiny 
    : pokemon.sprites.other['official-artwork'].front_default;

  return (
    <div className={`w-full max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-slate-700 transform transition-all duration-500 flex flex-col lg:flex-row`}>
      {/* Left Column */}
      <div className="lg:w-1/2 flex flex-col justify-between">
        {/* Image Section */}
        <div className={`p-4 relative bg-slate-900/50`}>
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={onToggleShiny} 
              className={`px-3 py-1.5 text-sm font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${isShiny ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30' : 'bg-slate-600 text-white hover:bg-slate-500'}`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90"><path d="M12 .5l3.09 6.26L22 7.77l-5 4.87 1.18 6.88L12 16.31l-6.18 3.21L7 12.64 2 7.77l6.91-1.01L12 .5z"/></svg>
              Shiny
            </button>
          </div>
          <div className="absolute top-4 left-4 z-10 bg-slate-900/70 text-amber-300 font-press-start text-xl px-3 py-2 rounded-lg">
            {formatId(pokemon.id)}
          </div>
          <div className="aspect-square flex items-center justify-center">
              {imageUrl ? (
                  <img 
                      src={imageUrl} 
                      alt={pokemon.name} 
                      className="max-h-64 h-full w-full object-contain animate-pulse-slow"
                      key={imageUrl}
                  />
              ) : (
                  <div className="text-slate-500">Image not available</div>
              )}
          </div>
        </div>

        {/* Info Section Part 1 (Name, Types) */}
        <div className="p-6 pt-4 flex flex-col flex-grow justify-center">
          <h2 className="text-4xl font-bold capitalize text-center text-white mb-2" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
            {pokemon.name.replace('-', ' ')}
          </h2>
          
          {/* Types */}
          <div className="flex justify-center gap-2">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`px-4 py-1 rounded-full text-sm font-bold capitalize border-b-4 ${TYPE_COLORS[type.name] || TYPE_COLORS.default}`}
              >
                {type.name}
              </span>
            ))}
          </div>
        </div>
      </div>


      {/* Right Column (Base Stats & Physical) */}
      <div className="lg:w-1/2 p-6 flex flex-col justify-center bg-slate-800/50 lg:bg-transparent">
        <div className="space-y-3">
          <h3 className="text-center font-bold text-xl text-slate-300 mb-2">Base Stats</h3>
          {pokemon.stats.map((stat, index) => (
            <StatBar key={index} stat={stat} typeColor={typeColor} />
          ))}
        </div>
        
        {/* Physical Stats */}
        <div className="flex justify-around text-center mt-6 bg-slate-700/50 p-3 rounded-lg">
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
    </div>
  );
};

export default PokemonCard;
