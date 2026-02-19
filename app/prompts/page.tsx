"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { prompts } from "../../data/prompts";

type Answer = {
  promptId: number;
  response: "hate" | "meh" | "love";
};

export default function PromptsPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = async (response: "hate" | "meh" | "love") => {
    const currentPrompt = prompts[currentIndex];

    const updatedAnswers: Answer[] = [
      ...answers,
      {
        promptId: currentPrompt.id,
        response,
      },
    ];

    setAnswers(updatedAnswers);

    // If more prompts remain → go to next
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // Last prompt → submit answers
    try {
      setLoading(true);

      const res = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });

      const data = await res.json();

      // 🔑 Save current userId (Day 11)
      if (data.userId) {
        localStorage.setItem("sameyaar_user_id", String(data.userId));
      }

      router.push("/matches");
    } catch (err) {
      console.error("Failed to submit answers", err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-neutral-50">
      {/* Progress */}
      <p className="text-sm text-gray-400 mb-4">
        {currentIndex + 1} / {prompts.length}
      </p>

      {/* Prompt */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-10 text-gray-900 max-w-xl">
        {prompts[currentIndex].text}
      </h1>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          disabled={loading}
          onClick={() => handleAnswer("hate")}
          className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
        >
          Hate 😤
        </button>

        <button
          disabled={loading}
          onClick={() => handleAnswer("meh")}
          className="px-6 py-3 rounded-xl bg-gray-400 text-white font-medium hover:bg-gray-500 transition disabled:opacity-50"
        >
          Meh 😐
        </button>

        <button
          disabled={loading}
          onClick={() => handleAnswer("love")}
          className="px-6 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition disabled:opacity-50"
        >
          Love 😄
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-gray-500">
          Finding your SameYaars…
        </p>
      )}
    </main>
  );
}
