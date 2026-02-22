import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Like API is alive",
  })
}

export async function POST(req: Request) {
  try {
    const { toUserId } = await req.json()

    // 🔴 TEMP DEV USER (will be replaced with auth)
    const fromUserId = 1

    if (!toUserId) {
      return NextResponse.json(
        { error: "toUserId is required" },
        { status: 400 }
      )
    }

    // 1️⃣ Prevent duplicate likes
    const existingLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: "Already liked" },
        { status: 409 }
      )
    }

    // 2️⃣ Store the like
    await prisma.like.create({
      data: {
        fromUserId,
        toUserId,
      },
    })

    // 3️⃣ Check mutual like
    const mutualLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      },
    })

    return NextResponse.json({
      matched: Boolean(mutualLike),
    })
  } catch (error) {
    console.error("LIKE API ERROR:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}