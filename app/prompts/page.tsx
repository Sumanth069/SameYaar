"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { prompts } from "../../data/prompts";

export default function PromptsPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { promptId: number; response: string }[]
  >([]);

  const handleAnswer = (response: string) => {
    const currentPrompt = prompts[currentIndex];

    setAnswers([
      ...answers,
      {
        promptId: currentPrompt.id,
        response: response,
      },
    ]);

    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      localStorage.setItem("sameyaar_answers", JSON.stringify(answers));
      router.push("/result");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-sm text-gray-500 mb-2">
        {currentIndex + 1} / {prompts.length}
      </h2>

      <h1 className="text-2xl md:text-4xl font-semibold mb-8">
        {prompts[currentIndex].text}
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => handleAnswer("hate")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Hate 😤
        </button>

        <button
          onClick={() => handleAnswer("meh")}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          Meh 😐
        </button>

        <button
          onClick={() => handleAnswer("love")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Love 😄
        </button>
      </div>
    </main>
  );
}
