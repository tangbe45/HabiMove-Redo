import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "houses", "houses.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`Seeding ${data.length} properties...`);

  for (const property of data) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
