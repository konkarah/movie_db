// This test suite validates all critical behaviors of MovieDetails:

// ✅ Data fetching lifecycle (loading → success/error)
// ✅ Rendering of required fields (title, overview)
// ✅ Rendering of optional fields (genres, cast, crew, companies, financials)
// ✅ Error fallback when API fails or movie is missing
// ✅ Ensuring correct interaction with the service layer

import { vi, describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MovieDetails from "@/app/components/movies/MovieDetails";
import { getMovieById } from "@/app/services/tmdb-api";
import { ImageProps } from "next/image";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/moviedetails/1",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component with proper typing
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: ImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt} {...props} />
  ),
}));

// Mock Clerk authentication
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isSignedIn: true,
    isLoaded: true,
    user: { 
      id: "123", 
      firstName: "Emmanuel",
      publicMetadata: { favs: [] }
    },
  }),
}));

// Mock TMDB API service
vi.mock("@/app/services/tmdb-api", () => ({
  getMovieById: vi.fn(),
}));

// Mock the Card component with proper typing
vi.mock("@/app/components/custom/Card", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
}));

// Mock the Loader component
vi.mock("@/app/components/custom/Loader", () => ({
  default: () => <div data-testid="loader">Loading movies...</div>,
}));

// Mock the AddToFav component to avoid router issues with proper typing
vi.mock("@/app/components/favorite/AddToFav", () => ({
  default: ({ movieId, title }: { movieId: number; title: string }) => (
    <button data-testid="add-to-fav">
      Add {title} to favorites (ID: {movieId})
    </button>
  ),
}));

const mockedGetMovieById = vi.mocked(getMovieById);

