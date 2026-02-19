import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Fetch all prompt IDs
  const prompts = await prisma.prompt.findMany();

  // Shuffle prompts
  const shuffled = prompts.sort(() => 0.5 - Math.random());

  // Pick first 5
  const selected = shuffled.slice(0, 5);

  return NextResponse.json(selected);
}
