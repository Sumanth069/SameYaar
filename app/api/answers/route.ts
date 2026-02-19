import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const names = ["Rahul", "Ananya", "Sneha", "Karthik", "Aman", "Priya"];
const courses = ["Engineering", "BCA", "BSc", "MBA"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers } = body;

    // ✅ Create a temp user WITH required fields
    const user = await prisma.user.create({
      data: {
        name: names[Math.floor(Math.random() * names.length)],
        age: 18 + Math.floor(Math.random() * 6),
        course: courses[Math.floor(Math.random() * courses.length)],
      },
    });

    // ✅ Save answers for that user
    await prisma.answer.createMany({
      data: answers.map((a: any) => ({
        promptId: Number(a.promptId),
        response: a.response,
        userId: user.id,
      })),
    });

    return NextResponse.json({
  success: true,
  userId: user.id,
});
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
