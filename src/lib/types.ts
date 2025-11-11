export type SetSidebarOpenProps = {
  setSidebarOpen: (open: boolean) => void;
};
export type SidebarOpenProps = {
  sidebarOpen: boolean;
};

export type SidebarProps = SetSidebarOpenProps & SidebarOpenProps;

export type HouseFilter = {
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  hasInternalToilet?: boolean;
  hasWell?: boolean;
  hasParking?: boolean;
  forRent?: boolean;
  forSale?: boolean;
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

export type FilterBarProps = {
  onApply: (filter: Filters) => void;
};

export type LocationData = {
  regions: Region[] | "";
  divisions: Division[] | "";
  subdivisions: Subdivision[] | "";
  neighborhoods: Neighborhood[] | "";
};
