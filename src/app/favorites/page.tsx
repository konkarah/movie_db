"use client";

// Imports Start
import React, { useState, useEffect, useCallback } from "react";
import MovieList from "@/app/components/movies/MovieList";
import NoFavorite from "@/app/components/favorite/NoFavorite";
import Loader from "@/app/components/custom/Loader";
import ErrorPage from "../error";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
// Imports End

// Type Start
interface Movie {
	movieId: number;
	title: string;
	description: string;
	dateReleased: string;
	rating: number;
	image: string;
}
// Type End

// Favorites Route Start
const Favorites: React.FC = () => {
	// State Variables Start
	const [results, setResults] = useState<Movie[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isSignedIn, isLoaded } = useUser();
	const router = useRouter();
	// State Variables End

	// Fetch Data Start
	const fetchData = useCallback(async () => {
		// Wait for Clerk to load
		if (!isLoaded) return;

		// Redirect if not signed in
		if (!isSignedIn) {
			router.push("/sign-in");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/user/fav", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-store", // prevent caching for fresh results
			});

			if (!res.ok) {
				throw new Error(`Failed to fetch favorites: ${res.status}`);
			}

			const data = await res.json();
			setResults(data.favs || []);
		} catch (err) {
			console.error("Error fetching favorites:", err);
			setError(err instanceof Error ? err.message : "Failed to load favorites");
		} finally {
			setIsLoading(false);
		}
	}, [isLoaded, isSignedIn, router]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);
	// Fetch Data End

	// Loader Start
	if (isLoading) {
		return <Loader />;
	}
	// Loader End

	// Error Handling Start
	if (error) {
		const errorObj = typeof error === "string" ? new Error(error) : error;
		return <ErrorPage error={errorObj} />;
	}
	// Error Handling End

	// Empty favorites Results Start
	if (results.length === 0) {
		return <NoFavorite />;
	}
	// Empty favorites Results End

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Favorite Collection Count Start */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					My Favorites
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{results.length} movie{results.length !== 1 ? "s" : ""} in your
					collection
				</p>
			</div>
			{/* Favorite Collection Count End */}

			{/* Movie List Component Start */}
			<MovieList
				results={results.map((movie) => ({
					id: movie.movieId,
					title: movie.title,
					overview: movie.description,
					release_date: movie.dateReleased,
					vote_average: movie.rating,
					poster_path: movie.image,
				}))}
			/>
			{/* Movie List Component End */}
		</div>
	);
};

export default Favorites;
// Favorites Route End
