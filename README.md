Pokémon App

A sleek, responsive Pokémon browser built with Next.js 14 (App Router), TypeScript, and server-side rendering. Explore all 1,302 Pokémon from the official PokéAPI , search by name, filter by type, infinitely scroll through results, and save your favorites — all with a clean UI and persistent, shareable URLs.

🔗 Live Demo: https://pokemon-app-mqcu.vercel.app

✨ Features
Server-Side Rendered (SSR) for fast initial load and SEO

Infinite scroll using TanStack Query (useInfiniteQuery) — loads 20 Pokémon at a time as you scroll

Real-time search — filter Pokémon by name with debounced input (400ms)

Type-based filtering — narrow results by Pokémon type (e.g., Fire, Water, Psychic)

Favorites system — toggle ❤️ to save Pokémon; persisted in localStorage

Responsive design — works seamlessly on mobile, tablet, and desktop

🛠️ How to Run
Clone the repository
bash

git clone https://github.com/hayormikun/pokemon-app

cd pokemon-app

Install dependencies

bash
npm install

Start the development server

bash

npm run dev

Open your browser

Visit http://localhost:3000

✅ No API keys, environment variables, or backend required — powered entirely by the public PokéAPI. 

🏗️ Architecture Overview

Data Layer

TanStack Query manages all data fetching:
useInfiniteQuery for paginated Pokémon list (offset/limit)

Automatic request cancellation on input changes

Background refetching and 5-minute cache stale time

Parallel detail queries for type data (used in filtering)

Direct sprite URLs avoid extra API calls:

Dynamic route for details: /pokemon/[id] (e.g., /pokemon/25)

UI/UX

Skeleton loaders during data fetches

Empty states for no results or empty favorites

Optimistic UI for favorite toggles

Debounced search to prevent excessive requests

⚖️ Trade-offs & Current Limitations

✅ Favorites: Functional UI but Partially Integrated
Toggling works but doesn’t persist correctly

🚀 What’s Next?
Fix favorites sync in detail view and update UI instantly
Improve header text to show dynamic count (e.g., “Showing 1–20 of 1,302”)

Pokémon App delivers a fast, intuitive, and resilient experience by combining Next.js SSR, TanStack Query’s powerful data synchronization, and thoughtful UX — all in a clean, maintainable codebase. Ready to evolve with your favorite features! 🎮⚡