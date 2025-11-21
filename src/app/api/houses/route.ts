// app/api/houses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db"; // adjust to your prisma client instance

// server-side schema - mirrors client's but uses coercions strictly
const addHouseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  location: z.string(),
  bedrooms: z.coerce.number().nonnegative(),
  bathrooms: z.coerce.number().nonnegative(),
  hasInternalToilet: z.coerce.boolean().optional().nullable(),
  hasParking: z.coerce.boolean().optional().nullable(),
  hasWell: z.coerce.boolean().optional().nullable(),
  purpose: z.enum(["FOR_RENT", "FOR_SALE"]),
  houseTypeId: z.string().cuid(),
  regionId: z.string().cuid(),
  divisionId: z.string().cuid(),
  subdivisionId: z.string().cuid(),
  neighborhoodId: z.string().cuid(),
});

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
    const parsed = addHouseSchema.parse(fields);

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
    const created = await db.property.create({
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
