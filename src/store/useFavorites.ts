import {useCallback, useSyncExternalStore} from 'react';
import {getJSON, setJSON, STORAGE_KEYS} from '@services/storage';
import {Track} from '@services/types';

type Listener = () => void;
const listeners = new Set<Listener>();

function getSnapshot(): Track[] {
  return getJSON<Track[]>(STORAGE_KEYS.FAVORITES, []);
}

function emitChange() {
  listeners.forEach(l => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function toggleFavorite(track: Track) {
  const current = getSnapshot();
  const exists = current.some(t => t.id === track.id);
  const next = exists
    ? current.filter(t => t.id !== track.id)
    : [track, ...current];
  setJSON(STORAGE_KEYS.FAVORITES, next);
  emitChange();
}

export function isFavorite(id: string): boolean {
  return getSnapshot().some(t => t.id === id);
}

export function useFavorites(): Track[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useIsFavorite(id: string): boolean {
  const favorites = useFavorites();
  return favorites.some(t => t.id === id);
}
