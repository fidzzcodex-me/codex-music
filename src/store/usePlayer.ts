import {useCallback, useEffect, useState} from 'react';
import TrackPlayer, {
  useProgress as useRNProgress,
  usePlaybackState,
  State,
  RepeatMode,
} from 'react-native-track-player';
import {Track} from '@services/types';
import {resolveTrack} from '@services/api';
import {isDownloaded, useDownloads} from '@store/useDownloads';

let currentQueue: Track[] = [];
let currentIndex = -1;
const queueListeners = new Set<() => void>();

function emitQueueChange() {
  queueListeners.forEach(l => l());
}

async function resolveStreamUrl(track: Track): Promise<string> {
  if (track.localUri) return track.localUri;
  const downloads = getSnapshotDownloads();
  const downloaded = downloads.find(t => t.id === track.id);
  if (downloaded?.localUri) return downloaded.localUri;
  if (track.streamUrl) return track.streamUrl;

  const resolved = await resolveTrack(track.spotifyUrl);
  return resolved.links.mp3;
}

function getSnapshotDownloads(): Track[] {
  try {
    const raw = require('@services/storage');
    return raw.getJSON('downloads', []);
  } catch {
    return [];
  }
}

export async function playQueue(tracks: Track[], startIndex = 0) {
  currentQueue = tracks;
  currentIndex = startIndex;
  emitQueueChange();

  await TrackPlayer.reset();

  const track = tracks[startIndex];
  const url = await resolveStreamUrl(track);

  await TrackPlayer.add({
    id: track.id,
    url,
    title: track.title,
    artist: track.artist,
    artwork: track.artwork,
    duration: track.duration,
  });

  await TrackPlayer.play();

  const rest = tracks.slice(startIndex + 1);
  for (const t of rest) {
    try {
      const restUrl = await resolveStreamUrl(t);
      await TrackPlayer.add({
        id: t.id,
        url: restUrl,
        title: t.title,
        artist: t.artist,
        artwork: t.artwork,
        duration: t.duration,
      });
    } catch (e) {
      console.warn('Failed to queue track', t.title);
    }
  }
}

export async function playSingle(track: Track) {
  await playQueue([track], 0);
}

export function useCurrentQueue() {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const listener = () => forceUpdate(x => x + 1);
    queueListeners.add(listener);
    return () => {
      queueListeners.delete(listener);
    };
  }, []);
  return {queue: currentQueue, index: currentIndex};
}

export function usePlayerState() {
  const playback = usePlaybackState();
  const isPlaying = playback.state === State.Playing;
  const isBuffering =
    playback.state === State.Buffering || playback.state === State.Connecting;
  return {isPlaying, isBuffering, state: playback.state};
}

export function useProgress() {
  return useRNProgress(250);
}

export async function togglePlayPause() {
  const state = await TrackPlayer.getPlaybackState();
  if (state.state === State.Playing) {
    await TrackPlayer.pause();
  } else {
    await TrackPlayer.play();
  }
}

export async function skipNext() {
  try {
    await TrackPlayer.skipToNext();
  } catch (e) {
    // end of queue
  }
}

export async function skipPrevious() {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (e) {
    // start of queue
  }
}

export async function seekTo(seconds: number) {
  await TrackPlayer.seekTo(seconds);
}

export async function setRepeatMode(mode: RepeatMode) {
  await TrackPlayer.setRepeatMode(mode);
}

export function useActiveTrack(): Track | null {
  const {queue, index} = useCurrentQueue();
  if (index < 0 || index >= queue.length) return null;
  return queue[index];
}
