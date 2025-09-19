"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import { getTopRatedMovies } from "./services/tmdb-api";
import MovieList from "./components/movies/MovieList";
import MovieLoader from "./components/custom/Loader";
import Paginator from "./components/paginator";
// Imports End

// PropType Start
interface Movie {
	id: number;
	title?: string;
	name?: string;
	overview: string;
	poster_path?: string;
	vote_average?: number;
	release_date?: string;
}

interface TrendingResponse {
	results: Movie[];
	page: number;
	total_pages: number;
	total_results: number;
}
// PropType End

const Home = () => {
	// State Variables Start
	const [results, setResults] = useState<Movie[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	// State Variables End

	// Fetch TopRated Movies from API Service Start
	useEffect(() => {
		const loadTrending = async () => {
			setIsLoading(true);
			try {
				const trending = (await getTopRatedMovies(
					currentPage
				)) as TrendingResponse;
				setResults(trending.results);
				setTotalPages(Math.min(trending.total_pages, 500)); // TMDB limits to 500 pages
			} catch (err: unknown) {
				setError(
					err instanceof Error ? err.message : "An unknown error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadTrending();
	}, [currentPage]);
	// Fetch TopRated Movies from API Service End

	// Handle Page Change Start
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	//  Handle Page Change End

	// Error Boundary Section Start
	if (error)
		return <div className="text-center py-10 text-red-500">{error}</div>;
	// Error Boundary Section End

	// Loader Component Section Start
	if (isLoading) return <MovieLoader />;
	// Loader Component Section End

	return (
		// Home Page Route Start
<div className="p-4">
			{/* Movie List Component Start */}
			<MovieList results={results} />
			{/* Movie List Component End */}

			{/* Paginator Start */}
			{totalPages > 1 && (
				<Paginator
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					className="mt-8"
				/>
			)}
			{/* Paginator End */}
		</div>
		// Home Page Route End
	);
};

export default Home;
