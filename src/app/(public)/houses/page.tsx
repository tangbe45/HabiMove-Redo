"use client";

import { FilterButton } from "@/components/header/FilterButton";
import { HouseCard } from "./_components/HouseCard";
import {
  getDivisionsByRegionId,
  getHouses,
  getHouseTypes,
  getNeighborhoodBySubdivisionId,
  getRegions,
  getSubdivisionByDivisionId,
} from "./actions";
import { useEffect, useState } from "react";
import { CustomSpinner } from "@/components/custom_spinner/CustomSpinner";
import { HouseFilter, HouseType, LocationData } from "@/lib/types";
import { HousesPagination } from "./_components/HousesPagination";
import { set } from "zod";

type House = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  images: {
    url: string;
    id: string;
    createdAt: Date;
    propertyId: string;
  }[];
};

const initialFilter = {
  houseType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  hasInternalToilet: undefined,
  hasWell: undefined,
  hasParking: undefined,
  forRent: undefined,
  forSale: undefined,
  region: "",
  division: "",
  subdivision: "",
  neighborhood: "",
};

const HousesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [houseTypes, setHouseTypes] = useState<HouseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<HouseFilter>(initialFilter);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [location, setLocation] = useState<LocationData>({
    regions: "",
    divisions: "",
    subdivisions: "",
    neighborhoods: "",
  });
  useEffect(() => {
    async function fetchHouses() {
      setIsLoading(true);
      const data = await getHouses(filter, currentPage);
      setHouses(data.houses);
      setTotalPages(data.totalPages);
      setIsLoading(false);
    }
    fetchHouses();
  }, [currentPage]);

  useEffect(() => {
    async function loadFilters() {
      const [types, regions] = await Promise.all([
        getHouseTypes(),
        getRegions(),
      ]);

      setLocation({ ...location, regions: regions });
      setHouseTypes(types);
    }
    const time = setTimeout(() => {
      loadFilters();
    }, 1000);

    return () => clearTimeout(time);
  }, []);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleChange = async (key: string, value: string | boolean) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    if (key === "region" && typeof value === "string") {
      const result = await getDivisionsByRegionId(value);
      setLocation(() => ({ ...location, divisions: result }));
      console.log(result);
    }

    if (key === "division" && typeof value === "string") {
      const result = await getSubdivisionByDivisionId(value);
      setLocation(() => ({ ...location, subdivisions: result }));
      console.log(result);
    }

    if (key === "subdivision" && typeof value === "string") {
      const result = await getNeighborhoodBySubdivisionId(value);
      setLocation(() => ({ ...location, neighborhoods: result }));
      console.log(result);
    }
  };

  const handleApplyFilters = async () => {
    const result = await getHouses(filter, 1);
    setHouses(result.houses);
    setTotalPages(result.totalPages);
    setCurrentPage(1);
    setIsOpen(false);
    // Trigger your filtering logic or callback here
  };

  console.log("refresh");
  return (
    <div className="px-1 sm:px-8 pb-4 min-h-screen">
      <div className="">
        <FilterButton
          isOpen={isOpen}
          onOpen={handleModalOpen}
          onClose={handleModalClose}
          onChange={handleChange}
          onApply={handleApplyFilters}
          houseTypes={houseTypes}
          location={location}
          filter={filter}
          hasFilter={true}
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <CustomSpinner style="w-12 h-12 text-indigo-600" />
        </div>
      ) : (
        <>
          {houses.length > 0 ? (
            <div className="pt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 ">
              {houses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <h3 className="text-white">No houses in the database yet</h3>
            </div>
          )}
          <HousesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default HousesPage;
