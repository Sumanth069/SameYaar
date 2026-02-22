"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

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

  // Motion values for swipe
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatches(data);
      } catch (e) {
        console.error("Failed to fetch matches", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const current = matches[index];

  const nextCard = () => {
    setIndex((prev) => (prev < matches.length ? prev + 1 : prev));
  };

  const handleLike = () => {
    console.log("❤️ Liked:", current?.id);
    nextCard();
  };

  const handleSkip = () => {
    console.log("⏭️ Skipped:", current?.id);
    nextCard();
  };

  // Loading UI
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Finding your SameYaars… 💖</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 overflow-hidden">
      <AnimatePresence>
        {current ? (
          <motion.div
            key={current.id}
            style={{ x, rotate }}
            className="w-[420px] bg-white rounded-3xl shadow-2xl p-8 text-center absolute"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.x > 120) {
                handleLike();
              } else if (info.offset.x < -120) {
                handleSkip();
              }
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: Math.random() > 0.5 ? 500 : -500,
              opacity: 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Avatar */}
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {current.name?.[0]}
            </div>

            {/* Info */}
            <h2 className="text-2xl font-bold">{current.name}</h2>
            <p className="text-gray-500 mb-2">
              {current.age} • {current.course}
            </p>

            {/* Score */}
            <div className="text-pink-500 text-5xl font-bold mb-4">
              {current.score}
            </div>

            <p className="text-gray-600 mb-6">
              Shared hates compatibility score
            </p>

            {/* Buttons */}
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

            {/* Footer */}
            <p className="text-sm text-gray-400 mt-6">
              {index + 1} / {matches.length}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Drag right to like • left to skip
            </p>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-lg"
          >
            No more matches 👀
          </motion.p>
        )}
      </AnimatePresence>
    </main>
  );
}