"use client";

import { SlidersHorizontal } from "lucide-react";
import { HouseFilter, HouseType, LocationData } from "@/lib/types";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { initializeHouseFilter } from "@/lib/validation/zod-schemas";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  getDivisionsByRegionId,
  getNeighborhoodBySubdivisionId,
  getSubdivisionByDivisionId,
} from "@/app/(public)/houses/actions";
import { Belgrano } from "next/font/google";

export const FilterButton = ({ houseTypes, regions }: any) => {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<HouseFilter>(initializeHouseFilter);
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState<HouseType[]>(houseTypes);
  const [location, setLocation] = useState<LocationData>({
    regions,
    divisions: "",
    subdivisions: "",
    neighborhoods: "",
  });

  function applyFilter(name: string, value: string) {
    const newParams = new URLSearchParams(params.toString());

    if (value) newParams.set(name, value);
    else newParams.delete(name);

    newParams.set("page", "1");

    router.push(`/houses?${newParams.toString()}`);
  }

  async function handleSearch() {
    const result = await fetch(`/api/houses?${params}`);
    const data = await result.json();
    console.log(data);
  }

  const handleModal = () => {
    setIsOpen((prev) => !prev);
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

  return (
    <div className="fixed rounded-lg text-gray-200 bg-indigo-600 top-14 right-8 z-50">
      <button
        onClick={handleModal}
        className="flex gap-x-1 rounded-lg px-2 py-1 hover:bg-sky-500 items-center hover:text-gray-50 cursor-pointer"
      >
        <SlidersHorizontal height={20} width={20} /> Filter
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="overflow-y-auto">
            <Dialog open={isOpen} onOpenChange={handleModal}>
              <DialogContent className="sm:max-w-[600px] card rounded-xl shadow-lg mt-0 pt-6 overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle>Filter Houses</DialogTitle>
                </DialogHeader>
                {/* House Type */}
                <div>
                  <Label className="filter-label mb-1">House Type</Label>
                  <Select
                    value={filter.houseType}
                    onValueChange={(value) => (
                      setFilter((prev) => ({ ...prev, houseType: value })),
                      applyFilter("houseType", value)
                    )}
                  >
                    <SelectTrigger size="sm" className="max-w-48">
                      <SelectValue placeholder="Select house type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types &&
                        types.map((item) => (
                          <SelectItem
                            className="truncate"
                            key={item.id}
                            value={item.name}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Price Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="filter-label">Min Price</Label>
                    <Input
                      style={{ height: "2rem" }}
                      type="number"
                      placeholder="e.g. 50000"
                      value={filter.minPrice}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          minPrice: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        applyFilter("minPrice", filter.minPrice || "")
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="filter-label">Max Price</Label>
                    <Input
                      style={{ height: "2rem" }}
                      type="number"
                      placeholder="e.g. 300000"
                      value={filter.maxPrice}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        applyFilter("maxPrice", filter.maxPrice || "")
                      }
                    />
                  </div>
                </div>
                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="filter-label">Bedrooms</Label>
                    <Input
                      style={{ height: "2rem" }}
                      type="number"
                      placeholder="e.g. 3"
                      value={filter.bedrooms}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          bedrooms: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        applyFilter("bedrooms", filter.bedrooms || "")
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="filter-label">Bathrooms</Label>
                    <Input
                      style={{ height: "2rem" }}
                      type="number"
                      placeholder="e.g. 2"
                      value={filter.bathrooms}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          bathrooms: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        applyFilter("bathrooms", filter.bathrooms || "")
                      }
                    />
                  </div>
                </div>
                {/* Features */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="internalToilet">Has Internal Toilet</Label>
                    <Switch
                      id="internalToilet"
                      checked={filter.hasInternalToilet}
                      onCheckedChange={(val) => (
                        setFilter((prev) => ({
                          ...prev,
                          hasInternalToilet: !filter.hasInternalToilet,
                        })),
                        applyFilter("hasInternalToilet", String(val))
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="well">Has Well</Label>
                    <Switch
                      id="well"
                      checked={filter.hasWell}
                      onCheckedChange={(val) => (
                        setFilter((prev) => ({
                          ...prev,
                          hasWell: !filter.hasWell,
                        })),
                        applyFilter("hasWell", String(val))
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="parking">Has Parking</Label>
                    <Switch
                      id="parking"
                      checked={filter.hasParking}
                      onCheckedChange={(val) => (
                        setFilter((prev) => ({
                          ...prev,
                          hasParking: !filter.hasParking,
                        })),
                        applyFilter("hasParking", String(val))
                      )}
                    />
                  </div>
                </div>
                <Separator className="my-2" />
                {/* Location Group */}
                <div className="space-y-3">
                  <p className="font-medium text-slate-800">Location</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="filter-label mb-1">Region</Label>
                      <Select
                        value={filter.region}
                        onValueChange={(value) => (
                          handleChange("region", value),
                          applyFilter("region", value)
                        )}
                      >
                        <SelectTrigger className="max-w-40" size="sm">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {location.regions &&
                            location.regions.map((item) => (
                              <SelectItem
                                className="truncate"
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="filter-label mb-1">Division</Label>
                      <Select
                        value={filter.division}
                        onValueChange={(value) => (
                          handleChange("division", value),
                          applyFilter("division", value)
                        )}
                        disabled={!location.divisions}
                      >
                        <SelectTrigger className="max-w-40" size="sm">
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          {location.divisions &&
                            location.divisions.map((item) => (
                              <SelectItem
                                className="truncate"
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="filter-label mb-1">Subdivision</Label>
                      <Select
                        disabled={!location.subdivisions}
                        value={filter.subdivision}
                        onValueChange={(value) => (
                          handleChange("subdivision", value),
                          applyFilter("subdivision", value)
                        )}
                      >
                        <SelectTrigger className="max-w-40" size="sm">
                          <SelectValue placeholder="Select subdivision" />
                        </SelectTrigger>
                        <SelectContent>
                          {location &&
                            location.subdivisions &&
                            location.subdivisions.map((item) => (
                              <SelectItem
                                className="truncate"
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="filter-label mb-1">Neighborhood</Label>
                      <Select
                        disabled={!location.neighborhoods}
                        value={filter.neighborhood}
                        onValueChange={(value) => (
                          setFilter((prev) => ({
                            ...prev,
                            neighborhood: value,
                          })),
                          applyFilter("neighborhood", value)
                        )}
                      >
                        <SelectTrigger className="max-w-40" size="sm">
                          <SelectValue placeholder="Select neighborhood" />
                        </SelectTrigger>
                        <SelectContent>
                          {location &&
                            location.neighborhoods &&
                            location.neighborhoods.map((item) => (
                              <SelectItem
                                className="truncate"
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {/* Apply Button */}
                <div className="flex justify-end pt-3 gap-2">
                  <Button
                    onClick={handleSearch}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Apply Filter
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => {}}
                    className="border"
                  >
                    Reset Form
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};
