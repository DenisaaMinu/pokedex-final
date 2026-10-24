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

export type PokemonPage = {
  pokemon: Pokemon[];
  nextOffset: number | null;
};

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

function getPokemonId(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  const id = match ? Number(match[1]) : Number.NaN;

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error(`Unable to determine a Pokémon number from "${url}".`);
  }

  return id;
}

export async function getPokemonPage(offset: number): Promise<PokemonPage> {
  const response = await fetch(`${POKEMON_API_URL}?limit=20&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Unable to load Pokémon (${response.status}).`);
  }

  const body: unknown = await response.json();

  if (!isPokemonListResponse(body)) {
    throw new Error('The Pokémon list response was invalid.');
  }

  const pokemon = body.results.map(({ name, url }) => {
    const id = getPokemonId(url);

    return {
      id,
      name: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      spriteUrl: `${POKEMON_SPRITE_URL}/${id}.png`,
    };
  });

  return {
    pokemon,
    nextOffset: body.next === null ? null : offset + pokemon.length,
  };
}
