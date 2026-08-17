import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV({id: 'fidzzmusic-storage'});

export function getJSON<T>(key: string, fallback: T): T {
  const raw = storage.getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: unknown): void {
  storage.set(key, JSON.stringify(value));
}

export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  PLAYLISTS: 'playlists',
  DOWNLOADS: 'downloads',
  RECENT_SEARCHES: 'recent_searches',
};
