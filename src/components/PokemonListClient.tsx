'use client';

import { useState, useEffect, useRef } from 'react';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonFilters, SortOption } from '@/components/PokemonFilters';
import { useFavorites } from '@/hooks/useFavorites';

export function PokemonListClient({ initialPokemon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('id-asc');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [allPokemon, setAllPokemon] = useState(initialPokemon);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextOffset, setNextOffset] = useState(initialPokemon.length);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { favorites } = useFavorites();

  useEffect(() => {
    if (activeTab !== 'all') return;
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;
    const observer = new window.IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { rootMargin: '100px' });
    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, activeTab]);

  async function fetchNextPage() {
    setIsFetchingNextPage(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon?offset=${nextOffset}&limit=40`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllPokemon((prev) => [...prev, ...data.results]);
      setNextOffset(nextOffset + data.results.length);
      if (!data.next) setHasNextPage(false);
    } catch {
      setIsError(true);
    } finally {
      setIsFetchingNextPage(false);
    }
  }

  function pokemonIdFromUrl(url: string) {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? match[1] : '';
  }

  const visiblePokemon = activeTab === 'favorites'
    ? allPokemon.filter(p => favorites.includes(pokemonIdFromUrl(p.url)))
    : allPokemon;

  let filteredPokemon = visiblePokemon;
  if (searchTerm) {
    filteredPokemon = filteredPokemon.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (sortBy === 'id-asc') {
    filteredPokemon = [...filteredPokemon].sort((a, b) =>
      parseInt(pokemonIdFromUrl(a.url)) - parseInt(pokemonIdFromUrl(b.url))
    );
  } else if (sortBy === 'id-desc') {
    filteredPokemon = [...filteredPokemon].sort((a, b) =>
      parseInt(pokemonIdFromUrl(b.url)) - parseInt(pokemonIdFromUrl(a.url))
    );
  } else if (sortBy === 'name-asc') {
    filteredPokemon = [...filteredPokemon].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === 'name-desc') {
    filteredPokemon = [...filteredPokemon].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  return (
    <>
      <PokemonFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTypes={selectedTypes}
        onTypesChange={setSelectedTypes}
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mb-4 text-sm text-gray-600">
        {activeTab === 'favorites' ? (
          <>
            Showing {filteredPokemon.length} of {favorites.length} Favorites
          </>
        ) : (
          <>
            Showing {filteredPokemon.length} of {allPokemon.length} Pokemon
          </>
        )}
        {searchTerm && (
          <span className="ml-2 text-blue-600">(filtered)</span>
        )}
      </div>
      <section className="my-5 flex flex-col gap-3">
        {filteredPokemon.map((pokemon, index) => (
          <PokemonCard
            key={`${pokemon.name}-${index}`}
            name={pokemon.name}
            url={pokemon.url}
          />
        ))}
        {filteredPokemon.length === 0 && visiblePokemon.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No Pokemon found matching your criteria</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
        {activeTab === 'all' && (
          <div
            ref={loadMoreRef}
            className="h-4"
            style={{
              display: (!searchTerm && selectedTypes.length === 0) ? 'block' : 'none'
            }}
          />
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading more Pokemon...</span>
          </div>
        )}
        {activeTab === 'all' && !hasNextPage && allPokemon.length > 0 && !searchTerm && selectedTypes.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            You&apos;ve reached the end of the Pokemon list!
          </div>
        )}
      </section>
    </>
  );
}
