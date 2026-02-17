"use client";

import { useEffect, useState } from "react";
import { users } from "../../data/users";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sameyaar_answers");
    if (!saved) return;

    const parsed = JSON.parse(saved);

    const userHates = parsed
      .filter((a: any) => a.response === "hate")
      .map((a: any) => a.promptId);

    // TEMP mapping: promptId → text
    const hateTexts = JSON.parse(saved)
      .filter((a: any) => a.response === "hate")
      .map((a: any) => a.promptId);

    // Fake match logic
    const matched = users.map(user => {
      const common = user.hates.length;
      return { ...user, common };
    });

    setMatches(matched);
  }, []);

  return (
    <main className="min-h-screen px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        People who might be your SameYaar 👀
      </h1>

      <div className="grid gap-6 max-w-xl mx-auto">
        {matches.map(user => (
          <MatchCard key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}

function MatchCard({ user }: any) {
  return (
    <div className="relative border rounded-lg p-4 bg-white shadow">
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <button
          onClick={() => alert("Login to connect 👀")}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Login to Reveal
        </button>
      </div>

      <h2 className="text-xl font-semibold">
        {user.name}, {user.age}
      </h2>

      <p className="text-gray-500 mb-2">{user.college}</p>

      <p className="text-sm text-gray-700">
        You both hate <strong>{user.hates[0]}</strong>
      </p>
    </div>
  );
}
