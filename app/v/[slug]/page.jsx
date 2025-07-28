"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function MessagePage() {
  const params = useParams();
  const slug = (params?.slug ?? "").toLowerCase().trim();

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const { width, height } = useWindowSize();

  const placeholders = [
    "Type something nice... 💬",
    "Say something funny 😂",
    "Ask me anything ❓",
    "Drop your secrets here 👀",
    "Confess something 👻",
    "Make me smile 😊",
    "What's your opinion about me?",
    "Tell me a joke 🤡"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder every 2 seconds
  useEffect(() => {
    setVisitorCount(Math.floor(Math.random() * 300 + 150));

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", slug);

    if (error || !users || users.length === 0) {
      alert("User not found");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("messages").insert({
      to_user_id: users[0].id,
      body: message,
    });

    if (insertError) {
      alert("Failed to send message: " + insertError.message);
      setLoading(false);
      return;
    }

    setMessage("");
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-pink-400 to-orange-400 text-white px-4 py-10">
      {sent && <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />}

      {/* Message card */}
      <motion.div
        className="w-full max-w-md mx-auto bg-white p-6 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="bg-gray-300 w-10 h-10 rounded-full mr-3 flex items-center justify-center font-bold text-gray-700">
            {slug[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm text-gray-500">@{slug}</div>
            <div className="text-black font-semibold text-md">
              send me anonymous messages!
            </div>
          </div>
        </div>

        {/* Message form / sent */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              className="text-center text-green-600 font-semibold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xl">✅ Sent!</div>
              <motion.button
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSent(false)}
              >
                Send another message
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Textarea with animated placeholder */}
              <div className="relative">
                <textarea
                  className="w-full border border-gray-300 p-4 rounded-xl mb-4 h-28 text-black resize-none placeholder-transparent text-sm sm:text-base"
                  placeholder={placeholders[placeholderIndex]}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
                {message === "" && (
                  <motion.div
                    key={placeholderIndex}
                    className="absolute top-4 left-4 text-gray-400 pointer-events-none text-sm sm:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {placeholders[placeholderIndex]}
                  </motion.div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-xl text-sm sm:text-base transition"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-10 text-sm text-white opacity-90 space-y-2 px-4">
        <div>🔒 anonymous q&a</div>
        <div className="text-yellow-200">
          👇 {visitorCount} friends just tapped the button 👇
        </div>
        <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full mt-2 transition">
          Get your own messages!
        </button>
        <div className="text-xs mt-4">
          <a href="#" className="underline mx-2">Terms</a>
          <a href="#" className="underline mx-2">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
