import { z } from "zod";

/* ---------- CREATE ---------- */
export const houseCreateSchema = z.object({
  title: z
    .string()
    .min(
      3,
      "Invalid input: Title is required and must be more than 3 characters"
    ),
  description: z.string().optional(),
  price: z.coerce
    .number("Invalid input: Requires a positive number")
    .positive(),
  location: z.string().min(1, "Invalid input: Specific location is required"),
  bedrooms: z.coerce.number().nonnegative(),
  bathrooms: z.coerce.number().nonnegative(),
  hasInternalToilet: z.coerce.boolean().optional(),
  hasParking: z.coerce.boolean().optional(),
  hasWell: z.coerce.boolean().optional(),
  hasFence: z.coerce.boolean().optional(),
  hasBalcony: z.coerce.boolean().optional(),
  purpose: z.enum(["FOR_RENT", "FOR_SALE"]),
  houseTypeId: z.string().cuid("Invalid input: Invalid type"), // z.cuid() isn't directly usable in client; validate on server
  regionId: z.string().cuid("Invalid input: Invalid type"),
  divisionId: z.string().cuid("Invalid input: Invalid type"),
  subdivisionId: z.string().cuid("Invalid input: Invalid type"),
  neighborhoodId: z.string().cuid("Invalid input: Invalid type"),
});

export type HouseCreateInput = z.infer<typeof houseCreateSchema>;

/* ---------- UPDATE ---------- */
export const houseUpdateSchema = houseCreateSchema.partial().extend({
  id: z.cuid(),
});
export type PropertyUpdateInput = z.infer<typeof houseUpdateSchema>;

/* ---------- FILTER ---------- */
export const houseFilterSchema = z.object({
  purpose: z.enum(["FOR_RENT", "FOR_SALE"]).optional(),
  status: z.enum(["AVAILABLE", "PENDING", "SOLD", "RENTED"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  regionId: z.cuid().optional(),
  divisionId: z.cuid().optional(),
  subdivisionId: z.cuid().optional(),
  neighborhoodId: z.cuid().optional(),
  houseTypeId: z.cuid().optional(),
});
export type HouseFilterInput = z.infer<typeof houseFilterSchema>;

export const initializeHouseFilter = {
  houseType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  hasInternalToilet: false,
  hasWell: false,
  hasParking: false,
  hasFence: false,
  hasBalcony: false,
  forRent: undefined,
  forSale: undefined,
  region: "",
  division: "",
  subdivision: "",
  neighborhood: "",
};

export type LoadSchema = { id: string; name: string };

export type HouseDetails = {
  id: string;
  title: string;
  description?: string;
  location: string;

  price: number;
  bedrooms: number;
  bathrooms: number;

  // Location
  region: string;
  division: string;
  subdivision: string;
  neighborhood: string;

  // Type
  houseType: string;

  // Images
  images: string[];

  // Amenities
  hasInternalToilet?: boolean;
  hasWell?: boolean;
  hasParking?: boolean;
  hasFence?: boolean;
  hasBalcony?: boolean;

  createdAt: string;
  updatedAt: string;
};
