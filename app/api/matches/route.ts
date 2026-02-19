import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1️⃣ Get latest user (current session simulation)
    const currentUser = await prisma.user.findFirst({
      orderBy: { id: "desc" },
    });

    if (!currentUser) {
      return NextResponse.json([]);
    }

    // 2️⃣ Get current user's answers
    const myAnswers = await prisma.answer.findMany({
      where: { userId: currentUser.id },
    });

    if (myAnswers.length === 0) {
      return NextResponse.json([]);
    }

    // Map: promptId -> response
    const myAnswerMap = new Map<number, string>();
    myAnswers.forEach((a) => {
      myAnswerMap.set(a.promptId, a.response);
    });

    // 3️⃣ Get all other users' answers
    const otherAnswers = await prisma.answer.findMany({
      where: {
        userId: { not: currentUser.id },
      },
      include: {
        user: true,
      },
    });

    // 4️⃣ Group answers by userId
    const grouped: Record<number, typeof otherAnswers> = {};

    for (const ans of otherAnswers) {
      if (!grouped[ans.userId]) {
        grouped[ans.userId] = [];
      }
      grouped[ans.userId].push(ans);
    }

    // 5️⃣ Calculate matches
    const matches = Object.entries(grouped)
      .map(([userId, answers]) => {
        let score = 0;

        for (const ans of answers) {
          const myResponse = myAnswerMap.get(ans.promptId);

          // 🔥 Core matching logic
          if (myResponse === "hate" && ans.response === "hate") {
            score++;
          }
        }

        if (score === 0) return null;

        const user = answers[0].user;

        return {
          id: user.id,
          name: user.name,
          age: user.age,
          course: user.course,
          score,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json(matches);
  } catch (error) {
    console.error("MATCH ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
