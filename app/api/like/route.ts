import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { toUserId } = await req.json();

    // 🟣 Day 15: get user from header (fallback to 1)
    const fromUserId = Number(req.headers.get("x-user-id")) || 1;

    if (!toUserId) {
      return NextResponse.json(
        { error: "toUserId is required" },
        { status: 400 }
      );
    }

    // Prevent duplicate like
    const existingLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Already liked" },
        { status: 409 }
      );
    }

    // Create like
    await prisma.like.create({
      data: {
        fromUserId,
        toUserId,
      },
    });

    // Mutual check
    const mutualLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      },
    });

    return NextResponse.json({
      matched: Boolean(mutualLike),
    });
  } catch (error) {
    console.error("LIKE API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}