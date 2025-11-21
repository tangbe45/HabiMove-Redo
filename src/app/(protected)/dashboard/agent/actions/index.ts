"use server";

import { PropertyPurpose } from "@/generated/prisma";
import { db } from "@/lib/db";
import { propertyCreateSchema } from "@/lib/db/types/property.types";
//import { getCurrentUser } from "@/lib/auth"; // implement based on your NextAuth
import { z } from "zod";

type PropertyParam = {
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  hasInternalToilet: string;
  hasParking: string;
  hasWell: string;
  purpose: string;
  regionId: string;
  divisionId: string;
  subdivisionId: string;
  neighborhoodId: string;
  houseTypeId: string;
};

export async function createProperty(property: PropertyParam, urls: string[]) {
  try {
    const parsed = propertyCreateSchema.safeParse(property);
    console.log(urls);
    console.log(property);
    console.log(parsed);
    if (!parsed.success) {
      return {
        success: false,
        errors: z.treeifyError(parsed.error),
        message: "Validation failed.",
      };
    }

    const data = parsed.data;
    console.log(parsed);

    await db.property.create({
      data: {
        title: data.title,
        description: data.description || "",
        price: Number(data.price),
        location: data.location,
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        hasInternalToilet: Boolean(data.hasInternalToilet),
        hasParking: Boolean(data.hasParking),
        hasWell: Boolean(data.hasWell),
        purpose: data.purpose as unknown as PropertyPurpose,
        regionId: data.regionId,
        divisionId: data.divisionId,
        houseTypeId: data.houseTypeId,
        subdivisionId: data.subdivisionId,
        neighborhoodId: data.neighborhoodId,
        images: urls ? { create: urls.map((url) => ({ url })) } : undefined,
      },
    });

    return {
      success: true,
      errors: {},
      message: "Property created successfully!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: z.treeifyError(error),
        status: 400,
      };
    }
    return {
      success: false,
      message: "Server Error",
      status: 500,
    };
  }
}
