import { PokemonListClient } from '@/components/PokemonListClient';
import { Heading } from '@/components/Heading';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon?limit=100`);
  const data = await res.json();

  return (
    <main className="font-sans min-w-screen min-h-screen flex justify-center box-border">
      <section className="w-[80%] lg:w-[60%] mx-auto min-h-96 my-8 p-8 rounded-2xl shadow-xl box-border">
        <Heading heading="pokemon list" />
        <PokemonListClient initialPokemon={data.results} />
      </section>
    </main>
  );
}
