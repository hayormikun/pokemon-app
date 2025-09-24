'use client'

import { useInfiniteQuery } from '@tanstack/react-query';
import { pokemonApi, PokemonListResponse } from '@/services/pokemonApi';

export const useInfinitePokemon = () => {
  return useInfiniteQuery<PokemonListResponse>({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0, signal }) => pokemonApi.getPokemonList(pageParam as number, 20, signal),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      
      const url = new URL(lastPage.next);
      const offset = url.searchParams.get('offset');
      return offset ? parseInt(offset, 10) : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'AbortError') return false;
      return failureCount < 3;
    },
  });
};
