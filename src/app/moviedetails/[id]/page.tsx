"use client";

// Imports Start
import { useEffect, useState } from "react";
import MovieDetails from "@/app/components/movies/MovieDetails";
import Loader from "@/app/components/custom/Loader";
// Imports Start

// Props Types Start
interface MovieItemProps {
	params: Promise<{ id: string }>;
}
// Props Types End

const MovieItem: React.FC<MovieItemProps> = ({ params }) => {
	// State Variables Start
	const [movieId, setMovieId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// State Variables End

	// Set ID To Params Start
	useEffect(() => {
		const unwrapParams = async () => {
			try {
				const unwrappedParams = await params;
				const id = parseInt(unwrappedParams.id);

				if (isNaN(id)) {
					setError("Invalid movie ID");
					setMovieId(null);
				} else {
					setMovieId(id);
					setError(null);
				}
			} catch (err) {
				setError("Failed to load movie parameters");
				setMovieId(null);
			} finally {
				setIsLoading(false);
			}
		};

		unwrapParams();
	}, [params]);
	// Set ID To Params End

	// Show loader while loading
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	// Show error if there's an error
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
						Error
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
				</div>
			</div>
		);
	}

	// Show movie not found if movieId is null
	if (movieId === null) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
						Movie Not Found
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						The movie ID is invalid or missing.
					</p>
				</div>
			</div>
		);
	}
	return (
		<div>
			<MovieDetails movieId={movieId} />
		</div>
	);
};

export default MovieItem;
