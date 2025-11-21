import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  price: z.string().min(4, "Price is required"),
  location: z.string().min(1),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  hasInternalToilet: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  hasWell: z.boolean().optional(),
  purpose: z.string().optional(),
  regionId: z.string().min(1, "Region is required"),
  divisionId: z.string().min(1, "Division is required"),
  subdivisionId: z.string().min(1, "Subdivision is required"),
  neighborhoodId: z.string().min(1, "Neighborhood is required"),
  houseTypeId: z.string().min(1, "House type is required"),
});

export type PropertySchema = z.infer<typeof propertySchema>;
