'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MessagePage({ params }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [userExists, setUserExists] = useState(null);

  // 🧠 Fix mobile slug issues: trim and lowercase
  const username = decodeURIComponent(params.slug?.toString().trim().toLowerCase());

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', username)
        .single();

      setUserExists(!!data && !error);
    };

    checkUser();
  }, [username]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        content: message.trim(),
        user_id: username,
      },
    ]);

    if (!error) {
      setSent(true);
      setMessage('');
    } else {
      alert('Something went wrong.');
    }
  };

  if (userExists === false) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 p-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 text-center text-black max-w-md w-full">
          <h1 className="text-2xl font-bold">User not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400 p-6">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 text-center text-black max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">@{username}</h1>
        <p className="text-sm text-gray-800 mb-6">Send me anonymous messages 💌</p>

        {sent ? (
          <div className="text-green-700 font-semibold text-center space-y-4">
            <p>✅ Sent!</p>
            <button
              onClick={() => setSent(false)}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
            >
              Send another
            </button>
          </div>
        ) : (
          <>
            <textarea
              rows="4"
              placeholder="Type something nice... 💬"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-900 transition"
            >
              Send Message
            </button>
          </>
        )}
      </div>
    </main>
  );
}
