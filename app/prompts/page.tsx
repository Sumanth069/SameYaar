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

  const handleAnswer = async (
    response: "hate" | "meh" | "love"
  ) => {
    const currentPrompt = prompts[currentIndex];

    const updatedAnswers: Answer[] = [
      ...answers,
      {
        promptId: currentPrompt.id,
        response: response,
      },
    ];

    setAnswers(updatedAnswers);

    // If more prompts exist → move forward
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        // ✅ Save locally (fallback)
        localStorage.setItem(
          "sameyaar_answers",
          JSON.stringify(updatedAnswers)
        );

        // ✅ Send to backend
        await fetch("/api/answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: updatedAnswers }),
        });

        // Move to result page
        router.push("/result");
      } catch (error) {
        console.error("Failed to save answers:", error);

        // Still move to result page
        router.push("/result");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Progress */}
      <p className="text-sm text-gray-500 mb-2">
        {currentIndex + 1} / {prompts.length}
      </p>

      {/* Prompt */}
      <h1 className="text-2xl md:text-4xl font-semibold mb-8">
        {prompts[currentIndex].text}
      </h1>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleAnswer("hate")}
          className="bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Hate 😤
        </button>

        <button
          onClick={() => handleAnswer("meh")}
          className="bg-gray-400 text-white px-5 py-2 rounded-lg"
        >
          Meh 😐
        </button>

        <button
          onClick={() => handleAnswer("love")}
          className="bg-green-500 text-white px-5 py-2 rounded-lg"
        >
          Love 😄
        </button>
      </div>
    </main>
  );
}
