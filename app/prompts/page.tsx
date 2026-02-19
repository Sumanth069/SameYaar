"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Prompt = {
  id: number;
  text: string;
};

type Answer = {
  promptId: number;
  response: "hate" | "meh" | "love";
};

export default function PromptsPage() {
  const router = useRouter();

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch random prompts from backend
  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load prompts");
        setLoading(false);
      });
  }, []);

  // ⏳ Loading UI (IMPORTANT)
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading prompts…</p>
      </main>
    );
  }

  const handleAnswer = async (response: "hate" | "meh" | "love") => {
    const updatedAnswers = [
      ...answers,
      {
        promptId: prompts[currentIndex].id,
        response,
      },
    ];

    setAnswers(updatedAnswers);

    // Move to next prompt
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // Last prompt → submit
    const res = await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: updatedAnswers }),
    });

    const data = await res.json();
    localStorage.setItem("sameyaar_user_id", data.userId);

    router.push("/matches");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="card max-w-md w-full text-center">
        {/* Progress */}
        <p className="text-sm text-gray-400 mb-4">
          {currentIndex + 1} of {prompts.length}
        </p>

        {/* Prompt */}
        <h2 className="text-2xl font-semibold mb-10">
          {prompts[currentIndex].text}
        </h2>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleAnswer("hate")}
            className="bg-red-400 hover:bg-red-500 text-white py-3 rounded-full font-semibold transition"
          >
            😤 Hate It
          </button>

          <button
            onClick={() => handleAnswer("meh")}
            className="bg-gray-200 hover:bg-gray-300 py-3 rounded-full font-semibold transition"
          >
            😐 Meh
          </button>

          <button
            onClick={() => handleAnswer("love")}
            className="bg-green-400 hover:bg-green-500 text-white py-3 rounded-full font-semibold transition"
          >
            😄 Love It
          </button>
        </div>
      </div>
    </main>
  );
}
