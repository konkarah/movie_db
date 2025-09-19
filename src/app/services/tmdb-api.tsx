const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// -----------------------------
// Types Start
// -----------------------------
export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  backdrop_path?: string;
  first_air_date?: string;
  vote_count?: number;
  tagline?: string;
  homepage?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: ProductionCompany[];
  belongs_to_collection?: Collection;
  spoken_languages?: Array<{ iso_639_1: string; english_name: string }>;
  credits?: {
    cast?: MovieCast[];
    crew?: MovieCrew[];
  };
  runtime?: number;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
}

interface Collection {
  id: number;
  name: string;
  poster_path?: string;
}

interface MovieCast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
}

interface MovieCrew {
  id: number;
  name: string;
  job: string;
  profile_path?: string;
}
// -----------------------------
// Types End
// -----------------------------


export interface TrendingResponse {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}



// -----------------------------
// Cache Types Start
// -----------------------------
/**
 * Each cache entry stores:
 * - data: The actual API response
 * - expiry: A timestamp (in ms) when this entry becomes invalid
 */
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// -----------------------------
// Cache
// -----------------------------
/**
 * An in-memory cache object.
 * Keys are the request URLs (string).
 * Values are CacheEntry objects containing the data + expiry timestamp.
 *
 * Example:
 * {
 *   "https://api.themoviedb.org/3/movie/top_rated?page=1&api_key=XYZ": {
 *     data: { results: [...], page: 1, total_pages: 500, total_results: 10000 },
 *     expiry: 1694923456789
 *   }
 * }
 */
const cache: Record<string, CacheEntry<unknown>> = {};

/**
 * Duration (in ms) before a cache entry expires.
 * Here it's set to 5 minutes.
 */
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// -----------------------------
// Fetch Helper
// -----------------------------
async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  if (!API_KEY) {
    throw new Error("TMDB API key is missing. Please set NEXT_PUBLIC_API_KEY environment variable.");
  }

  // Build full URL with API key
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;

  // -----------------------------
  // Cache Check
  // -----------------------------
  // If this request is cached AND not expired -> return cached data
  if (cache[url] && cache[url].expiry > Date.now()) {
    return cache[url].data as T;
  }

  try {
    // Otherwise fetch fresh data from TMDB
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      // Try to extract a detailed error message from TMDB
      let errorMessage = `Failed to fetch: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.status_message) {
          errorMessage = `TMDB API Error: ${errorData.status_message}`;
        }
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    // Parse response JSON
    const data: T = await res.json();

    // -----------------------------
    // Cache Store
    // -----------------------------
    // Save the data with a new expiry timestamp
    cache[url] = { data, expiry: Date.now() + CACHE_DURATION };

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API call failed for ${url}:`, error.message);
      throw error;
    }
    throw new Error("Unknown error occurred during API call");
  }
}

// -----------------------------
// API Calls
// -----------------------------
export function getTrendingAllWeek(page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB<TrendingResponse>(`/trending/all/week?language=en-US&page=${page}`);
}

export function getTopRatedMovies(page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB<TrendingResponse>(`/movie/top_rated?language=en-US&page=${page}`);
}

export function getMovieById(id: number): Promise<TmdbMovie> {
  return fetchFromTMDB<TmdbMovie>(`/movie/${id}?language=en-US&append_to_response=credits`);
}

export function searchMovies(query: string, page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB<TrendingResponse>(
    `/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
}
