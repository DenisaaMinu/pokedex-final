import * as SQLite from 'expo-sqlite';

import type { Pokemon } from '@/services/pokemon';

type FavoriteRow = {
  id: number;
  name: string;
  sprite_url: string;
};

const database = SQLite.openDatabaseSync('pokedex.db');

database.execSync(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    sprite_url TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export function getFavorites(): Pokemon[] {
  const rows = database.getAllSync<FavoriteRow>(
    'SELECT id, name, sprite_url FROM favorites ORDER BY created_at DESC, id DESC'
  );

  return rows.map(({ id, name, sprite_url }) => ({
    id,
    name,
    spriteUrl: sprite_url,
  }));
}

export function isFavorite(id: number): boolean {
  return database.getFirstSync<{ id: number }>(
    'SELECT id FROM favorites WHERE id = ?',
    id
  ) !== null;
}

export function addFavorite(pokemon: Pokemon): void {
  database.runSync(
    'INSERT OR IGNORE INTO favorites (id, name, sprite_url, created_at) VALUES (?, ?, ?, ?)',
    pokemon.id,
    pokemon.name,
    pokemon.spriteUrl,
    Date.now()
  );
}

export function removeFavorite(id: number): void {
  database.runSync('DELETE FROM favorites WHERE id = ?', id);
}