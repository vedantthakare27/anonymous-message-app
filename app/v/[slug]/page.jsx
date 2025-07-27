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
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-pink-400 to-orange-400 text-white px-4 py-10">
      <motion.div
        className="max-w-lg w-full mx-auto bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-3xl shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-gray-300 w-10 h-10 rounded-full mr-3 flex items-center justify-center font-bold text-gray-700">
            {slug[0].toUpperCase()}
          </div>
          <div>
            <div className="text-sm text-gray-500">@{slug}</div>
            <div className="text-black font-semibold">send me anonymous messages!</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              className="text-green-600 font-semibold text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              ✅ Message sent!
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
                className="w-full border border-gray-300 p-4 rounded-xl mb-4 h-28 text-black resize-none placeholder-gray-500"
                placeholder="Type something nice... 💬"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all duration-200"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="text-center mt-10 text-sm text-white opacity-90 space-y-2">
        <div>🔒 anonymous q&a</div>
        <div className="text-yellow-200">
          👇 {Math.floor(Math.random() * 400 + 100)} friends just tapped the button 👇
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
