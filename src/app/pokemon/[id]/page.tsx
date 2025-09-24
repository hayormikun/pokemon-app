import { PokemonDetailClient } from '@/components/PokemonDetailClient';

type Props = {
  params: {
    id: string;
  };
}

export default async function PokemonDetailPage({ params }: Props) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon/${params.id}`);
  if (!res.ok) {
    return <div>Pokemon not found</div>;
  }
  const pokemon = await res.json();
  return <PokemonDetailClient pokemon={pokemon} />;
}
