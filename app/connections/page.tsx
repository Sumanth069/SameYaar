"use client";

import { useEffect, useState } from "react";

type MatchUser = {
  id: number;
  name: string;
  age: number;
  course: string;
};

export default function ConnectionsPage() {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Failed to load matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your connections…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        💖 Your Connections
      </h1>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500">
          No matches yet. Keep swiping 👀
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
          {matches.map(user => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow p-6 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {user.name[0]}
              </div>

              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">
                {user.age} • {user.course}
              </p>

              <button
                disabled
                className="mt-4 px-5 py-2 rounded-full bg-gray-300 text-gray-600 cursor-not-allowed"
              >
                Chat coming soon 💬
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}