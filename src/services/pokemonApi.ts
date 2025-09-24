export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonTypesResponse {
  count: number;
  results: PokemonType[];
}

const POKEMON_API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

export const pokemonApi = {
  getPokemonList: async (offset: number = 0, limit: number = 20, signal?: AbortSignal): Promise<PokemonListResponse> => {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon?offset=${offset}&limit=${limit}`, {
      signal,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  },

  getPokemonDetails: async (url: string, signal?: AbortSignal): Promise<PokemonDetails> => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon details');
    }
    return response.json();
  },

  extractPokemonId: (url: string): number => {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  },

  getPokemonTypes: async (signal?: AbortSignal): Promise<PokemonTypesResponse> => {
    const response = await fetch(`${POKEMON_API_BASE}/type`, { signal });
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon types');
    }
    return response.json();
  }
};
