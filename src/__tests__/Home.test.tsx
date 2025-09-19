import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import { getTopRatedMovies } from "@/app/services/tmdb-api";

// Mock the API service so tests don't hit the real TMDB API
vi.mock("@/app/services/tmdb-api", () => ({
  getTopRatedMovies: vi.fn(),
}));

describe("Home component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Test 1: Ensure loader shows while data is being fetched
  it("renders loader initially", () => {
    (getTopRatedMovies as vi.Mock).mockResolvedValueOnce({
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    });

    render(<Home />);
    // Updated: check for the loader text instead of role="status"
    expect(screen.getByText("Loading Movies")).toBeInTheDocument();
  });

  // ✅ Test 2: Verify movies render after a successful API call
  it("renders movies after successful fetch", async () => {
    (getTopRatedMovies as vi.Mock).mockResolvedValueOnce({
      results: [{ id: 1, title: "Inception", overview: "Dream heist movie" }],
      page: 1,
      total_pages: 1,
      total_results: 1,
    });

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByText("Inception")).toBeInTheDocument()
    );
  });

  // ✅ Test 3: Check error message is displayed if API fails
  it("shows error when API fails", async () => {
    (getTopRatedMovies as vi.Mock).mockRejectedValueOnce(
      new Error("API error")
    );

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByText("API error")).toBeInTheDocument()
    );
  });

  // ✅ Test 4: Ensure API is called again when pagination changes
  it("calls API again when page changes", async () => {
    (getTopRatedMovies as vi.Mock).mockResolvedValue({
      results: [{ id: 1, title: "Movie 1", overview: "..." }],
      page: 1,
      total_pages: 2,
      total_results: 2,
    });

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByText("Movie 1")).toBeInTheDocument()
    );

    // Mock next page response
    (getTopRatedMovies as vi.Mock).mockResolvedValueOnce({
      results: [{ id: 2, title: "Movie 2", overview: "..." }],
      page: 2,
      total_pages: 2,
      total_results: 2,
    });

    fireEvent.click(screen.getByText("2")); // Click paginator button

    await waitFor(() =>
      expect(screen.getByText("Movie 2")).toBeInTheDocument()
    );
  });
});
