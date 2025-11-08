import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "houses", "houses.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`Seeding ${data.length} properties...`);

  for (const property of data) {
    await prisma.property.upsert({
      where: { id: property.id },
      update: {},
      create: {
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        forRent: property.forRent,
        forSale: property.forSale,
      },
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
