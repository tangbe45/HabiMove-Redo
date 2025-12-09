// app/api/houses/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  houseCreateSchema,
  houseFilterSchema,
  initializeHouseFilter,
} from "@/lib/validation/zod-schemas";
import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/data/db";
import { buildHouseWhere } from "@/lib/query-builders/house-query";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(100, Number(params.limit || 12));
  const skip = (page - 1) * limit;

  const where = buildHouseWhere(params);

  const [houses, total] = await Promise.all([
    db.house.findMany({
      where,
      include: { images: true },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    }),
    db.house.count({ where }),
  ]);

  return new Response(
    JSON.stringify({
      houses,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    // convert form fields to plain object
    const fields: Record<string, string> = {};
    for (const [key, value] of fd.entries()) {
      // skip file entries; we'll collect them separately
      if (value instanceof File) continue;
      fields[key] = String(value ?? "");
    }

    // collect image Files
    const imageFiles: File[] = [];
    for (const entry of fd.getAll("imageFiles")) {
      if (entry instanceof File) imageFiles.push(entry);
    }

    // Validate fields with Zod (coercions will convert strings -> numbers/booleans)
    const parsed = houseCreateSchema.parse(fields);

    // save files to /public/uploads (ensure folder exists)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    const imageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // generate unique filename
      const timestamp = Date.now();
      const safeName = file.name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
      const filename = `${timestamp}-${i}-${safeName}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, buffer);

      const host = process.env.LOCAL_HOST;
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http"; // Adjust based on your environment
      const fullUrl = `${protocol}://${host}/uploads/${filename}`;

      // public URL
      // imageUrls.push(`/uploads/${filename}`);
      imageUrls.push(fullUrl);
    }

    // save to DB (example using Prisma — adjust model fields)
    const created = await db.house.create({
      data: {
        title: parsed.title,
        description: parsed.description || null,
        price: parsed.price,
        location: parsed.location,
        bedrooms: parsed.bedrooms,
        bathrooms: parsed.bathrooms,
        hasInternalToilet: parsed.hasInternalToilet ?? false,
        hasParking: parsed.hasParking ?? false,
        hasWell: parsed.hasWell ?? false,
        hasFence: parsed.hasFence ?? false,
        hasBalcony: parsed.hasBalcony ?? false,
        purpose: parsed.purpose,
        houseType: { connect: { id: parsed.houseTypeId } },
        region: { connect: { id: parsed.regionId } },
        division: { connect: { id: parsed.divisionId } },
        subdivision: { connect: { id: parsed.subdivisionId } },
        neighborhood: { connect: { id: parsed.neighborhoodId } },
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ id: created.id, images: created.images });
  } catch (err: any) {
    console.error("Add house error:", err);
    const message = err?.message || "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const houseType = searchParams.get("houseType");
//     const minPrice = searchParams.get("minPrice");
//     const maxPrice = searchParams.get("maxPrice");
//     const bedrooms = searchParams.get("bedrooms");
//     const bathrooms = searchParams.get("bathrooms");
//     const hasInternalToilet = searchParams.get("hasInternalToilet");
//     const hasWell = searchParams.get("hasWell");
//     const hasParking = searchParams.get("hasParking");
//     const hasFence = searchParams.get("hasFence");
//     const hasBalcony = searchParams.get("hasBalcony");
//     const region = searchParams.get("region");
//     const division = searchParams.get("division");
//     const subdivision = searchParams.get("subdivision");
//     const neighborhood = searchParams.get("neighborhood");
//     const page = searchParams.get("page");
//     const size = searchParams.get("size");

//     let where: Prisma.HouseWhereInput = {
//       ...(houseType && {
//         houseTypeId: { equals: houseType, mode: "insensitive" },
//       }),
//       ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
//       ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
//       ...(bedrooms && { bedrooms: { equals: parseInt(bedrooms) } }),
//       ...(bathrooms && { bathrooms: { equals: parseInt(bathrooms) } }),
//       ...(hasInternalToilet !== null && {
//         hasInternalToilet: Boolean(hasInternalToilet),
//       }),
//       ...(hasWell !== null && { hasWell: Boolean(hasWell) }),
//       ...(hasParking !== null && { hasParking: Boolean(hasParking) }),
//       ...(hasFence !== null && { hasFence: Boolean(hasFence) }),
//       ...(hasBalcony !== null && { hasBalcony: Boolean(hasBalcony) }),
//       ...(region && { regionId: region }),
//       ...(division && { divisionId: division }),
//       ...(subdivision && { subdivisionId: subdivision }),
//       ...(neighborhood && { neighborhoodId: neighborhood }),
//     };

//     const currentPage = Number(page) ?? 1;
//     const pageSize = Number(size) ?? 21;

//     const [count, houses] = await Promise.all([
//       db.house.count({ where: where }),
//       db.house.findMany({
//         where: where,
//         include: { images: true },
//         orderBy: {
//           createdAt: "desc",
//         },
//         skip: (currentPage - 1) * pageSize,
//         take: pageSize,
//       }),
//     ]);

//     let totalPages = Math.ceil(count / pageSize);

//     return NextResponse.json({ houses, totalPages });
//   } catch (err) {
//     console.error("Get houses error:", err);
//     const message = (err instanceof Error && err?.message) || "Server error";
//     return NextResponse.json({ message }, { status: 500 });
//   }
// }
