"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Movie Database App</h1>
          <div className="flex gap-4">
            {status === 'authenticated' && session?.user ? (
              <>
                <span className="py-2">Welcome, {session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="flex gap-4 mb-8">
          <Link
            href="/movies_data"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Movies List
          </Link>
          <Link
            href="/api/movies"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            API Endpoint
          </Link>
        </nav>
      </main>
    </div>
  );
}
