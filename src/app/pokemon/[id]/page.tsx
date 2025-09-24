import { PokemonDetailClient } from '@/components/PokemonDetailClient';
import Link from 'next/link';

export default async function PokemonDetailPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon/${params.id}`);
  if (!res.ok) {
    return <div>Pokemon not found</div>;
  }
  const pokemon = await res.json();
  return <PokemonDetailClient pokemon={pokemon} />;
}
