import axios from 'axios';

const LRCLIB_BASE = 'https://lrclib.net/api';

export interface LyricLine {
  time: number;
  text: string;
}

export interface LyricsResult {
  synced: LyricLine[] | null;
  plain: string | null;
}

function parseLRC(lrc: string): LyricLine[] {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeTag = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeTag)];
    if (matches.length === 0) continue;
    const text = line.replace(timeTag, '').trim();
    for (const m of matches) {
      const minutes = parseInt(m[1], 10);
      const seconds = parseInt(m[2], 10);
      const ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0;
      const time = minutes * 60 + seconds + ms / 1000;
      result.push({time, text});
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

export async function fetchLyrics(
  trackName: string,
  artistName: string,
  durationSeconds?: number,
): Promise<LyricsResult> {
  try {
    const {data} = await axios.get(`${LRCLIB_BASE}/search`, {
      params: {track_name: trackName, artist_name: artistName},
      timeout: 12000,
    });

    if (!Array.isArray(data) || data.length === 0) {
      return {synced: null, plain: null};
    }

    let best = data[0];
    if (durationSeconds) {
      best =
        data.find(
          (d: any) => Math.abs((d.duration ?? 0) - durationSeconds) < 3,
        ) ?? data[0];
    }

    const synced = best.syncedLyrics ? parseLRC(best.syncedLyrics) : null;
    const plain = best.plainLyrics ?? null;

    return {synced, plain};
  } catch (e) {
    return {synced: null, plain: null};
  }
}
