"use client";

import { useEffect, useState } from "react";

type Match = {
  userA: number;
  userB: number;
  score: number;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const userId = localStorage.getItem("sameyaar_user_id");
  if (!userId) return;

  fetch(`/api/matches?userId=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      setMatches(data);
      setLoading(false);
    });
}, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Finding your SameYaar…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-10">
      {/* Header */}
      <div className="max-w-xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your SameYaars 💖
        </h1>
        <p className="text-gray-500 mt-2">
          People who hate the same things as you.
        </p>
      </div>

      {/* Empty state */}
      {matches.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No matches yet. Try answering again.
        </div>
      )}

      {/* Cards */}
      <div className="max-w-xl mx-auto space-y-6">
        {matches.map((match, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="p-6">
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-lg font-medium">
                    SY
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      SameYaar #{match.userB}
                    </p>
                    <p className="text-sm text-gray-500">
                      {match.score} shared dislikes
                    </p>
                  </div>
                </div>

                {/* Match badge */}
                <div className="text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  🔥 Strong match
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                You both strongly dislike the same things.  
                Sometimes, shared frustration is the best icebreaker.
              </p>

              {/* CTA */}
              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition">
                Say Hi 👋
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
