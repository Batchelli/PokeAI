import React from 'react';

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


export const POKEBALL_ICON = React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: "48",
    height: "48",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "text-white"
  },
  React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
  React.createElement('circle', { cx: "12", cy: "12", r: "4" }),
  React.createElement('line', { x1: "22", y1: "12", x2: "18", y2: "12" }),
  React.createElement('line', { x1: "6", y1: "12", x2: "2", y2: "12" }),
  React.createElement('line', { x1: "12", y1: "2", x2: "12", y2: "6" }),
  React.createElement('line', { x1: "12", y1: "18", x2: "12", y2: "22" })
);


export const GITHUB_ICON = React.createElement('svg', {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "currentColor"
},
  React.createElement('path', { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
);