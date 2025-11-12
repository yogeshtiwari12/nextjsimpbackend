'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Movie {
  _id: string;
  movie_name: string;
  genre: string;
  releaseDate: string;
  director: string;
  duration: number;
  language: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setError(null);
    setLoading(true);
    let active = true;
    try {
      const response = await axios.get(`/api/movies`);
      console.log('Raw API response:', response.data);
      if (active) setMovies(response.data.moviedata || []);
    } catch (err) {
      if (active)
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : 'Failed to load movies'
        );
    } finally {
      active && setLoading(false);
    }
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (loading)
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Movies Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow-sm animate-pulse bg-white/60 dark:bg-neutral-800"
            >
              <div className="h-6 w-2/3 bg-gray-300 dark:bg-neutral-700 rounded mb-4" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded mb-2" />
              <div className="flex gap-2 mt-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
                <div className="h-3 w-28 bg-gray-200 dark:bg-neutral-700 rounded" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-neutral-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-lg border border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-300 rounded p-4">
          <p className="font-semibold mb-2">Error loading movies</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={fetchMovies}
            className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Movies Collection</h1>
      {movies.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          No movies found. Try adding some data.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-neutral-900 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold tracking-tight">{movie.movie_name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Director: <span className="font-medium">{movie.director}</span>
              </p>
              <div className="mt-3 flex justify-between text-xs text-gray-700 dark:text-gray-300">
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800">
                  {movie.genre}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  Rating: {movie.rating?.toFixed?.(1) ?? movie.rating}/10
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <div>Released: {formatDate(movie.releaseDate)}</div>
                <div>Duration: {movie.duration} mins</div>
                <div>Language: {movie.language}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}