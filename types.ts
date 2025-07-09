export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  stats: Stat[];
  types: PokemonType[];
  moves: Move[];
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}


export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

// For /api/v2/generation/{id}
export interface GenerationResponse {
  id: number;
  name: string;
  pokemon_species: PokemonSpecies[];
}

export interface PokemonSpecies {
    name: string;
    url: string;
}

// For /api/v2/type/{id}
export interface TypeResponse {
    id: number;
    name: string;
    pokemon: PokemonOfType[];
}

export interface PokemonOfType {
    pokemon: {
        name: string;
        url: string;
    };
    slot: number;
}

// Team Builder Types
export interface TeamMember {
  pokemon: Pokemon;
  moves: Move['move'][];
}

export interface TeamContextType {
  team: (TeamMember | null)[];
  addPokemonToTeam: (pokemon: Pokemon, slotIndex: number) => void;
  removePokemonFromTeam: (slotIndex: number) => void;
  updatePokemonMoves: (slotIndex: number, moves: Move['move'][]) => void;
}