'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 text-center border border-white/40">
        <h1 className="text-3xl font-bold mb-2 text-black">@tved27</h1>
        <p className="text-sm text-gray-800 mb-6">
          Send me anonymous messages 💌
        </p>

        <Link
          href="/v/vedant"
          className="inline-block w-full text-center bg-black text-white py-3 px-6 rounded-full hover:bg-gray-900 transition font-semibold"
        >
          Tap to Message Me
        </Link>
      </div>
    </main>
  );
}
