/**
 * Unit tests for the MovieItem component.
 *
 * These tests ensure that:
 * - The component correctly renders movie details (title, overview, release year, vote average).
 * - The poster image is displayed with the right src and alt text.
 * - The movie title links to its details page.
 * - Missing or incomplete data is handled gracefully with fallback values.
 * 
 * The next/image component is mocked for compatibility with the test environment.
 */

import { render, screen } from "@testing-library/react";
import MovieItem, { TmdbMovie } from "@/app/components/movies/MovieItem";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import { ImageProps } from "next/image";

// Properly mock the next/image component with TypeScript typing
vi.mock("next/image", () => {
  return {
    __esModule: true,
    default: (props: ImageProps) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return <img src={props.src as string} alt={props.alt} />;
    },
  };
});

describe("MovieItem Component", () => {
  const baseMovie: TmdbMovie = {
    id: 1,
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing.",
    poster_path: "/inception.jpg",
    vote_average: 8.7,
    release_date: "2010-07-16",
  };

  it("renders movie title and overview", () => {
    render(<MovieItem result={baseMovie} />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(
      screen.getByText(/A thief who steals corporate secrets/i)
    ).toBeInTheDocument();
  });

  it("renders poster image with correct alt text", () => {
    render(<MovieItem result={baseMovie} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("inception.jpg"));
    expect(img).toHaveAttribute("alt", "Inception");
  });

  it("shows vote average and thumbs up icon", () => {
    render(<MovieItem result={baseMovie} />);
    expect(screen.getByText("8.7")).toBeInTheDocument();
  });

  it("displays release year from release_date", () => {
    render(<MovieItem result={baseMovie} />);
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("links to movie details page", () => {
    render(<MovieItem result={baseMovie} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/moviedetails/1");
  });

  it("handles missing fields gracefully", () => {
    const incompleteMovie: TmdbMovie = { id: 2 };
    render(<MovieItem result={incompleteMovie} />);
    expect(screen.getByText("Untitled")).toBeInTheDocument();
    expect(screen.getByText("No description available.")).toBeInTheDocument();
  });
});