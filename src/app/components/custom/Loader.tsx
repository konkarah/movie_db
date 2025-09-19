import React from "react";

const MovieLoader = () => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<p className="text-gray-600 dark:text-gray-400">
					Loading Movies
				</p>
			</div>
		</div>
	);
};

export default MovieLoader;
