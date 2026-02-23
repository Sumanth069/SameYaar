"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const handleSubmit = async () => {
    if (!age || !course) return;

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: Number(age), course }),
    });

    if (res.ok) {
      router.push("/prompts");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px]">
        <h1 className="text-2xl font-bold mb-4">Complete your profile</h1>

        <input
          type="number"
          placeholder="Your age"
          className="w-full border p-3 rounded mb-4"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Your course"
          className="w-full border p-3 rounded mb-6"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 text-white py-3 rounded-lg"
        >
          Continue
        </button>
      </div>
    </main>
  );
}