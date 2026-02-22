import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 🟣 Day 15: current user from header
    const currentUserId = Number(req.headers.get("x-user-id")) || 1;

    const likesSent = await prisma.like.findMany({
      where: { fromUserId: currentUserId },
      select: { toUserId: true },
    });

    const likedUserIds = likesSent.map(like => like.toUserId);

    if (likedUserIds.length === 0) {
      return NextResponse.json([]);
    }

    const mutualLikes = await prisma.like.findMany({
      where: {
        fromUserId: { in: likedUserIds },
        toUserId: currentUserId,
      },
      select: { fromUserId: true },
    });

    const mutualUserIds = mutualLikes.map(like => like.fromUserId);

    if (mutualUserIds.length === 0) {
      return NextResponse.json([]);
    }

    const matchedUsers = await prisma.user.findMany({
      where: { id: { in: mutualUserIds } },
      select: {
        id: true,
        name: true,
        age: true,
        course: true,
      },
    });

    return NextResponse.json(matchedUsers);
  } catch (error) {
    console.error("MATCHES API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}