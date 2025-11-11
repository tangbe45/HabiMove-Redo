"use client";

import { HeaderWithFilterButton } from "@/components/header/HeaderWithFilterButton";
import { HouseCard } from "./_components/HouseCard";
import {
  getDivisionsByRegionId,
  getFilteredHouses,
  getHouses,
  getHouseTypes,
  getNeighborhoodBySubdivisionId,
  getRegions,
  getSubdivisionByDivisionId,
} from "./actions";
import { useEffect, useState } from "react";
import { CustomSpinner } from "@/components/custom_spinner/CustomSpinner";
import { HouseFilter, HouseType, LocationData } from "@/lib/types";

type House = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
};

const initialFilter = {
  type: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  hasInternalToilet: false,
  hasWell: false,
  hasParking: false,
  forRent: false,
  forSale: false,
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
  const [filters, setFilters] = useState<HouseFilter>(initialFilter);
  const [location, setLocation] = useState<LocationData>({
    regions: "",
    divisions: "",
    subdivisions: "",
    neighborhoods: "",
  });
  useEffect(() => {
    async function fetchHouses() {
      setIsLoading(true);
      const data = await getFilteredHouses(filters);
      setHouses(data);
      setIsLoading(false);
    }
    fetchHouses();
  }, []);

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
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    setIsOpen(false);
    // Trigger your filtering logic or callback here
  };

  return (
    <div className="page">
      <div className="px-1">
        <HeaderWithFilterButton
          isOpen={isOpen}
          onOpen={handleModalOpen}
          onClose={handleModalClose}
          onChange={handleChange}
          onApply={handleApplyFilters}
          houseTypes={houseTypes}
          location={location}
          title="Houses"
          filters={filters}
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
            <div className="p-sync pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 ">
              {houses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <h3 className="text-white">No houses in the database yet</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HousesPage;
