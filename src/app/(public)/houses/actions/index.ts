"use server";

import { HousePurpose, Prisma } from "@/generated/prisma";
import { db } from "@/lib/data/db";
import { HouseFilter } from "@/lib/types";
import { HouseDetails } from "@/lib/validation/zod-schemas";

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

    let where: Prisma.HouseWhereInput = {
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
      ...(purpose && { purpose: purpose as unknown as HousePurpose }),
      ...(region && { regionId: region }),
      ...(division && { divisionId: division }),
      ...(subdivision && { subdivisionId: subdivision }),
      ...(neighborhood && { neighborhoodId: neighborhood }),
    };

    const [count, houses] = await Promise.all([
      db.house.count({ where: where }),
      db.house.findMany({
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

export async function getHouseById(id: string): Promise<HouseDetails | null> {
  const result = await db.house.findUnique({
    where: { id },
    include: {
      region: true,
      division: true,
      subdivision: true,
      neighborhood: true,
      houseType: true,
      images: true,
    },
  });
  if (!result) {
    return null;
  }

  const house = {
    id: result.id,
    title: result.title,
    description: result.description || undefined,
    location: result.location,
    price: result.price,
    bedrooms: result.bedrooms,
    bathrooms: result.bathrooms,
    region: result.region.name,
    division: result.division.name,
    subdivision: result.subdivision.name,
    neighborhood: result.neighborhood.name,
    houseType: result.houseType.name,
    images: result.images ? result.images.map((image) => image.url) : [],
    hasInternalToilet: result.hasInternalToilet ?? undefined,
    hasWell: result.hasWell ?? undefined,
    hasParking: result.hasParking ?? undefined,
    hasFence: result.hasFence ?? undefined,
    hasBalcony: result.hasBalcony ?? undefined,
    createdAt: result.createdAt.toString(),
    updatedAt: result.updatedAt.toString(),
  };
  return house;
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

// export async function getFilteredHouses(filters: HouseFilter) {
//   try {
//     const {
//       houseType,
//       minPrice,
//       maxPrice,
//       bedrooms,
//       bathrooms,
//       hasInternalToilet,
//       hasWell,
//       hasParking,
//       purpose,
//       region,
//       division,
//       subdivision,
//       neighborhood,
//     } = filters;

//     const houses = await db.property.findMany({
//       where: {
//         ...(houseType && {
//           houseTypeId: { equals: houseType, mode: "insensitive" },
//         }),
//         ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
//         ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
//         ...(bedrooms && { bedrooms: { equals: parseInt(bedrooms) } }),
//         ...(bathrooms && { bathrooms: { equals: parseInt(bathrooms) } }),
//         ...(hasInternalToilet !== undefined && { hasInternalToilet }),
//         ...(hasWell !== undefined && { hasWell }),
//         ...(hasParking !== undefined && { hasParking }),
//         ...(purpose && { purpose: purpose as unknown as PropertyPurpose }),
//         ...(region && { regionId: region }),
//         ...(division && { divisionId: division }),
//         ...(subdivision && { subdivisionId: subdivision }),
//         ...(neighborhood && { neighborhoodId: neighborhood }),
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return houses;
//   } catch (error) {
//     console.error("Error filtering houses:", error);
//     throw new Error("Failed to fetch filtered houses");
//   }
// }
