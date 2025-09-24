'use client';

import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';

export function PokemonDetailClient({ pokemon }: { pokemon: import('@/services/pokemonApi').PokemonDetails }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <main className="font-sans min-w-screen min-h-screen flex justify-center box-border">
      <section className="w-[80%] lg:w-[60%] mx-auto min-h-96 my-8 p-8 rounded-2xl shadow-xl box-border">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Pokemon List
          </Link>
          <h1 className="text-3xl font-bold text-white capitalize flex items-center gap-2">
            {pokemon.name}
            <button
              aria-label={isFavorite(pokemon.id.toString()) ? 'Remove from favorites' : 'Add to favorites'}
              onClick={() => toggleFavorite(pokemon.id.toString())}
              className="text-2xl focus:outline-none"
              style={{ color: isFavorite(pokemon.id.toString()) ? '#fbbf24' : '#d1d5db' }}
            >
              {isFavorite(pokemon.id.toString()) ? '★' : '☆'}
            </button>
          </h1>
          <p className="text-amber-300">{pokemon.id.toString().padStart(3, '0')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Pokemon Image</h2>
            <div className="flex justify-center">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2 capitalize">{pokemon.name}</span>
              </div>
              <div>
                <span className="font-medium">ID:</span>
                <span className="ml-2">{pokemon.id.toString().padStart(3, '0')}</span>
              </div>
              <div>
                <span className="font-medium">Types:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