describe("MovieDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state initially", () => {
    mockedGetMovieById.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<MovieDetails movieId={1} />);
    
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByText("Loading movies...")).toBeInTheDocument();
  });

  it("renders movie details after loading", async () => {
    const mockMovie = {
      id: 1,
      title: "The Matrix",
      overview: "A computer hacker learns from mysterious rebels about the true nature of his reality.",
      genres: [
        { id: 28, name: "Action" },
        { id: 878, name: "Science Fiction" },
      ],
      vote_average: 8.2,
      vote_count: 25000,
      release_date: "1999-03-31",
      runtime: 136,
      tagline: "Welcome to the Real World.",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      status: "Released",
      spoken_languages: [{ iso_639_1: "en", english_name: "English" }],
    };

    mockedGetMovieById.mockResolvedValueOnce(mockMovie);

    render(<MovieDetails movieId={1} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    // Check movie details are rendered
    await waitFor(() => {
      expect(screen.getByText("The Matrix")).toBeInTheDocument();
      expect(screen.getByText(/A computer hacker learns/)).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Science Fiction")).toBeInTheDocument();
      expect(screen.getByText('"Welcome to the Real World."')).toBeInTheDocument();
    });

    // Check rating is displayed
    expect(screen.getByText("8.2")).toBeInTheDocument();
    
    // Check year is displayed
    expect(screen.getByText("1999")).toBeInTheDocument();
    
    // Check runtime is displayed
    expect(screen.getByText("136 min")).toBeInTheDocument();
    
    // Check AddToFav component is rendered
    expect(screen.getByTestId("add-to-fav")).toBeInTheDocument();
  });

  it("displays error state when movie is not found", async () => {
    mockedGetMovieById.mockResolvedValueOnce(null);

    render(<MovieDetails movieId={999} />);

    await waitFor(() => {
      expect(screen.getByText("Movie not found")).toBeInTheDocument();
      expect(screen.getByText(/doesn't exist or has been removed/)).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    mockedGetMovieById.mockRejectedValueOnce(new Error("API Error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<MovieDetails movieId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Movie not found")).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching movie:", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("renders movie without optional fields", async () => {
    const minimalMovie = {
      id: 2,
      title: "Simple Movie",
      overview: "A simple movie for testing.",
    };

    mockedGetMovieById.mockResolvedValueOnce(minimalMovie);

    render(<MovieDetails movieId={2} />);

    await waitFor(() => {
      expect(screen.getByText("Simple Movie")).toBeInTheDocument();
      expect(screen.getByText("A simple movie for testing.")).toBeInTheDocument();
    });

    // Should not crash when optional fields are missing
    expect(screen.queryByText("Action")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument(); // No budget/revenue
  });

  it("renders cast section when cast data is available", async () => {
    const movieWithCast = {
      id: 3,
      title: "Movie with Cast",
      overview: "A movie with cast information.",
      cast: [
        {
          id: 1,
          name: "Keanu Reeves",
          character: "Neo",
          profile_path: "/profile1.jpg",
        },
        {
          id: 2,
          name: "Laurence Fishburne",
          character: "Morpheus",
          profile_path: "/profile2.jpg",
        },
      ],
    };

    mockedGetMovieById.mockResolvedValueOnce(movieWithCast);

    render(<MovieDetails movieId={3} />);

    await waitFor(() => {
      expect(screen.getByText("Cast")).toBeInTheDocument();
      expect(screen.getByText("Keanu Reeves")).toBeInTheDocument();
      expect(screen.getByText("Neo")).toBeInTheDocument();
      expect(screen.getByText("Laurence Fishburne")).toBeInTheDocument();
      expect(screen.getByText("Morpheus")).toBeInTheDocument();
    });
  });

  it("renders director and writers when crew data is available", async () => {
    const movieWithCrew = {
      id: 4,
      title: "Movie with Crew",
      overview: "A movie with crew information.",
      crew: [
        {
          id: 1,
          name: "Lana Wachowski",
          job: "Director",
          profile_path: "/director.jpg",
        },
        {
          id: 2,
          name: "Lilly Wachowski",
          job: "Writer",
          profile_path: "/writer.jpg",
        },
      ],
    };

    mockedGetMovieById.mockResolvedValueOnce(movieWithCrew);

    render(<MovieDetails movieId={4} />);

    await waitFor(() => {
      expect(screen.getByText("Director")).toBeInTheDocument();
      expect(screen.getByText("Writers")).toBeInTheDocument();
      expect(screen.getByText("Lana Wachowski")).toBeInTheDocument();
      expect(screen.getByText("Lilly Wachowski")).toBeInTheDocument();
    });
  });

  it("renders production companies when available", async () => {
    const movieWithProduction = {
      id: 5,
      title: "Movie with Production",
      overview: "A movie with production companies.",
      production_companies: [
        {
          id: 1,
          name: "Warner Bros.",
          logo_path: "/wb_logo.jpg",
        },
        {
          id: 2,
          name: "Village Roadshow",
          logo_path: null,
        },
      ],
    };

    mockedGetMovieById.mockResolvedValueOnce(movieWithProduction);

    render(<MovieDetails movieId={5} />);

    await waitFor(() => {
      expect(screen.getByText("Production Companies")).toBeInTheDocument();
      expect(screen.getByText("Warner Bros.")).toBeInTheDocument();
      expect(screen.getByText("Village Roadshow")).toBeInTheDocument();
    });
  });

  it("renders financial information when budget and revenue are available", async () => {
    const movieWithFinancials = {
      id: 6,
      title: "Expensive Movie",
      overview: "A movie with financial data.",
      budget: 63000000,
      revenue: 467222824,
    };

    mockedGetMovieById.mockResolvedValueOnce(movieWithFinancials);

    render(<MovieDetails movieId={6} />);

    await waitFor(() => {
      expect(screen.getByText("Financials")).toBeInTheDocument();
      expect(screen.getByText("$63,000,000")).toBeInTheDocument();
      expect(screen.getByText("$467,222,824")).toBeInTheDocument();
    });
  });

  it("calls getMovieById with correct movieId", async () => {
    const mockMovie = {
      id: 7,
      title: "Test Movie",
      overview: "Testing API call.",
    };

    mockedGetMovieById.mockResolvedValueOnce(mockMovie);

    render(<MovieDetails movieId={7} />);

    expect(mockedGetMovieById).toHaveBeenCalledWith(7);
    expect(mockedGetMovieById).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });
});