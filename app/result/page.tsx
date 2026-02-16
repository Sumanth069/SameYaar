"use client";

import { useEffect, useState } from "react";
import { prompts } from "../../data/prompts";

export default function ResultPage() {
  const [hatedPrompts, setHatedPrompts] = useState<string[]>([]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("sameyaar_answers");

    if (!savedAnswers) return;

    const parsed = JSON.parse(savedAnswers);

    const hated = parsed
      .filter((item: any) => item.response === "hate")
      .map((item: any) => {
        const prompt = prompts.find(p => p.id === item.promptId);
        return prompt?.text;
      });

    setHatedPrompts(hated);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">
        Your Top Annoyances 😤
      </h1>

      {hatedPrompts.length === 0 ? (
        <p>You didn’t hate anything 😄</p>
      ) : (
        <ul className="space-y-3">
          {hatedPrompts.map((text, index) => (
            <li
              key={index}
              className="bg-gray-100 px-4 py-3 rounded-lg"
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
