import type { Pokemon, PokemonListResponse, GenerationResponse, TypeResponse } from '../types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemon = async (searchTerm: string): Promise<Pokemon> => {
  if (!searchTerm) {
    throw new Error('Search term cannot be empty.');
  }
  
  const response = await fetch(`${API_BASE_URL}/pokemon/${searchTerm.toLowerCase()}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Pokémon not found.');
    }
    throw new Error('Failed to fetch Pokémon data.');
  }
  
  const data = await response.json();
  return data as Pokemon;
};

export const getPokemonList = async (limit: number = 1025): Promise<PokemonListResponse> => {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list.');
  }
  
  const data = await response.json();
  return data as PokemonListResponse;
};

export const getGeneration = async (generationId: number): Promise<GenerationResponse> => {
    const response = await fetch(`${API_BASE_URL}/generation/${generationId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch generation ${generationId} data.`);
    }
    return response.json();
};

export const getType = async (typeName: string): Promise<TypeResponse> => {
    const response = await fetch(`${API_BASE_URL}/type/${typeName.toLowerCase()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch type ${typeName} data.`);
    }
    return response.json();
};