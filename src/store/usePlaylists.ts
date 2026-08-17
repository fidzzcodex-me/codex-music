import {useSyncExternalStore} from 'react';
import {getJSON, setJSON, STORAGE_KEYS} from '@services/storage';
import {Playlist} from '@services/types';

type Listener = () => void;
const listeners = new Set<Listener>();

function getSnapshot(): Playlist[] {
  return getJSON<Playlist[]>(STORAGE_KEYS.PLAYLISTS, []);
}

function emitChange() {
  listeners.forEach(l => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function createPlaylist(name: string): Playlist {
  const playlists = getSnapshot();
  const playlist: Playlist = {
    id: `pl_${Date.now()}`,
    name,
    trackIds: [],
    createdAt: Date.now(),
  };
  setJSON(STORAGE_KEYS.PLAYLISTS, [playlist, ...playlists]);
  emitChange();
  return playlist;
}

export function deletePlaylist(id: string) {
  const playlists = getSnapshot().filter(p => p.id !== id);
  setJSON(STORAGE_KEYS.PLAYLISTS, playlists);
  emitChange();
}

export function addTrackToPlaylist(playlistId: string, trackId: string) {
  const playlists = getSnapshot().map(p => {
    if (p.id !== playlistId) return p;
    if (p.trackIds.includes(trackId)) return p;
    return {...p, trackIds: [...p.trackIds, trackId]};
  });
  setJSON(STORAGE_KEYS.PLAYLISTS, playlists);
  emitChange();
}

export function removeTrackFromPlaylist(playlistId: string, trackId: string) {
  const playlists = getSnapshot().map(p => {
    if (p.id !== playlistId) return p;
    return {...p, trackIds: p.trackIds.filter(id => id !== trackId)};
  });
  setJSON(STORAGE_KEYS.PLAYLISTS, playlists);
  emitChange();
}

export function usePlaylists(): Playlist[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
