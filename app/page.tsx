"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="card max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">
          SameYaar 💜
        </h1>

        <p className="text-gray-600 mb-8">
          Match with people who hate the same things as you.
          Because bonding over slow internet is real.
        </p>

        <button
          onClick={() => router.push("/prompts")}
          className="btn-primary w-full"
        >
          Find My Yaars 🚀
        </button>
      </div>
    </main>
  );
}
