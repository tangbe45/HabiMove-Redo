import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function seedSubdivisions(divisionName: string) {
  const division = await prisma.division.findFirst({
    where: { name: divisionName },
  });
  if (!division) {
    console.error(`❌ Division "${divisionName}" not found.`);
    process.exit(1);
  }

  const filePath = path.join(
    __dirname,
    "subdivisions",
    `${divisionName.toLowerCase()}.json`
  );
  const subdivisions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const s of subdivisions) {
    const existing = await prisma.subdivision.findFirst({
      where: { name: s.name },
    });
    if (existing) {
      await prisma.subdivision.update({
        where: { id: existing.id },
        data: {
          name: s.name,
          divisionId: division.id,
        },
      });
    } else {
      await prisma.subdivision.create({
        data: {
          name: s.name,
          divisionId: division.id,
        },
      });
    }
  }

  console.log(`✅ Subdivisions for ${divisionName} seeded successfully!`);
}

const divisionName = process.argv[2];
if (!divisionName) {
  console.error(
    "❌ Please provide a division name: ts-node seed-subdivisions.ts Mfoundi"
  );
  process.exit(1);
}

seedSubdivisions(divisionName)
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
