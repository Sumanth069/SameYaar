import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  if (!userId) return NextResponse.json([]);

  const answers = await prisma.answer.findMany();

  const map = new Map<string, number>();

  for (let i = 0; i < answers.length; i++) {
    for (let j = i + 1; j < answers.length; j++) {
      if (
        answers[i].promptId === answers[j].promptId &&
        answers[i].userId !== answers[j].userId
      ) {
        let weight = 0;

        if (
          answers[i].response === "hate" &&
          answers[j].response === "hate"
        ) weight = 2;

        else if (
          answers[i].response === "meh" &&
          answers[j].response === "meh"
        ) weight = 1;

        if (weight > 0) {
          const a = answers[i].userId;
          const b = answers[j].userId;

          if (a === userId || b === userId) {
            const key = [a, b].sort().join("-");
            map.set(key, (map.get(key) || 0) + weight);
          }
        }
      }
    }
  }

  const matches = Array.from(map.entries()).map(([key, score]) => {
    const [userA, userB] = key.split("-").map(Number);
    return { userA, userB, score };
  });

  return NextResponse.json(matches);
}
