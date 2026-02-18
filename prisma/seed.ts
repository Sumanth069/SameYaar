import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.prompt.createMany({
    data: [
      { id: 1, text: "When relatives ask about your marks in front of everyone" },
      { id: 2, text: "Slow internet during an important upload" },
      { id: 3, text: "Group projects where only you work" },
      { id: 4, text: "People who say 'let's plan' but never show up" },
      { id: 5, text: "Getting added to random college WhatsApp groups" },
    ],
  });

  console.log("Inserted count:", result.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
