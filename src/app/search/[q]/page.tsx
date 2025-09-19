"use client";

// Imports Start
import React, { use, useEffect, useState } from "react";
import { searchMovies, TmdbMovie } from "@/app/services/tmdb-api";
import MovieList from "@/app/components/movies/MovieList";
// Imports Emd

interface SearchResultsPageProps {
	params: Promise<{ q?: string }>;
}

const SearchResultsPage = ({ params }: SearchResultsPageProps) => {
	const resolvedParams = use(params);
	const query = resolvedParams?.q ?? "";

	// State Variables Start
	const [results, setResults] = useState<TmdbMovie[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// State Variables End

	useEffect(() => {
		if (!query) return;

		// Search Movie From Service Start
		const fetchResults = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await searchMovies(query);
				setResults(res.results || []);
			} catch (err) {
				setError("Failed to fetch search results.");
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [query]);
	// Search Movie From Service Start

	return (
		/* Search Start Results Start */
		<div className="p-6 min-h-[400px]">
			{" "}
			<h1 className="text-xl font-semibold mb-4">
				Search results for:{" "}
				<span className="text-indigo-600">{decodeURIComponent(query)}</span>
			</h1>
			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{!loading && !error && results.length === 0 && <p>No results found</p>}
			{results.length > 0 && <MovieList results={results} />}
		</div>
		/* Search Start Results Start */
	);
};

export default SearchResultsPage;
