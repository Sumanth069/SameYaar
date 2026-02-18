import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all answers grouped by promptId
    const answers = await prisma.answer.findMany({
      where: {
        response: "hate",
      },
      select: {
        promptId: true,
        userId: true,
      },
    });

    // Group hates by prompt
    const promptMap = new Map<number, number[]>();

    answers.forEach((a) => {
      if (!promptMap.has(a.promptId)) {
        promptMap.set(a.promptId, []);
      }
      if (a.userId !== null) {
        promptMap.get(a.promptId)!.push(a.userId);
      }
    });

    // Count shared hates between users
    const matchScores = new Map<string, number>();

    promptMap.forEach((users) => {
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const key =
            users[i] < users[j]
              ? `${users[i]}-${users[j]}`
              : `${users[j]}-${users[i]}`;

          matchScores.set(key, (matchScores.get(key) || 0) + 1);
        }
      }
    });

    // Convert to response format
    const matches = Array.from(matchScores.entries()).map(
      ([key, score]) => {
        const [userA, userB] = key.split("-");
        return {
          userA: Number(userA),
          userB: Number(userB),
          score,
        };
      }
    );

    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to compute matches" },
      { status: 500 }
    );
  }
}
