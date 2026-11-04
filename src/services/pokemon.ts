const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const EVOLUTION_CHAIN_API_URL = 'https://pokeapi.co/api/v2/evolution-chain';
const POKEMON_SPRITE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const POKEMON_OFFICIAL_ARTWORK_URL = `${POKEMON_SPRITE_URL}/other/official-artwork`;

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

export type PokemonDetail = {
  id: number;
  name: string;
  spriteUrl: string;
  speciesUrl: string;
  artworkUrl: string;
  baseExperience: number | null;
  heightM: number;
  weightKg: number;
  types: { key: string; name: string }[];
  abilities: string[];
  stats: PokemonStat[];
};

export type PokemonStat = {
  name: string;
  value: number;
};

export type PokemonSpecies = {
  chainId: number;
};

type PokemonApiResource = {
  name: string;
  url: string;
};

type PokemonApiUrl = {
  url: string;
};

type PokemonApiType = {
  slot: number;
  type: PokemonApiResource;
};

type PokemonApiAbility = {
  is_hidden: boolean;
  ability: PokemonApiResource;
};

type PokemonApiStat = {
  base_stat: number;
  stat: PokemonApiResource;
};

type PokemonDetailResponse = {
  id: number;
  name: string;
  species: PokemonApiResource;
  base_experience: number | null;
  height: number;
  weight: number;
  types: PokemonApiType[];
  abilities: PokemonApiAbility[];
  stats: PokemonApiStat[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
};

type PokemonSpeciesResponse = {
  evolution_chain: PokemonApiUrl;
};

type PokemonEvolutionChainNode = {
  species: PokemonApiResource;
  evolves_to: PokemonEvolutionChainNode[];
};

type PokemonEvolutionChainResponse = {
  chain: PokemonEvolutionChainNode;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPokemonApiResource(value: unknown): value is PokemonApiResource {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.url === 'string'
  );
}

function isPokemonApiUrl(value: unknown): value is PokemonApiUrl {
  return isRecord(value) && typeof value.url === 'string';
}

function isPokemonApiType(value: unknown): value is PokemonApiType {
  return (
    isRecord(value) &&
    typeof value.slot === 'number' &&
    isPokemonApiResource(value.type)
  );
}

function isPokemonApiAbility(value: unknown): value is PokemonApiAbility {
  return (
    isRecord(value) &&
    typeof value.is_hidden === 'boolean' &&
    isPokemonApiResource(value.ability)
  );
}

function isPokemonApiStat(value: unknown): value is PokemonApiStat {
  return (
    isRecord(value) &&
    typeof value.base_stat === 'number' &&
    isPokemonApiResource(value.stat)
  );
}

function isPokemonSpeciesResponse(value: unknown): value is PokemonSpeciesResponse {
  return isRecord(value) && isPokemonApiUrl(value.evolution_chain);
}

function isPokemonEvolutionChainNode(value: unknown): value is PokemonEvolutionChainNode {
  return (
    isRecord(value) &&
    isPokemonApiResource(value.species) &&
    Array.isArray(value.evolves_to) &&
    value.evolves_to.every(isPokemonEvolutionChainNode)
  );
}

function isPokemonEvolutionChainResponse(
  value: unknown
): value is PokemonEvolutionChainResponse {
  return isRecord(value) && isPokemonEvolutionChainNode(value.chain);
}

function isPokemonDetailResponse(value: unknown): value is PokemonDetailResponse {
  // Validate nested API data before reading it in the screen.
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    typeof value.name !== 'string' ||
    !isPokemonApiResource(value.species) ||
    !(typeof value.base_experience === 'number' || value.base_experience === null) ||
    typeof value.height !== 'number' ||
    typeof value.weight !== 'number' ||
    !Array.isArray(value.types) ||
    !value.types.every((entry: unknown) => isPokemonApiType(entry)) ||
    !Array.isArray(value.abilities) ||
    !value.abilities.every((entry: unknown) => isPokemonApiAbility(entry)) ||
    !Array.isArray(value.stats) ||
    !value.stats.every((entry: unknown) => isPokemonApiStat(entry)) ||
    !isRecord(value.sprites) ||
    !isRecord(value.sprites.other) ||
    !isRecord(value.sprites.other['official-artwork'])
  ) {
    return false;
  }

  const artwork = value.sprites.other['official-artwork'].front_default;

  return typeof artwork === 'string' || artwork === null;
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

function getPokemonSpeciesId(url: string) {
  const match = url.match(/\/pokemon-species\/(\d+)\/?$/);
  const id = match ? Number(match[1]) : Number.NaN;

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error(`Unable to determine a Pokémon species number from "${url}".`);
  }

  return id;
}

