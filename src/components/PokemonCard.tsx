import Link from "next/link";
import { pokemonApi } from "@/services/pokemonApi";
import { useFavorites } from "@/hooks/useFavorites";

type Props = {
  name: string;
  url: string;
};

export const PokemonCard = ({ name, url }: Props) => {
  const pokemonId = pokemonApi.extractPokemonId(url);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-500 font-bold text-lg">
            {pokemonId.toString().padStart(3, '0')}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {name}
          </h3>
          <Link 
            href={`/pokemon/${pokemonId}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
      <button
        aria-label={isFavorite(pokemonId.toString()) ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => toggleFavorite(pokemonId.toString())}
        className="ml-4 text-2xl focus:outline-none"
        style={{ color: isFavorite(pokemonId.toString()) ? '#fbbf24' : '#d1d5db' }}
      >
        {isFavorite(pokemonId.toString()) ? '★' : '☆'}
      </button>
    </div>
  );
};
