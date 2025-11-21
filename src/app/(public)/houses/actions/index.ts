"use server";

import { Prisma, PropertyPurpose } from "@/generated/prisma";
import { db } from "@/lib/db";
import { HouseFilter } from "@/lib/types";

export async function getHouses(
  filter: HouseFilter,
  currentPage = 1,
  pageSize = 9
) {
  try {
    const {
      houseType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      hasInternalToilet,
      hasWell,
      hasParking,
      purpose,
      region,
      division,
      subdivision,
      neighborhood,
    } = filter;

    let where: Prisma.PropertyWhereInput = {
      ...(houseType && {
        houseTypeId: { equals: houseType, mode: "insensitive" },
      }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(bedrooms && { bedrooms: { equals: parseInt(bedrooms) } }),
      ...(bathrooms && { bathrooms: { equals: parseInt(bathrooms) } }),
      ...(hasInternalToilet !== undefined && { hasInternalToilet }),
      ...(hasWell !== undefined && { hasWell }),
      ...(hasParking !== undefined && { hasParking }),
      ...(purpose && { purpose: purpose as unknown as PropertyPurpose }),
      ...(region && { regionId: region }),
      ...(division && { divisionId: division }),
      ...(subdivision && { subdivisionId: subdivision }),
      ...(neighborhood && { neighborhoodId: neighborhood }),
    };

    const [count, houses] = await Promise.all([
      db.property.count({ where: where }),
      db.property.findMany({
        where: where,
        include: { images: true },
        orderBy: {
          createdAt: "desc",
        },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    let totalPages = Math.ceil(count / pageSize);

    return { houses, totalPages };
  } catch (error) {
    console.error("Error filtering houses:", error);
    throw new Error("Failed to fetch filtered houses");
  }
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
  const result = await db.division.findMany({
    where: { regionId: id },
    select: { id: true, name: true },
  });
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
      houseType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      hasInternalToilet,
      hasWell,
      hasParking,
      purpose,
      region,
      division,
      subdivision,
      neighborhood,
    } = filters;

    const houses = await db.property.findMany({
      where: {
        ...(houseType && {
          houseTypeId: { equals: houseType, mode: "insensitive" },
        }),
        ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
        ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
        ...(bedrooms && { bedrooms: { equals: parseInt(bedrooms) } }),
        ...(bathrooms && { bathrooms: { equals: parseInt(bathrooms) } }),
        ...(hasInternalToilet !== undefined && { hasInternalToilet }),
        ...(hasWell !== undefined && { hasWell }),
        ...(hasParking !== undefined && { hasParking }),
        ...(purpose && { purpose: purpose as unknown as PropertyPurpose }),
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
