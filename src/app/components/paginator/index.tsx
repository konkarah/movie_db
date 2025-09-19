"use client";

import React from "react";

interface PaginatorProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	maxVisiblePages?: number;
	showPageInfo?: boolean;
	showNavigation?: boolean;
}

const Paginator: React.FC<PaginatorProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	className = "",
	maxVisiblePages = 5,
	showPageInfo = true,
	showNavigation = true,
}) => {
	// Don't render if there's only one page
	if (totalPages <= 1) return null;

	// Calculate the range of pages to show
	let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
	const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

	// Adjust if we're near the end
	if (endPage - startPage + 1 < maxVisiblePages) {
		startPage = Math.max(1, endPage - maxVisiblePages + 1);
	}

	const pages: number[] = [];
	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	return (
		<div
			className={`flex flex-col sm:flex-row justify-center items-center gap-4 ${className}`}
		>
			{/* Page Info */}
			{showPageInfo && (
				<div className="text-sm text-[var(--foreground)] opacity-70">
					Page {currentPage} of {totalPages}
				</div>
			)}

			{/* Navigation */}
			<nav className="flex items-center gap-1">
				{/* First Page Button */}
				{showNavigation && (
					<button
						onClick={() => onPageChange(1)}
						disabled={currentPage === 1}
						className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Go to first page"
					>
						&laquo;
					</button>
				)}

				{/* Previous Page Button */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Go to previous page"
				>
					&lsaquo;
				</button>

				{/* Page Numbers */}
				{startPage > 1 && (
					<span className="px-2 py-1.5 text-sm text-[var(--foreground)] opacity-60">
						...
					</span>
				)}

				{pages.map((page) => (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
							currentPage === page
								? "bg-indigo-600 text-white border-indigo-600"
								: "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800"
						}`}
						aria-label={`Go to page ${page}`}
						aria-current={currentPage === page ? "page" : undefined}
					>
						{page}
					</button>
				))}

				{endPage < totalPages && (
					<span className="px-2 py-1.5 text-sm text-[var(--foreground)] opacity-60">
						...
					</span>
				)}

				{/* Next Page Button */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Go to next page"
				>
					&rsaquo;
				</button>

				{/* Last Page Button */}
				{showNavigation && (
					<button
						onClick={() => onPageChange(totalPages)}
						disabled={currentPage === totalPages}
						className="px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						aria-label="Go to last page"
					>
						&raquo;
					</button>
				)}
			</nav>
		</div>
	);
};

export default Paginator;
