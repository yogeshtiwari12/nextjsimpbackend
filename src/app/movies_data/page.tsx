'use client';

import { useEffect, useState } from 'react';
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

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get(`/api/movies`);
        console.log('Raw API response:', response.data);
        setMovies(response.data.moviedata);
      } catch (err) {
        console.error('Axios error:', err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : 'Failed to load movies'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) return <div className="p-4">Loading movies...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Movies Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <div key={movie._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{movie.movie_name}</h2>
            <p className="text-gray-600 mt-2">Director: {movie.director}</p>
            <div className="mt-4 flex justify-between text-sm">
              <span>Genre: {movie.genre}</span>
              <span>Rating: {movie.rating}/10</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>Released: {new Date(movie.releaseDate).toLocaleDateString()}</div>
              <div>Duration: {movie.duration} mins</div>
              <div>Language: {movie.language}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}