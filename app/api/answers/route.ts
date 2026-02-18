import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("🔥 /api/answers HIT");

  try {
    const body = await req.json();
    const { answers } = body;

    // ✅ Create a temp user (until login exists)
    const user = await prisma.user.create({
      data: {},
    });

    console.log("👤 tempUserId:", user.id);

    const result = await prisma.answer.createMany({
      data: answers.map((a: any) => ({
        promptId: Number(a.promptId),
        response: a.response,
        userId: user.id,
      })),
    });

    console.log("✅ Insert result:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
