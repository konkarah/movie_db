import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchPage from "@/app/components/searchBox/index";
import * as nextNavigation from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("SearchPage", () => {
  let pushMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    pushMock = vi.fn();
    // Spy on useRouter and return our mock
    (nextNavigation.useRouter as unknown as vi.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders input and button", () => {
    render(<SearchPage />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search movies/i })).toBeInTheDocument();
  });

  it("updates query state on input change", () => {
    render(<SearchPage />);
    const input = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(input, { target: { value: "Inception" } });
    expect((input as HTMLInputElement).value).toBe("Inception");
  });
});
