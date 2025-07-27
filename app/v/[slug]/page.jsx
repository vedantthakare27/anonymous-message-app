"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagePage() {
  const params = useParams();
  const slug = (params?.slug ?? "").toString();
  const safeSlug = slug.toLowerCase().trim();

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    // Find the user by username
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", safeSlug);

    if (error) {
      alert("Supabase error: " + error.message);
      setLoading(false);
      return;
    }

    if (!users || users.length === 0) {
      alert("User not found");
      setLoading(false);
      return;
    }

    const user = users[0];

    // Insert the message
    const { error: insertError } = await supabase.from("messages").insert({
      to_user_id: user.id,
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-pink-300 p-4">
      <motion.div
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-extrabold mb-6 text-purple-700"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          💌 Send a message to @{safeSlug}
        </motion.h1>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              className="text-green-600 font-semibold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              ✅ Message sent anonymously!
              <motion.button
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-200"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSent(false)}
              >
                Send another
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <textarea
                className="w-full border border-purple-300 p-4 rounded-xl mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none placeholder-gray-400"
                placeholder="Type something nice... 💬"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 rounded-xl transition-all duration-200"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "Sending..." : "✉️ Send Message"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
