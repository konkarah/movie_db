// Imports Start
import React, { useMemo } from "react";
import MovieItem from "./MovieItem";
import { TmdbMovie } from "@/app/services/tmdb-api";
// Imports End 

// Type Start
type MovieListProps = {
  results: TmdbMovie[];
};
// Type End

const MovieList = ({ results }: MovieListProps) => {
  // Filtered Results Start
  const filteredResults = useMemo(() => results, [results]);
  // Filtered Results End

  return (
    <div className="px-4">
      {/* Movie Grid Start */}
      {filteredResults.length > 0 ? (
        <div
          className="
            mx-auto
            max-w-screen-sm
            sm:max-w-screen-md
            md:max-w-screen-lg
            lg:max-w-screen-xl
            xl:max-w-[1400px]
            grid 
            grid-cols-1 sm:grid-cols-1 
            md:grid-cols-2
            lg:grid-cols-3 
            xl:grid-cols-4
            gap-3 sm:gap-4 md:gap-6
          "
        >
          {filteredResults.map((result) => (
            <MovieItem key={result.id} result={result} />
          ))}
        </div>
      ) : (
        // Empty State Start
        <div className="text-center py-10">
          No movies available.
        </div>
        // Empty State End
      )}
      {/* Movie Grid End */}
    </div>
  );
};

export default MovieList;
