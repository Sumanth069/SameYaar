import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const currentUserId = Number(req.headers.get("x-user-id")) || 1;

    // Users current user already liked
    const likesSent = await prisma.like.findMany({
      where: { fromUserId: currentUserId },
      select: { toUserId: true },
    });

    const likedIds = likesSent.map(l => l.toUserId);

    // Fetch swipe candidates
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
          notIn: likedIds,
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        course: true,
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error("SWIPE API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch swipe users" },
      { status: 500 }
    );
  }
}