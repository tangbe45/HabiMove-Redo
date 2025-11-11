"use server";

import { db } from "@/lib/db";
import { HouseFilter } from "@/lib/types";

export async function getHouses() {
  return await db.property.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      location: true,
      status: true,
    },
  });
}

export async function getHouseTypes() {
  const result = await db.houseType.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return result;
}

export async function getRegions() {
  const result = await db.region.findMany();
  return result;
}

export async function getDivisionsByRegionId(id: string) {
  const result = await db.division.findMany({ where: { regionId: id } });
  return result;
}

export async function getSubdivisionByDivisionId(id: string) {
  const result = await db.subdivision.findMany({ where: { divisionId: id } });
  return result;
}

export async function getNeighborhoodBySubdivisionId(id: string) {
  const result = await db.neighborhood.findMany({
    where: { subdivisionId: id },
  });
  return result;
}

export async function getFilteredHouses(filters: HouseFilter) {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      hasInternalToilet,
      hasWell,
      hasParking,
      forRent,
      forSale,
      region,
      division,
      subdivision,
      neighborhood,
    } = filters;

    const houses = await db.property.findMany({
      where: {
        ...(type && { houseTypeId: { equals: type, mode: "insensitive" } }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
        ...(bedrooms && { bedrooms: { equals: parseInt(bedrooms) } }),
        ...(bathrooms && { bathrooms: { equals: parseInt(bathrooms) } }),
        ...(hasInternalToilet !== undefined && { hasInternalToilet }),
        ...(hasWell !== undefined && { hasWell }),
        ...(hasParking !== undefined && { hasParking }),
        ...(forRent !== undefined && { forRent }),
        ...(forSale !== undefined && { forSale }),
        ...(region && { regionId: region }),
        ...(division && { divisionId: division }),
        ...(subdivision && { subdivisionId: subdivision }),
        ...(neighborhood && { neighborhoodId: neighborhood }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return houses;
  } catch (error) {
    console.error("Error filtering houses:", error);
    throw new Error("Failed to fetch filtered houses");
  }
}
