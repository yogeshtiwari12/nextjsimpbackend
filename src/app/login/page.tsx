'use client';

import { useState } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/movies_data'
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/movies_data');
        router.refresh();
      }
    } catch (err) {
      setError('Authentication failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Need an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
