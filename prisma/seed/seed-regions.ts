import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const regionsPath = path.join(__dirname, "regions", "regions.json");
  const regions = JSON.parse(fs.readFileSync(regionsPath, "utf-8"));

  for (const r of regions) {
    await prisma.region.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name },
    });
  }

  console.log("✅ All regions seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
