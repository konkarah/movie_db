"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Card from "@/app/components/custom/Card";
import { getMovieById, TmdbMovie } from "@/app/services/tmdb-api";

import {
  Link as LinkIcon,
  Clock,
  Calendar,
  Film,
  Globe,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Mic,
  Award,
} from "lucide-react";
import Loader from "@/app/components/custom/Loader";
import AddToFav from "@/app/components/favorite/AddToFav";
// Imports End

// Types Start
interface MovieCast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
}

interface MovieCrew {
  id: number;
  name: string;
  job: string;
  profile_path?: string;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
}

interface Collection {
  id: number;
  name: string;
  poster_path?: string;
}

interface DetailedMovie {
  id: number;
  title?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  tagline?: string;
  homepage?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: ProductionCompany[];
  belongs_to_collection?: Collection;
  spoken_languages?: Array<{ iso_639_1: string; english_name: string }>;
  cast?: MovieCast[];
  crew?: MovieCrew[];
  runtime?: number;
}

interface MovieDetailsProps {
  movieId: number; // Changed from params to movieId
}

// Types End

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId }) => { // Changed prop to movieId
  // State Variables Start
  const [movie, setMovie] = useState<DetailedMovie | null>(null);
  const [loading, setLoading] = useState(true);
  // State Variables End

  // Fetch Movie Details by ID on Mount Start
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieById(movieId); // Use movieId directly
        setMovie(data as DetailedMovie);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]); // Depend on movieId
  // Fetch Movie Details by ID on Mount End

  // Loading Section Start
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader />
      </div>
    );
  // Loading Section End

  // No Movie Found Section Start
  if (!movie)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-gray-400 text-5xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Movie not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The movie you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  // No Movie Found Section End

  // Image URL with fallback Start
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  // Image URL with fallback End

  // Filter key crew members Start
  const director = movie.crew?.find((person) => person.job === "Director");
  const writers = movie.crew?.filter(
    (person) => person.job === "Writer" || person.job === "Screenplay"
  );
  // Filter key crew members End

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with backdrop */}
        {movie.backdrop_path && (
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-xl">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title || "Movie backdrop"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
        )}

        {/* Main content */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="flex flex-col lg:flex-row">
            {/* Poster */}
            <div className="relative w-full lg:w-1/3 h-96 lg:h-auto flex-shrink-0">
              <Image
                src={imageUrl}
                alt={movie.title || "Untitled"}
                fill
                className="object-cover"
              />
              {movie.vote_average && (
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1 text-sm font-bold text-white shadow-lg">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                  {movie.vote_count && (
                    <span className="text-xs opacity-80 ml-1">
                      ({movie.vote_count.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex-1 space-y-6">
              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {movie.title || "Untitled"}
                </h1>
                {movie.tagline && (
                  <p className="text-lg italic text-indigo-600 dark:text-indigo-400 mt-2">
                    &quot;{movie.tagline}&quot;
                  </p>
                )}
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Overview
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movie.release_date && (
                  <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Release
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>
                )}

                {movie?.runtime && (
                  <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mb-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Runtime
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {movie.runtime} min
                    </span>
                  </div>
                )}

                {movie?.status && (
                  <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Film className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {movie?.status}
                    </span>
                  </div>
                )}

                {movie?.spoken_languages &&
                  movie?.spoken_languages.length > 0 && (
                    <div className="flex flex-col items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Language
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {movie?.spoken_languages[0].english_name}
                      </span>
                    </div>
                  )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium text-sm"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {director && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Director
                    </h4>
                    <div className="flex items-center gap-3">
                      {director.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                          alt={director.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {director.name}
                      </span>
                    </div>
                  </div>
                )}

                {writers && writers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Writers
                    </h4>
                    <div className="space-y-2">
                      {writers.slice(0, 3).map((writer) => (
                        <div
                          key={writer.id}
                          className="flex items-center gap-3"
                        >
                          {writer.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w185${writer.profile_path}`}
                              alt={writer.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                              <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                          )}
                          <span className="text-sm">{writer.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Financials */}
              {((movie?.budget ?? 0) > 0 || (movie?.revenue ?? 0) > 0) && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Financials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(movie?.budget ?? 0) > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Budget
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${movie?.budget?.toLocaleString() ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    )}

                    {(movie?.revenue ?? 0) > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Revenue
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${movie?.revenue?.toLocaleString() ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                {movie?.homepage && (
                  <a
                    href={movie?.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Official Website
                  </a>

                  
                )}

                {/* AddToFav Component */}
                <AddToFav
                  movieId={movie.id}
                  title={movie.title || "Untitled"}
                  image={movie.poster_path}
                  overview={movie.overview}
                  releaseDate={movie.release_date || movie.first_air_date}
                  voteCount={movie.vote_count}
                />
              </div>
            </div>
          </div>

          {/* Additional sections below */}
          {/* Cast */}
          {movie?.cast && movie?.cast.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Cast
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {movie?.cast.slice(0, 10).map((actor) => (
                  <div key={actor.id} className="text-center group">
                    <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden">
                      {actor.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${actor?.profile_path}`}
                          alt={actor?.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                          <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {actor.name}
                    </p>
                    {actor.character && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {actor.character}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Companies */}
          {movie?.production_companies &&
            movie?.production_companies.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Production Companies
                </h3>
                <div className="flex flex-wrap gap-6">
                  {movie?.production_companies.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {c.logo_path ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${c.logo_path}`}
                            alt={c.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {c.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Collection */}
          {movie?.belongs_to_collection && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Part of the {movie?.belongs_to_collection.name} Collection
              </h3>
              {movie?.belongs_to_collection.poster_path && (
                <div className="relative w-40 h-60">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie?.belongs_to_collection.poster_path}`}
                    alt={movie?.belongs_to_collection.name}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MovieDetails;
