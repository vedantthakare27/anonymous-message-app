"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MessagePage() {
  const params = useParams();
  const slug = params.slug; // ✅ Correct way in Next.js 15

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    console.log("Trying to send to user:", slug);

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", slug);

    console.log("User result:", users);

    if (error) {
      alert("Supabase error: " + error.message);
      return;
    }

    if (!users || users.length === 0) {
      alert("User not found");
      return;
    }

    const user = users[0];

    const { error: insertError } = await supabase.from("messages").insert({
      to_user_id: user.id,
      body: message,
    });

    if (insertError) {
      alert("Failed to send message: " + insertError.message);
      return;
    }

    setMessage("");
    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Send a message to @{slug}
        </h1>

        {sent ? (
          <div className="text-green-600 text-center">
            ✅ Message sent anonymously!
          </div>
        ) : (
          <>
            <textarea
              className="w-full border p-3 rounded-md mb-4 h-32"
              placeholder="Type something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="w-full bg-black text-white py-2 rounded-md"
              onClick={handleSend}
            >
              Send Message
            </button>
          </>
        )}
      </div>
    </main>
  );
}
