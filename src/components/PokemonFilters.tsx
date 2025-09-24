'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '@/services/pokemonApi';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorDisplay } from './ErrorBoundary';

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

interface PokemonFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeTab: 'all' | 'favorites';
  onTabChange: (tab: 'all' | 'favorites') => void;
}

export const PokemonFilters = ({
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  sortBy,
  onSortChange,
  activeTab,
  onTabChange,
}: PokemonFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearchTerm, 300);

  const { data: typesData, isLoading: typesLoading, error: typesError, refetch: refetchTypes } = useQuery({
    queryKey: ['pokemon-types'],
    queryFn: ({ signal }) => pokemonApi.getPokemonTypes(signal),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'AbortError') return false;
      return failureCount < 3;
    },
  });

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleTypeToggle = (typeName: string) => {
    if (selectedTypes.includes(typeName)) {
      onTypesChange(selectedTypes.filter(t => t !== typeName));
    } else {
      onTypesChange([...selectedTypes, typeName]);
    }
  };

  const clearFilters = () => {
    setLocalSearchTerm('');
    onSearchChange('');
    onTypesChange([]);
    onSortChange('id-asc');
  };

  const hasActiveFilters = localSearchTerm || selectedTypes.length > 0 || sortBy !== 'id-asc';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => onTabChange('all')}
        >
          All
        </button>
        <button
          className={`ml-2 px-4 py-2 font-medium focus:outline-none ${activeTab === 'favorites' ? 'border-b-2 border-yellow-400 text-yellow-600' : 'text-gray-500'}`}
          onClick={() => onTabChange('favorites')}
        >
          Favorites
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Pokemon by name..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {isExpanded && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="id-asc">ID (Low to High)</option>
              <option value="id-desc">ID (High to Low)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            {typesLoading ? (
              <div className="text-sm text-gray-500">Loading types...</div>
            ) : typesError ? (
              <ErrorDisplay
                error={typesError}
                retry={() => refetchTypes()}
                title="Failed to load Pokemon types"
                description="Unable to fetch Pokemon types for filtering"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {typesData?.results
                  .filter(type => type.name !== 'unknown' && type.name !== 'shadow')
                  .map((type) => (
                    <label
                      key={type.name}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.name)}
                        onChange={() => handleTypeToggle(type.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize text-gray-700">
                        {type.name}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {localSearchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{localSearchTerm}"
              </span>
            )}
            {selectedTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
              >
                {type}
              </span>
            ))}
            {sortBy !== 'id-asc' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Sort: {sortBy.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
