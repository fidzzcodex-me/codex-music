import axios from 'axios';

const BASE_URL = 'https://me.fidzzcodex.my.id';
const API_KEY = 'fidzzcodex';

export interface SearchResultItem {
  name: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  spotifyUrl: string;
}

export interface SearchResponse {
  status: boolean;
  creator: string;
  query: string;
  total: number;
  results: SearchResultItem[];
}

export interface DownloadResponse {
  status: boolean;
  creator: string;
  result: {
    metadata: {
      name: string;
      artist: string;
      album: string;
      cover: string;
      duration: string;
      date: number;
      tid: string;
      spotifyUrl: string;
    };
    links: {
      mp3: string;
      cover: string;
    };
  };
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

export async function searchTracks(query: string): Promise<SearchResultItem[]> {
  if (!query.trim()) return [];
  const {data} = await client.get<SearchResponse>('/search/spotify', {
    params: {apikey: API_KEY, q: query},
  });
  if (!data.status) throw new Error('Search failed');
  return data.results;
}

export async function resolveTrack(spotifyUrl: string): Promise<DownloadResponse['result']> {
  const {data} = await client.post<DownloadResponse>('/download/spotify', {
    apikey: API_KEY,
    url: spotifyUrl,
  });
  if (!data.status) throw new Error('Resolve failed');
  return data.result;
}

function tidFromUrl(spotifyUrl: string): string {
  const match = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : spotifyUrl;
}

export {tidFromUrl};
