'use client'

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pokemon, PokemonDetails } from '@/services/pokemonApi';
import { SortOption } from '@/components/PokemonFilters';

interface UseFilteredPokemonProps {
  allPokemon: Pokemon[];
  searchTerm: string;
  selectedTypes: string[];
  sortBy: SortOption;
}

export const useFilteredPokemon = ({
  allPokemon,
  searchTerm,
  selectedTypes,
  sortBy,
}: UseFilteredPokemonProps) => {
  // Fetch Pokemon details for type filtering
  const pokemonDetailsQueries = useQuery({
    queryKey: ['pokemon-details-batch', allPokemon.slice(0, 100).map(p => p.name)],
    queryFn: async ({ signal }) => {
      const details = await Promise.all(
        allPokemon.slice(0, 100).map(async (pokemon) => {
          try {
            const response = await fetch(pokemon.url, { signal });
            if (!response.ok) return null;
            return await response.json() as PokemonDetails;
          } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') throw error;
            return null;
          }
        })
      );
      return details.filter(Boolean) as PokemonDetails[];
    },
    enabled: allPokemon.length > 0 && selectedTypes.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'AbortError') return false;
      return failureCount < 2;
    },
  });

  const filteredAndSortedPokemon = useMemo(() => {
    let filtered = [...allPokemon];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter (only if we have details and types are selected)
    if (selectedTypes.length > 0 && pokemonDetailsQueries.data) {
      const pokemonWithTypes = pokemonDetailsQueries.data;
      const pokemonIdsWithSelectedTypes = new Set(
        pokemonWithTypes
          .filter(details => 
            details.types.some(type => selectedTypes.includes(type.type.name))
          )
          .map(details => details.id)
      );
      
      filtered = filtered.filter(pokemon => {
        const pokemonId = pokemon.url.match(/\/pokemon\/(\d+)\//)?.[1];
        return pokemonId && pokemonIdsWithSelectedTypes.has(parseInt(pokemonId));
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'id-asc': {
          const aId = parseInt(a.url.match(/\/pokemon\/(\d+)\//)?.[1] || '0');
          const bId = parseInt(b.url.match(/\/pokemon\/(\d+)\//)?.[1] || '0');
          return aId - bId;
        }
        case 'id-desc': {
          const aId = parseInt(a.url.match(/\/pokemon\/(\d+)\//)?.[1] || '0');
          const bId = parseInt(b.url.match(/\/pokemon\/(\d+)\//)?.[1] || '0');
          return bId - aId;
        }
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPokemon, searchTerm, selectedTypes, sortBy, pokemonDetailsQueries.data]);

  return {
    filteredPokemon: filteredAndSortedPokemon,
    isLoadingDetails: pokemonDetailsQueries.isLoading,
  };
};
