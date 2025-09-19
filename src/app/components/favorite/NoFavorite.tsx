"use client";

// Imports Start
import React from "react";
import { useRouter } from "next/navigation";
// Imports End

const NoFavorite: React.FC = () => {
	// Router Variable Start
	const router = useRouter();
	// Router Variable End

	return (
		<div className="min-h-[500px] flex items-center justify-center">
			<div className="text-center max-w-md mx-auto p-6">
				<div className="text-gray-400 text-6xl mb-4">💫</div>
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
					No favorites yet!
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-4">
					Start exploring movies and add them to your favorites to see them
					here.
				</p>
				<button
					onClick={() => router.push("/")}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
				>
					Browse Movies
				</button>
			</div>
		</div>
	);
};

export default NoFavorite;
