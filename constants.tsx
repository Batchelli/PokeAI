import React from 'react';
import {
    Github,
    Trash2,
    Check,
    Dices,
    Trophy,
    Target,
    Shuffle,
} from 'lucide-react';
import { IconMdiPokeball } from './components/IconMdiPokeball.tsx';

export const TYPE_COLORS: { [key: string]: string } = {
  normal: 'bg-gray-400 border-gray-500',
  fire: 'bg-red-500 border-red-600',
  water: 'bg-blue-400 border-blue-500',
  electric: 'bg-yellow-400 border-yellow-500',
  grass: 'bg-green-500 border-green-600',
  ice: 'bg-cyan-300 border-cyan-400 text-black',
  fighting: 'bg-orange-700 border-orange-800',
  poison: 'bg-purple-600 border-purple-700',
  ground: 'bg-yellow-600 border-yellow-700',
  flying: 'bg-indigo-400 border-indigo-500',
  psychic: 'bg-pink-500 border-pink-600',
  bug: 'bg-lime-500 border-lime-600',
  rock: 'bg-stone-500 border-stone-600',
  ghost: 'bg-indigo-800 border-indigo-900',
  dragon: 'bg-violet-700 border-violet-800',
  dark: 'bg-gray-700 border-gray-800',
  steel: 'bg-slate-500 border-slate-600',
  fairy: 'bg-pink-300 border-pink-400 text-black',
  default: 'bg-gray-500 border-gray-600',
};

export const TYPE_EFFECTIVENESS: { [key: string]: { [key: string]: number } } = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 0.5, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

export const STAT_NICKNAMES: { [key: string]: string } = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SpA',
    'special-defense': 'SpD',
    'speed': 'SPD'
};

export const GENERATIONS = [
  { id: 1, name: 'Generation I' },
  { id: 2, name: 'Generation II' },
  { id: 3, name: 'Generation III' },
  { id: 4, name: 'Generation IV' },
  { id: 5, name: 'Generation V' },
  { id: 6, name: 'Generation VI' },
  { id: 7, name: 'Generation VII' },
  { id: 8, name: 'Generation VIII' },
  { id: 9, name: 'Generation IX' },
];


export const GITHUB_ICON = <Github size={24} />;
export const TRASH_ICON = <Trash2 size={16} />;
export const SUCCESS_ICON = <Check size={20} strokeWidth={3} className="w-5 h-5" />;

// Battle Page Icons
export const DICE_ICON = <Dices size={48} />;
export const TROPHY_ICON = <Trophy size={48} />;
export const TARGET_ICON = <Target size={48} />;
export const SHUFFLE_ICON = <Shuffle size={48} />;