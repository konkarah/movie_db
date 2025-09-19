import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Paginator from "@/app/components/paginator/index";

describe("Paginator Component", () => {
  let onPageChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onPageChange = vi.fn();
  });

  it("does not render if totalPages <= 1", () => {
    const { container } = render(
      <Paginator currentPage={1} totalPages={1} onPageChange={onPageChange} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page info when showPageInfo is true", () => {
    render(
      <Paginator currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("does not render page info when showPageInfo is false", () => {
    render(
      <Paginator
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
        showPageInfo={false}
      />
    );
    expect(screen.queryByText("Page 2 of 5")).toBeNull();
  });

  it("renders navigation buttons when showNavigation is true", () => {
    render(
      <Paginator currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByLabelText("Go to first page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to last page")).toBeInTheDocument();
  });

  it("does not render first/last buttons when showNavigation is false", () => {
    render(
      <Paginator
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
        showNavigation={false}
      />
    );
    expect(screen.queryByLabelText("Go to first page")).toBeNull();
    expect(screen.queryByLabelText("Go to last page")).toBeNull();
    // Previous/Next should still be present
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
  });

  it("disables previous/first buttons on first page", () => {
    render(
      <Paginator currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByLabelText("Go to first page")).toBeDisabled();
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
  });

  it("disables next/last buttons on last page", () => {
    render(
      <Paginator currentPage={5} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
    expect(screen.getByLabelText("Go to last page")).toBeDisabled();
  });

  it("calls onPageChange with correct page when navigation buttons clicked", () => {
    render(
      <Paginator currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByLabelText("Go to first page"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText("Go to previous page"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText("Go to next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByLabelText("Go to last page"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("renders correct page numbers and highlights current page", () => {
    render(
      <Paginator currentPage={3} totalPages={7} onPageChange={onPageChange} />
    );

    const currentPageButton = screen.getByRole("button", { name: "Go to page 3" });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");

    // Check first page button
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    // Check last page button of visible range
    expect(screen.getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();
    // Check that page outside visible range not rendered (page 6)
    expect(screen.queryByRole("button", { name: "Go to page 6" })).toBeNull();
  });

  it("calls onPageChange when page number button clicked", () => {
    render(
      <Paginator currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("renders ellipsis when pages are truncated", () => {
    render(
      <Paginator currentPage={5} totalPages={10} onPageChange={onPageChange} />
    );

    // Ellipsis before and after
    expect(screen.getAllByText("...").length).toBeGreaterThanOrEqual(1);
  });
});
