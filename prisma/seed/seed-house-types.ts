import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const houseTypesPath = path.join(__dirname, "house-types", "types.json");
  const types = JSON.parse(fs.readFileSync(houseTypesPath, "utf-8"));

  for (const r of types) {
    await prisma.houseType.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name, description: r.description },
    });
  }

  console.log("✅ All regions seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
