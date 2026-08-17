export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  duration: number;
  spotifyUrl: string;
  streamUrl?: string;
  localUri?: string;
  isDownloaded?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}

function durationStringToSeconds(duration: string): number {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export {durationStringToSeconds};
