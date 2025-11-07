'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function UploadMoviePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    movie_name: '',
    genre: '',
    releaseDate: '',
    director: '',
    rating: '',
    duration: '',
    language: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/api/upload_movie`, formData);
      if (response.data.moviedata) {
        router.push('/movies_data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload New Movie</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Movie Name</label>
            <input
              type="text"
              value={formData.movie_name}
              onChange={(e) => setFormData({...formData, movie_name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Genre</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Release Date</label>
            <input
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Director</label>
            <input
              type="text"
              value={formData.director}
              onChange={(e) => setFormData({...formData, director: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Rating</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Language</label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Movie'}
          </button>
        </form>
      </div>
    </div>
  );
}
