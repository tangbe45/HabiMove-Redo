import { Prisma } from "@/generated/prisma";

export type SetSidebarOpenProps = {
  setSidebarOpen: (open: boolean) => void;
};
export type SidebarOpenProps = {
  sidebarOpen: boolean;
};

export type SidebarProps = SetSidebarOpenProps & SidebarOpenProps;

export const propertyDetailSelect = Prisma.validator<Prisma.PropertySelect>()({
  id: true,
  title: true,
  houseType: true,
  bedrooms: true,
  bathrooms: true,
  purpose: true,
  price: true,
  region: true,
  division: true,
  subdivision: true,
  neighborhood: true,
});

export type HouseFilter = {
  houseType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  hasInternalToilet?: boolean;
  hasWell?: boolean;
  forRent?: boolean;
  forSale?: boolean;
  hasParking?: boolean;
  purpose?: string;
  region?: string;
  division?: string;
  subdivision?: string;
  neighborhood?: string;
};

export type House = {
  id: string;
  title: string;
  type: string;
  rooms: number;
  hasInternalToilet: boolean;
  price: number;
  region: string;
  division: string;
  subdivision: string;
  neighborhood: string;
};

export type HouseGridProps = {
  houses: House[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
export type HouseType = {
  name: string;
  id: string;
};
export type Region = { id: string | ""; name: string };
export type Division = { id: string | ""; name: string };
export type Subdivision = { id: string | ""; name: string };
export type Neighborhood = { id: string | ""; name: string };
export type Price = { id: string | ""; name: string };

export type LocationData = {
  regions: Region[] | "";
  divisions: Division[] | "";
  subdivisions: Subdivision[] | "";
  neighborhoods: Neighborhood[] | "";
};

export type ActionResult = {
  success: boolean;
  errors: Record<string, string[]> | null;
  message: string | null;
};
