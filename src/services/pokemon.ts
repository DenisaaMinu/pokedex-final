const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_SPRITE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

type PokemonListEntry = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  next: string | null;
  results: PokemonListEntry[];
};

export type Pokemon = {
  id: number;
  name: string;
  spriteUrl: string;
};

// nextOffset is null on the last page
export type PokemonPage = {
  pokemon: Pokemon[];
  nextOffset: number | null;
};

// Check the shape of API data instead of trusting it with an `as` cast
function isPokemonListEntry(value: unknown): value is PokemonListEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'url' in value &&
    typeof value.url === 'string'
  );
}

function isPokemonListResponse(value: unknown): value is PokemonListResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'next' in value &&
    (typeof value.next === 'string' || value.next === null) &&
    'results' in value &&
    Array.isArray(value.results) &&
    value.results.every(isPokemonListEntry)
  );
}

// The list has no id, so take it from the URL (.../pokemon/25/)
function getPokemonId(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  const id = match ? Number(match[1]) : Number.NaN;

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error(`Unable to determine a Pokémon number from "${url}".`);
  }

  return id;
}

// Turns an API entry into our own shape
function toPokemon({ name, url }: PokemonListEntry): Pokemon {
  const id = getPokemonId(url);

  return {
    id,
    name: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
    // Built from the id, so no extra request per card
    spriteUrl: `${POKEMON_SPRITE_URL}/${id}.png`,
  };
}

// All names and numbers in one request, for search
export async function getPokemonNames(): Promise<Pokemon[]> {
  const response = await fetch(`${POKEMON_API_URL}?limit=2000`);

  if (!response.ok) {
    throw new Error(`Unable to load Pokémon search (${response.status}).`);
  }

  const body: unknown = await response.json();

  if (!isPokemonListResponse(body)) {
    throw new Error('The Pokémon search response was invalid.');
  }

  return body.results.map(toPokemon);
}

// Loads 20 Pokémon from offset and turns them into our own shape
export async function getPokemonPage(offset: number): Promise<PokemonPage> {
  const response = await fetch(`${POKEMON_API_URL}?limit=20&offset=${offset}`);

  // Throwing shows the error state
  if (!response.ok) {
    throw new Error(`Unable to load Pokémon (${response.status}).`);
  }

  const body: unknown = await response.json();

  if (!isPokemonListResponse(body)) {
    throw new Error('The Pokémon list response was invalid.');
  }

  const pokemon = body.results.map(toPokemon);

  return {
    pokemon,
    // PokeAPI's next is null on the last page
    nextOffset: body.next === null ? null : offset + pokemon.length,
  };
}
