import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const currentUserId = 1; // TEMP DEV USER

    // Find users current user liked
    const likesSent = await prisma.like.findMany({
      where: { fromUserId: currentUserId },
      select: { toUserId: true },
    });

    const likedUserIds = likesSent.map(like => like.toUserId);

    if (likedUserIds.length === 0) {
      return NextResponse.json([]);
    }

    // Find mutual likes
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

    // Fetch matched users
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