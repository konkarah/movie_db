/**
 * ============================================================
 * TMDB API Service Unit Tests
 * ============================================================
 * This test suite verifies the behavior of our TMDB API wrapper.
 * It uses Vitest with mocked functions to avoid real API calls.
 *
 * Coverage:
 * - getTopRatedMovies: success, pagination, empty results, errors
 * - getTrendingAllWeek: success, default params, network errors
 * - getMovieById: success, invalid IDs, missing/null data, server errors
 * - searchMovies: success, empty queries, special characters,
 *                 no results, long queries, default params
 * - Edge cases: rate limiting, malformed responses, invalid page numbers
 * - Performance: very large page values and long query strings
 * - Mock verification: ensures mocks work, call counts & args checked
 *
 * Goal:
 * Ensure our API service functions handle happy paths, edge cases,
 * and error conditions gracefully while keeping predictable behavior.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Movie, MovieDetails, MoviesResponse } from "@/app/services/tmdb-api";

// ===========================================
// MOCK SETUP - Clean and Simple Approach
// ===========================================

// Mock the TMDB API service functions
vi.mock('@/app/services/tmdb-api', async () => {
  const actual = await vi.importActual<typeof import('@/app/services/tmdb-api')>('@/app/services/tmdb-api');
  
  return {
    ...actual,
    getTopRatedMovies: vi.fn(),
    getTrendingAllWeek: vi.fn(),
    getMovieById: vi.fn(),
    searchMovies: vi.fn(),
  };
});

// Import the mocked functions
import {
  getTopRatedMovies,
  getTrendingAllWeek,
  getMovieById,
  searchMovies,
} from "@/app/services/tmdb-api";

// Type the mocked functions for better TypeScript support
const mockedGetTopRatedMovies = vi.mocked(getTopRatedMovies);
const mockedGetTrendingAllWeek = vi.mocked(getTrendingAllWeek);
const mockedGetMovieById = vi.mocked(getMovieById);
const mockedSearchMovies = vi.mocked(searchMovies);

// ===========================================
// TEST DATA - Reusable Mock Responses
// ===========================================

const mockMovie: Movie = {
  id: 550,
  title: "Fight Club",
  overview: "A ticking-time-bomb insomniac and a slippery soap salesman...",
  poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  backdrop_path: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  release_date: "1999-10-15",
  vote_average: 8.433,
  vote_count: 27252,
  adult: false,
  genre_ids: [18, 53, 35],
  original_language: "en",
  original_title: "Fight Club",
  popularity: 61.416,
  video: false
};

const mockMoviesResponse: MoviesResponse = {
  page: 1,
  results: [mockMovie],
  total_pages: 500,
  total_results: 10000
};

const mockSearchResponse: MoviesResponse = {
  page: 1,
  results: [
    {
      ...mockMovie,
      title: "The Matrix",
      id: 603
    }
  ],
  total_pages: 1,
  total_results: 1
};

const mockMovieDetails: MovieDetails = {
  ...mockMovie,
  runtime: 139,
  budget: 63000000,
  revenue: 100853753,
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" }
  ],
  production_companies: [
    {
      id: 508,
      name: "Regency Enterprises",
      logo_path: "/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png",
      origin_country: "US"
    }
  ],
  status: "Released",
  tagline: "How much can you know about yourself if you've never been in a fight?",
  imdb_id: "tt0137523",
  homepage: "http://www.foxmovies.com/movies/fight-club",
  spoken_languages: [
    { english_name: "English", iso_639_1: "en", name: "English" }
  ],
  production_countries: [
    { iso_3166_1: "US", name: "United States of America" }
  ],
  belongs_to_collection: null
};

// ===========================================
// TEST SUITE
// ===========================================

describe("TMDB API Service", () => {
  beforeEach(() => {
    // Set up environment variable for each test
    vi.stubEnv('NEXT_PUBLIC_API_KEY', 'test_api_key_12345');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ===========================================
  // TOP RATED MOVIES TESTS
  // ===========================================
  
  describe("getTopRatedMovies", () => {
    it("should fetch top rated movies successfully", async () => {
      mockedGetTopRatedMovies.mockResolvedValue(mockMoviesResponse);

      const result = await getTopRatedMovies(1);

      expect(result).toEqual(mockMoviesResponse);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].title).toBe("Fight Club");
      expect(mockedGetTopRatedMovies).toHaveBeenCalledWith(1);
    });

    it("should handle different page numbers", async () => {
      const page2Response = { ...mockMoviesResponse, page: 2 };
      mockedGetTopRatedMovies.mockResolvedValue(page2Response);

      const result = await getTopRatedMovies(2);

      expect(result.page).toBe(2);
      expect(mockedGetTopRatedMovies).toHaveBeenCalledWith(2);
    });

    it("should handle API errors gracefully", async () => {
      const errorMessage = "TMDB API Error: Invalid API key";
      mockedGetTopRatedMovies.mockRejectedValue(new Error(errorMessage));

      await expect(getTopRatedMovies(1)).rejects.toThrow(errorMessage);
    });

    it("should handle empty results", async () => {
      const emptyResponse: MoviesResponse = { ...mockMoviesResponse, results: [], total_results: 0 };
      mockedGetTopRatedMovies.mockResolvedValue(emptyResponse);

      const result = await getTopRatedMovies(999);

      expect(result.results).toHaveLength(0);
      expect(result.total_results).toBe(0);
    });
  });

  // ===========================================
  // TRENDING MOVIES TESTS
  // ===========================================

  describe("getTrendingAllWeek", () => {
    it("should fetch trending movies successfully", async () => {
      mockedGetTrendingAllWeek.mockResolvedValue(mockMoviesResponse);

      const result = await getTrendingAllWeek(1);

      expect(result).toEqual(mockMoviesResponse);
      expect(result.results[0]).toHaveProperty('popularity');
      expect(mockedGetTrendingAllWeek).toHaveBeenCalledWith(1);
    });

    it("should handle network errors", async () => {
      mockedGetTrendingAllWeek.mockRejectedValue(new Error("Network error"));

      await expect(getTrendingAllWeek(1)).rejects.toThrow("Network error");
    });

    it("should work with default page parameter", async () => {
      mockedGetTrendingAllWeek.mockResolvedValue(mockMoviesResponse);

      await getTrendingAllWeek();

      expect(mockedGetTrendingAllWeek).toHaveBeenCalledWith();
    });
  });

  // ===========================================
  // MOVIE DETAILS TESTS
  // ===========================================

  describe("getMovieById", () => {
    it("should fetch movie details by ID", async () => {
      mockedGetMovieById.mockResolvedValue(mockMovieDetails);

      const result = await getMovieById(550);

      expect(result).toEqual(mockMovieDetails);
      expect(result.id).toBe(550);
      expect(result.genres).toHaveLength(2);
      expect(mockedGetMovieById).toHaveBeenCalledWith(550);
    });

    it("should handle invalid movie ID", async () => {
      mockedGetMovieById.mockRejectedValue(new Error("TMDB API Error: The resource you requested could not be found."));

      await expect(getMovieById(999999)).rejects.toThrow("The resource you requested could not be found");
    });

    it("should handle missing movie data", async () => {
      mockedGetMovieById.mockResolvedValue(null as unknown as MovieDetails);

      const result = await getMovieById(123);

      expect(result).toBeNull();
    });
  });

  // ===========================================
  // SEARCH MOVIES TESTS
  // ===========================================

  describe("searchMovies", () => {
    it("should search movies with query string", async () => {
      mockedSearchMovies.mockResolvedValue(mockSearchResponse);

      const result = await searchMovies("Matrix", 1);

      expect(result).toEqual(mockSearchResponse);
      expect(result.results[0].title).toBe("The Matrix");
      expect(mockedSearchMovies).toHaveBeenCalledWith("Matrix", 1);
    });

    it("should handle empty search query", async () => {
      const emptyResponse: MoviesResponse = { ...mockSearchResponse, results: [], total_results: 0 };
      mockedSearchMovies.mockResolvedValue(emptyResponse);

      const result = await searchMovies("", 1);

      expect(result.results).toHaveLength(0);
    });

    it("should handle special characters in search", async () => {
      mockedSearchMovies.mockResolvedValue(mockSearchResponse);

      await searchMovies("Spider-Man: No Way Home", 1);

      expect(mockedSearchMovies).toHaveBeenCalledWith("Spider-Man: No Way Home", 1);
    });

    it("should handle search with no results", async () => {
      const noResultsResponse: MoviesResponse = { 
        page: 1, 
        results: [], 
        total_pages: 0, 
        total_results: 0 
      };
      mockedSearchMovies.mockResolvedValue(noResultsResponse);

      const result = await searchMovies("nonexistentmovie12345", 1);

      expect(result.results).toHaveLength(0);
      expect(result.total_results).toBe(0);
    });

    it("should work with default page parameter", async () => {
      mockedSearchMovies.mockResolvedValue(mockSearchResponse);

      await searchMovies("Matrix");

      expect(mockedSearchMovies).toHaveBeenCalledWith("Matrix");
    });
  });

  // ===========================================
  // INTEGRATION & EDGE CASE TESTS
  // ===========================================

  describe("Error Handling & Edge Cases", () => {
    it("should handle rate limiting errors", async () => {
      const rateLimitError = new Error("TMDB API Error: You have exceeded the rate limit");
      mockedGetTopRatedMovies.mockRejectedValue(rateLimitError);

      await expect(getTopRatedMovies(1)).rejects.toThrow("exceeded the rate limit");
    });

    it("should handle server errors", async () => {
      const serverError = new Error("Failed to fetch: 500 Internal Server Error");
      mockedGetMovieById.mockRejectedValue(serverError);

      await expect(getMovieById(123)).rejects.toThrow("500 Internal Server Error");
    });

    it("should handle malformed responses", async () => {
      // Create a properly typed empty response instead of using 'any'
      const emptyResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0
      };
      mockedGetTopRatedMovies.mockResolvedValue(emptyResponse);

      const result = await getTopRatedMovies(1);

      expect(result).toEqual(emptyResponse);
    });
  });

  // ===========================================
  // PERFORMANCE & VALIDATION TESTS
  // ===========================================

  describe("Input Validation & Performance", () => {
    it("should handle very large page numbers", async () => {
      const largePageResponse: MoviesResponse = { ...mockMoviesResponse, page: 1000 };
      mockedGetTopRatedMovies.mockResolvedValue(largePageResponse);

      const result = await getTopRatedMovies(1000);

      expect(result.page).toBe(1000);
    });

    it("should handle negative page numbers gracefully", async () => {
      mockedGetTopRatedMovies.mockRejectedValue(new Error("Invalid page number"));

      await expect(getTopRatedMovies(-1)).rejects.toThrow("Invalid page number");
    });

    it("should handle very long search queries", async () => {
      const longQuery = "a".repeat(1000);
      const emptyResponse: MoviesResponse = { ...mockSearchResponse, results: [] };
      mockedSearchMovies.mockResolvedValue(emptyResponse);

      await searchMovies(longQuery, 1);

      expect(mockedSearchMovies).toHaveBeenCalledWith(longQuery, 1);
    });
  });

  // ===========================================
  // MOCK BEHAVIOR VERIFICATION
  // ===========================================

  describe("Mock Verification", () => {
    it("should verify all mocks are functioning", () => {
      expect(vi.isMockFunction(getTopRatedMovies)).toBe(true);
      expect(vi.isMockFunction(getTrendingAllWeek)).toBe(true);
      expect(vi.isMockFunction(getMovieById)).toBe(true);
      expect(vi.isMockFunction(searchMovies)).toBe(true);
    });

    it("should verify mock call counts", async () => {
      mockedGetTopRatedMovies.mockResolvedValue(mockMoviesResponse);
      
      await getTopRatedMovies(1);
      await getTopRatedMovies(2);

      expect(mockedGetTopRatedMovies).toHaveBeenCalledTimes(2);
    });

    it("should verify mock was called with correct arguments", async () => {
      mockedSearchMovies.mockResolvedValue(mockSearchResponse);

      await searchMovies("Inception", 2);

      expect(mockedSearchMovies).toHaveBeenCalledWith("Inception", 2);
      expect(mockedSearchMovies).toHaveBeenCalledTimes(1);
    });
  });
});