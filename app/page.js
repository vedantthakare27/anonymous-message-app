'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 to-orange-400 text-white p-6 text-center">
      <div className="bg-white text-black rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">@tved27</h1>
        <p className="mb-6 text-sm text-gray-700">
          Send me anonymous messages 🔥
        </p>
        <Link
          href="/v/vedant"
          className="inline-block bg-black text-white py-3 px-6 rounded-full hover:bg-gray-900 transition"
        >
          Tap to Message Me
        </Link>
      </div>
    </main>
  );
}
