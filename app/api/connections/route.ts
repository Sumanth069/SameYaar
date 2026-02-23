import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json([], { status: 401 });
    }

    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!me) return NextResponse.json([]);

    // Likes I sent
    const sentLikes = await prisma.like.findMany({
      where: { fromUserId: me.id },
      select: { toUserId: true },
    });

    const sentIds = sentLikes.map(l => l.toUserId);

    if (sentIds.length === 0) {
      return NextResponse.json([]);
    }

    // Likes they sent back (mutual)
    const mutualLikes = await prisma.like.findMany({
      where: {
        fromUserId: { in: sentIds },
        toUserId: me.id,
      },
      select: { fromUserId: true },
    });

    const connectionIds = mutualLikes.map(l => l.fromUserId);

    if (connectionIds.length === 0) {
      return NextResponse.json([]);
    }

    // Final connected users
    const connections = await prisma.user.findMany({
      where: { id: { in: connectionIds } },
      select: {
        id: true,
        name: true,
        age: true,
        course: true,
      },
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error("Connections error:", error);
    return NextResponse.json([], { status: 500 });
  }
}