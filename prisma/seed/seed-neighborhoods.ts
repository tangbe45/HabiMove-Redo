import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function seedNeighborhoods(subdivisionName: string) {
  const subdivision = await prisma.subdivision.findFirst({
    where: { name: subdivisionName },
  });
  if (!subdivision) {
    console.error(`❌ Subdivision "${subdivisionName}" not found.`);
    process.exit(1);
  }

  const filePath = path.join(
    __dirname,
    "neighborhoods",
    `${subdivisionName.toLowerCase()}.json`
  );
  const neighborhoods = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const n of neighborhoods) {
    // find existing neighborhood by name and subdivision
    const existing = await prisma.neighborhood.findFirst({
      where: { name: n.name, subdivisionId: subdivision.id },
    });

    if (existing) {
      // update by unique id
      await prisma.neighborhood.update({
        where: { id: existing.id },
        data: {
          name: n.name,
          subdivisionId: subdivision.id,
        },
      });
    } else {
      // create new record
      await prisma.neighborhood.create({
        data: {
          name: n.name,
          subdivisionId: subdivision.id,
        },
      });
    }
  }

  console.log(`✅ Neighborhoods for ${subdivisionName} seeded successfully!`);
}

const subdivisionName = process.argv[2];
if (!subdivisionName) {
  console.error(
    "❌ Please provide a subdivision name: ts-node seed-neighborhoods.ts 'Yaoundé I'"
  );
  process.exit(1);
}

seedNeighborhoods(subdivisionName)
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
