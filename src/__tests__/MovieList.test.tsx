/**
 * MovieList Component
 *
 * Renders a responsive grid of MovieItem components using the provided
 * list of TMDB movie results. 
 *
 * Features:
 * - Uses useMemo to optimize rendering of the movie results list.
 * - Displays movies in a grid layout with responsive column counts.
 * - Shows an empty state message if no movies are available.
 * 
 * Props:
 * - results (TmdbMovie[]): An array of TMDB movie objects to render.
 */

import { render, screen } from "@testing-library/react";
import MovieList from "@/app/components/movies/MovieList";
import { TmdbMovie } from "@/app/services/tmdb-api";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

// Mock MovieItem to avoid deep rendering
vi.mock("@/app/components/movies/MovieItem", () => ({
  __esModule: true,
  default: ({ result }: { result: TmdbMovie }) => (
    <div data-testid="movie-item">{result.title}</div>
  ),
}));

describe("MovieList Component", () => {
  const mockMovies: TmdbMovie[] = [
    {
      id: 1,
      title: "Inception",
      overview: "A mind-bending thriller",
      poster_path: "/inception.jpg",
      vote_average: 8.7,
      release_date: "2010-07-16",
    },
    {
      id: 2,
      title: "Interstellar",
      overview: "A journey beyond the stars",
      poster_path: "/interstellar.jpg",
      vote_average: 8.6,
      release_date: "2014-11-07",
    },
  ];

  it("renders a list of movies when results are provided", () => {
    render(<MovieList results={mockMovies} />);
    expect(screen.getAllByTestId("movie-item")).toHaveLength(2);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  it("renders empty state when no results are provided", () => {
    render(<MovieList results={[]} />);
    expect(screen.getByText("No movies available.")).toBeInTheDocument();
  });
});
