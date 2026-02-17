"use client";

import { useEffect, useState } from "react";
import { prompts } from "../../data/prompts";

export default function ResultPage() {
  const [topHates, setTopHates] = useState<string[]>([]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("sameyaar_answers");
    if (!savedAnswers) return;

    const parsed = JSON.parse(savedAnswers);

    const hated = parsed
      .filter((item: any) => item.response === "hate")
      .map((item: any) => {
        const prompt = prompts.find(p => p.id === item.promptId);
        return prompt?.text;
      })
      .filter(Boolean)
      .slice(0, 3); // 👈 TOP 3 ONLY

    setTopHates(hated);
  }, []);

  const personalityText =
    topHates.length >= 3
      ? "You have zero tolerance for nonsense 😤"
      : topHates.length === 2
      ? "You dislike chaos, but selectively 😐"
      : topHates.length === 1
      ? "You’re chill… mostly 😄"
      : "You’re way too tolerant 😇";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Your Top Annoyances
      </h1>

      <p className="text-gray-600 mb-6">{personalityText}</p>

      {topHates.length === 0 ? (
        <p>You didn’t hate anything 😄</p>
      ) : (
        <ul className="space-y-3 mb-8 w-full max-w-xl">
          {topHates.map((text, index) => (
            <li
              key={index}
              className="bg-gray-100 px-4 py-3 rounded-lg"
            >
              {text}
            </li>
          ))}
        </ul>
      )}

      <ShareSection topHates={topHates} />
    </main>
  );
}

function ShareSection({ topHates }: { topHates: string[] }) {
  const shareText = `Turns out I’m not the only one 😤

My top annoyances:
${topHates.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Find your SameYaar 👀`;

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareText);
    alert("Copied! Share it anywhere 😄");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleShare}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Share Results
      </button>

      <a href="/prompts">
        <button className="border px-6 py-3 rounded-lg">
          Find your SameYaar
        </button>
      </a>
    </div>
  );
}
