import {useSyncExternalStore} from 'react';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {getJSON, setJSON, STORAGE_KEYS} from '@services/storage';
import {Track} from '@services/types';
import {resolveTrack} from '@services/api';

type Listener = () => void;
const listeners = new Set<Listener>();

function getSnapshot(): Track[] {
  return getJSON<Track[]>(STORAGE_KEYS.DOWNLOADS, []);
}

function emitChange() {
  listeners.forEach(l => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDownloads(): Track[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function isDownloaded(id: string): boolean {
  return getSnapshot().some(t => t.id === id);
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_').slice(0, 60);
}

export async function downloadTrack(
  track: Track,
  onProgress?: (percent: number) => void,
): Promise<Track> {
  const resolved = await resolveTrack(track.spotifyUrl);
  const mp3Url = resolved.links.mp3;

  const dir = ReactNativeBlobUtil.fs.dirs.MusicDir || ReactNativeBlobUtil.fs.dirs.DocumentDir;
  const fileName = `${sanitizeFileName(track.title)}_${track.id}.mp3`;
  const path = `${dir}/FidzzMusic/${fileName}`;

  await ReactNativeBlobUtil.config({
    path,
    fileCache: true,
  })
    .fetch('GET', mp3Url)
    .progress((received, total) => {
      if (onProgress && total > 0) {
        onProgress(Math.round((Number(received) / Number(total)) * 100));
      }
    });

  const downloadedTrack: Track = {
    ...track,
    localUri: `file://${path}`,
    isDownloaded: true,
  };

  const current = getSnapshot();
  const next = [downloadedTrack, ...current.filter(t => t.id !== track.id)];
  setJSON(STORAGE_KEYS.DOWNLOADS, next);
  emitChange();

  return downloadedTrack;
}

export async function removeDownload(track: Track) {
  if (track.localUri) {
    const path = track.localUri.replace('file://', '');
    const exists = await ReactNativeBlobUtil.fs.exists(path);
    if (exists) {
      await ReactNativeBlobUtil.fs.unlink(path);
    }
  }
  const next = getSnapshot().filter(t => t.id !== track.id);
  setJSON(STORAGE_KEYS.DOWNLOADS, next);
  emitChange();
}
