"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import {
	getTrendingAllWeek,
	getTopRatedMovies,
	TmdbMovie,
} from "@/app/services/tmdb-api";
import MovieList from "@/app/components/movies/MovieList";
import MovieLoader from "@/app/components/custom/Loader";
import Paginator from "@/app/components/paginator/index";
// Imports End

// Type for props Start
interface PageProps {
	params: Promise<{ genre: string }>;
}

interface TrendingResponse {
	results: TmdbMovie[];
	page: number;
	total_pages: number;
	total_results: number;
}
// Type for props End

const Home: React.FC<PageProps> = ({ params }) => {
	// State Variables Start
	const [results, setResults] = useState<TmdbMovie[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	// State Variables End

	// Normal Variables Start
	const unwrappedParams = React.use(params);
	const genre = unwrappedParams.genre;
	// Normal Variables End

	// Fetch TopRated/Trending Movies from API Service Start
	useEffect(() => {
		const loadMovies = async () => {
			setIsLoading(true);
			try {
				let response: TrendingResponse;

				if (genre === "rated") {
					response = await getTopRatedMovies(currentPage);
				} else {
					response = await getTrendingAllWeek(currentPage);
				}

				setResults(response.results);
				setTotalPages(Math.min(response.total_pages, 500)); // TMDB limits to 500 pages
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		loadMovies();
	}, [genre, currentPage]);
	// Fetch TopRated/Trending Movies from API Service End

	// HandlePageChange Start
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
	// HandlePageChange End

	// Error Section Start
	if (error) return <div className="p-4 text-red-500">{error}</div>;
	// Error Section End

	// Movie Loader Start
	if (isLoading)
		return (
			<div className="p-4">
				<MovieLoader />
			</div>
		);
	// Movie Loader End

	return (
		// Top/Trending && Top/Rated Route Start
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
		// Top/Trending && Top/Rated Route End
	);
};

export default Home;
