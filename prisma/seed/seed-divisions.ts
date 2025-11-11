import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function seedDivisions(regionName: string) {
  const region = await prisma.region.findUnique({
    where: { name: regionName },
  });
  if (!region) {
    console.error(`❌ Region "${regionName}" not found.`);
    process.exit(1);
  }

  const filePath = path.join(
    __dirname,
    "divisions",
    `${regionName.toLowerCase()}.json`
  );
  const divisions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const d of divisions) {
    // check if a division with this name already exists in this region
    const existing = await prisma.division.findFirst({
      where: { name: d.name, regionId: region.id },
    });

    if (!existing) {
      await prisma.division.create({
        data: {
          name: d.name,
          regionId: region.id,
        },
      });
    } else if (existing.regionId !== region.id) {
      // ensure the division is associated with the correct region
      await prisma.division.update({
        where: { id: existing.id },
        data: { regionId: region.id },
      });
    }
  }

  console.log(`✅ Divisions for ${regionName} seeded successfully!`);
}

const regionName = process.argv[2]; // e.g. Centre
if (!regionName) {
  console.error(
    "❌ Please provide a region name: ts-node seed-divisions.ts Centre"
  );
  process.exit(1);
}

seedDivisions(regionName)
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
