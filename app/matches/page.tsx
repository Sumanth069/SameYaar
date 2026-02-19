"use client";

import { useEffect, useState } from "react";

type Match = {
  id: number;
  name: string;
  age: number;
  course: string;
  score: number;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // 🔹 Current profile
  const current = matches[index];

  // 🔹 Actions
  const handleSkip = () => {
    if (index < matches.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const handleLike = () => {
    if (index < matches.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  // 🔹 Loading UI
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Finding your SameYaars… 💖</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">

      <h1 className="text-4xl font-bold mb-2">
        Your SameYaars 💖
      </h1>
      <p className="text-gray-500 mb-10">
        People who hate the same things as you
      </p>

      {/* ✅ CARD GOES EXACTLY HERE */}
      {current ? (
        <div className="w-[420px] bg-white rounded-3xl shadow-2xl p-8 text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
            {current.name?.[0]}
          </div>

          <h2 className="text-2xl font-bold">{current.name}</h2>

          <p className="text-gray-500 mb-2">
            {current.age} • {current.course}
          </p>

          <div className="text-pink-500 text-5xl font-bold mb-4">
            {current.score}
          </div>

          <p className="text-gray-600 mb-6">
            Shared hates compatibility score
          </p>

          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              ⬅ Skip
            </button>

            <button
              onClick={handleLike}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:scale-105 transition"
            >
              ❤️ Like
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            {index + 1} / {matches.length}
          </p>

        </div>
      ) : (
        <p className="text-gray-500 mt-20">
          No more matches 👀
        </p>
      )}
    </main>
  );
}