function getEvolutionChainId(url: string) {
  const match = url.match(/\/evolution-chain\/(\d+)\/?$/);
  const id = match ? Number(match[1]) : Number.NaN;

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error(`Unable to determine an evolution chain number from "${url}".`);
  }

  return id;
}

function toDisplayName(value: string) {
  return value
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

// Turns an API entry into our own shape
function toPokemon({ name, url }: PokemonListEntry): Pokemon {
  const id = getPokemonId(url);

  return {
    id,
    name: toDisplayName(name),
    // Built from the id, so no extra request per card
    spriteUrl: `${POKEMON_SPRITE_URL}/${id}.png`,
  };
}

function toStatName(value: string) {
  return value === 'hp' ? 'HP' : toDisplayName(value);
}

function toPokemonDetail(response: PokemonDetailResponse): PokemonDetail {
  return {
    id: response.id,
    name: toDisplayName(response.name),
    spriteUrl: `${POKEMON_SPRITE_URL}/${response.id}.png`,
    speciesUrl: response.species.url,
    artworkUrl:
      response.sprites.other['official-artwork'].front_default ??
      `${POKEMON_OFFICIAL_ARTWORK_URL}/${response.id}.png`,
    baseExperience: response.base_experience,
    heightM: response.height / 10,
    weightKg: response.weight / 10,
    types: response.types.map(({ type }) => ({
      key: type.name,
      name: toDisplayName(type.name),
    })),
    abilities: response.abilities
      .filter(({ is_hidden }) => !is_hidden)
      .map(({ ability }) => toDisplayName(ability.name)),
    stats: response.stats.map(({ base_stat, stat }) => ({
      name: toStatName(stat.name),
      value: base_stat,
    })),
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

// Fetch one Pokémon, validate the response, and convert the API units.
export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error('Unable to load Pokémon: the number is invalid.');
  }

  const response = await fetch(`${POKEMON_API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Unable to load Pokémon (${response.status}).`);
  }

  const body: unknown = await response.json();

  if (!isPokemonDetailResponse(body)) {
    throw new Error('The Pokémon detail response was invalid.');
  }

  return toPokemonDetail(body);
}

export async function getPokemonSpecies(speciesUrl: string): Promise<PokemonSpecies> {
  getPokemonSpeciesId(speciesUrl);

  const response = await fetch(speciesUrl);

  if (!response.ok) {
    throw new Error(`Unable to load Pokémon species (${response.status}).`);
  }

  const body: unknown = await response.json();

  if (!isPokemonSpeciesResponse(body)) {
    throw new Error('The Pokémon species response was invalid.');
  }

  return { chainId: getEvolutionChainId(body.evolution_chain.url) };
}

export async function getPokemonEvolutionChain(chainId: number): Promise<Pokemon[]> {
  if (!Number.isSafeInteger(chainId) || chainId < 1) {
    throw new Error('Unable to load the evolution chain: the number is invalid.');
  }

  const response = await fetch(`${EVOLUTION_CHAIN_API_URL}/${chainId}`);

  if (!response.ok) {
    throw new Error(`Unable to load the evolution chain (${response.status}).`);
  }

  const body: unknown = await response.json();

  if (!isPokemonEvolutionChainResponse(body)) {
    throw new Error('The evolution chain response was invalid.');
  }

  const stages: Pokemon[][] = [];

  function collectStage(nodes: PokemonEvolutionChainNode[]) {
    if (nodes.length === 0) {
      return;
    }

    stages.push(
      nodes
        .map(({ species }) => {
          const id = getPokemonSpeciesId(species.url);

          return {
            id,
            name: toDisplayName(species.name),
            spriteUrl: `${POKEMON_SPRITE_URL}/${id}.png`,
          };
        })
        .sort((first, second) => first.id - second.id)
    );

    collectStage(nodes.flatMap(({ evolves_to }) => evolves_to));
  }

  collectStage([body.chain]);

  return stages.flat();
}
