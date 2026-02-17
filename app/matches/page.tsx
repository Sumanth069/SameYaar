"use client";

import { useEffect, useState } from "react";
import { users } from "../../data/users";
import { prompts } from "../../data/prompts";

type Match = {
  id: number;
  name: string;
  age: number;
  college: string;
  score: number;
  reasons: string[];
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sameyaar_answers");
    if (!saved) return;

    const parsed = JSON.parse(saved);

    // ✅ Normalize prompt IDs to numbers
    const myHates: number[] = parsed
      .filter((a: any) => a.response === "hate")
      .map((a: any) => Number(a.promptId));

    const computedMatches: Match[] = users
      .map(user => {
        // ✅ Compare numbers with numbers
        const commonIds = user.hates.filter(id =>
          myHates.includes(Number(id))
        );

        const reasons = commonIds
          .map(id => {
            const prompt = prompts.find(p => p.id === id);
            return prompt?.text;
          })
          .filter(Boolean) as string[];

        return {
          id: user.id,
          name: user.name,
          age: user.age,
          college: user.college,
          score: commonIds.length,
          reasons,
        };
      })
      // ✅ Remove users with no overlap
      .filter(match => match.score > 0)
      // ✅ Best matches first
      .sort((a, b) => b.score - a.score);

    setMatches(computedMatches);
  }, []);

  return (
    <main className="min-h-screen px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your SameYaar Matches 👀
      </h1>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500">
          No strong matches yet 😕
        </p>
      ) : (
        <div className="grid gap-6 max-w-xl mx-auto">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </main>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div className="relative border rounded-lg p-4 bg-white shadow">
      {/* 🔒 Blur overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <button
          onClick={() => alert("Login to connect 👀")}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Login to Reveal
        </button>
      </div>

      <h2 className="text-xl font-semibold">
        {match.name}, {match.age}
      </h2>

      <p className="text-gray-500 mb-2">{match.college}</p>

      <p className="text-sm font-medium mb-2">
        Match score: {match.score}
      </p>

      <ul className="text-sm text-gray-700 list-disc ml-5">
        {match.reasons.map((reason, index) => (
          <li key={index}>
            You both hate {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
