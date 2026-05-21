
/* ─────────────────────────────────────────────────────────────────
   Facebook Graph API Service
   All tokens stay in localStorage — never sent to any third party.
   API calls go directly browser → graph.facebook.com (CORS allowed).
───────────────────────────────────────────────────────────────── */

export const FB_TOKEN_KEY   = 'bbc_fb_token';
export const FB_PAGE_ID_KEY = 'bbc_fb_page_id';
export const FB_DEFAULT_PAGE = 'AkowuahJosephMinistries';

const FB_API       = 'https://graph.facebook.com/v20.0';
const CACHE_PREFIX = 'bbc_fb_c_';
const CACHE_TTL    = 30 * 60 * 1000; // 30 minutes

/* ── Types ─────────────────────────────────────────────────── */

export interface FBImage {
  source: string;
  width:  number;
  height: number;
}

export interface FBPhoto {
  id:           string;
  images:       FBImage[];
  name?:        string;
  created_time: string;
}

export interface FBAlbum {
  id:           string;
  name:         string;
  count?:       number;
  created_time?: string;
  cover_photo?: { images: FBImage[] };
}

/* ── Token helpers ─────────────────────────────────────────── */

export const getToken  = () => localStorage.getItem(FB_TOKEN_KEY)   || '';
export const getPageId = () => localStorage.getItem(FB_PAGE_ID_KEY) || FB_DEFAULT_PAGE;

/* ── Cache helpers ─────────────────────────────────────────── */

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: { d: T; ts: number } = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.d;
  } catch { return null; }
}

function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ d: data, ts: Date.now() }));
  } catch { /* quota exceeded — skip cache */ }
}

export function clearFBCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}

export function getCacheAge(pageId: string): number | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + `latest_${pageId}`);
    if (!raw) return null;
    const entry: { ts: number } = JSON.parse(raw);
    return Date.now() - entry.ts;
  } catch { return null; }
}

/* ── API fetch wrapper ─────────────────────────────────────── */

async function fbGet(path: string, token: string): Promise<Record<string, unknown>> {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${FB_API}${path}${sep}access_token=${encodeURIComponent(token)}`);
  const json = await res.json() as Record<string, unknown>;
  if (json.error) {
    const err = json.error as { message: string; code: number };
    const msg = err.message || 'Facebook API error';
    if (err.code === 4 || err.code === 17 || err.code === 32)
      throw new RateLimitError(msg);
    throw new Error(msg);
  }
  return json;
}

export class RateLimitError extends Error {
  constructor(msg: string) { super(msg); this.name = 'RateLimitError'; }
}

/* ── API methods ───────────────────────────────────────────── */

export async function testConnection(token: string, pageId: string): Promise<string> {
  const data = await fbGet(`/${pageId}?fields=name,id`, token);
  return String(data.name || pageId);
}

export async function fetchAlbums(token: string, pageId: string): Promise<FBAlbum[]> {
  const cacheKey = `albums_${pageId}`;
  const cached = readCache<FBAlbum[]>(cacheKey);
  if (cached) return cached;

  const data = await fbGet(
    `/${pageId}/albums?fields=id,name,count,created_time,cover_photo{images}&limit=25`,
    token
  );
  const albums = ((data.data as FBAlbum[]) || []).filter(a => (a.count ?? 0) > 0);
  writeCache(cacheKey, albums);
  return albums;
}

export async function fetchLatestPhotos(token: string, pageId: string): Promise<FBPhoto[]> {
  const cacheKey = `latest_${pageId}`;
  const cached = readCache<FBPhoto[]>(cacheKey);
  if (cached) return cached;

  const data = await fbGet(
    `/${pageId}/photos?type=uploaded&fields=id,images,name,created_time&limit=80`,
    token
  );
  const photos = (data.data as FBPhoto[]) || [];
  writeCache(cacheKey, photos);
  return photos;
}

export async function fetchAlbumPhotos(token: string, albumId: string): Promise<FBPhoto[]> {
  const cacheKey = `album_${albumId}`;
  const cached = readCache<FBPhoto[]>(cacheKey);
  if (cached) return cached;

  const data = await fbGet(
    `/${albumId}/photos?fields=id,images,name,created_time&limit=100`,
    token
  );
  const photos = (data.data as FBPhoto[]) || [];
  writeCache(cacheKey, photos);
  return photos;
}

/* ── Image size helpers ────────────────────────────────────── */

export function getLargeImage(photo: FBPhoto): string {
  if (!photo.images?.length) return '';
  return [...photo.images].sort((a, b) => b.width - a.width)[0]?.source ?? '';
}

export function getMediumImage(photo: FBPhoto): string {
  if (!photo.images?.length) return '';
  const sorted = [...photo.images].sort((a, b) => a.width - b.width);
  return sorted.find(img => img.width >= 320)?.source ?? sorted[sorted.length - 1]?.source ?? '';
}
