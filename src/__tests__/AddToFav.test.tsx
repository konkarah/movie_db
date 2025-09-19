/**
 * AddToFav Component Unit Tests (Updated)
 *
 * This test suite validates the AddToFav component by checking:
 * - Rendering for signed-in and signed-out users
 * - Loading state when Clerk is not loaded
 * - Redirects to /sign-in when unauthenticated
 * - Fetch behavior with and without userMongoId
 */

import AddToFav from "../app/components/favorite/AddToFav";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// --- Mocks ---
// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(),
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("AddToFav Component", () => {
  const mockPush = vi.fn();
  const mockReload = vi.fn();

  const mockUserWithMongoId = {
    isSignedIn: true,
    user: {
      publicMetadata: { 
        favs: [],
        userMongoId: "mock-mongo-id-123"
      },
      reload: mockReload,
    },
    isLoaded: true,
  };

  const mockUserWithoutMongoId = {
    isSignedIn: true,
    user: {
      publicMetadata: { favs: [] },
      reload: mockReload,
    },
    isLoaded: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useUser as jest.Mock).mockReturnValue(mockUserWithMongoId);
    
    // Mock fetch to resolve successfully
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ favs: [] }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Test 1: Renders correctly for signed-in users
  it("renders correctly for signed-in users", async () => {
    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    
    // Wait for the component to finish initializing
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  // ✅ Test 2: Renders correctly for signed-out users
  it("renders correctly for signed-out users", async () => {
    (useUser as jest.Mock).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    });

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    
    // Wait for the component to finish initializing
    await waitFor(() => {
      expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
    });
  });

  // ✅ Test 3: Shows loading state when not loaded
  it("shows loading state when not loaded", () => {
    (useUser as jest.Mock).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: false,
    });

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // ✅ Test 4: Redirects to sign-in when user is not signed in
  it("redirects to sign-in when user is not signed in", async () => {
    (useUser as jest.Mock).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    });

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    
    // Wait for the component to finish initializing
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
    
    const button = screen.getByRole("button", { name: /add to favorites/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/sign-in");
  });

  // ✅ Test 5: Calls fetch when user has userMongoId
  it("calls fetch with correct URL when user has userMongoId", async () => {
    // Mock console.warn to avoid warning output in tests
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    
    // First wait for the component to render completely
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
    
    // Then wait for the fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 3000 });
    
    // Verify the exact call
    expect(global.fetch).toHaveBeenCalledWith("/api/user/fav", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Restore console.warn
    consoleWarnSpy.mockRestore();
  });

  // ✅ Test 6: Does not call fetch when user lacks userMongoId
  it("does not call fetch when user lacks userMongoId", async () => {
    (useUser as jest.Mock).mockReturnValue(mockUserWithoutMongoId);
    
    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    
    // Wait a bit to ensure useEffect has run
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ✅ Test 7: Handles fetch errors gracefully
  it("handles fetch errors gracefully", async () => {
    // Mock fetch to reject
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API error"));
    
    // Mock console.error to avoid error output in tests
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<AddToFav movieId={123} title="Test Movie" showLabel={true} />);
    
    // Component should still render despite the error
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});