import { SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { HouseFilter, HouseType, LocationData } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

type HeaderWithFilterButtonProps = {
  title: string;
  hasFilter?: boolean;
  filters: HouseFilter;
  isOpen: boolean;
  houseTypes: HouseType[];
  location: LocationData;
  onOpen: () => void;
  onClose: () => void;
  onChange: (key: string, value: string | boolean) => void;
  onApply: () => void;
};

export const HeaderWithFilterButton = ({
  title,
  houseTypes,
  location,
  isOpen,
  filters,
  hasFilter = false,
  onOpen,
  onClose,
  onChange,
  onApply,
}: HeaderWithFilterButtonProps) => {
  return (
    <div className="header p-sync z-50">
      <h1 className="text-gray-300">{title}</h1>
      {hasFilter && (
        <button
          onClick={() => onOpen()}
          className="btn btn-primary flex gap-x-2 rounded-3xl hover:bg-sky-500 px-4 py-1 items-center hover:text-gray-50 cursor-pointer"
        >
          <SlidersHorizontal height={20} width={20} /> Filter
        </button>
      )}
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="overflow-y-auto">
            <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="sm:max-w-[600px] card rounded-xl shadow-lg mt-0 pt-0 overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle>Filter Houses</DialogTitle>
                </DialogHeader>

                <div className="mt-2 space-y-5">
                  {/* House Type */}
                  <div>
                    <Label className="filter-label">House Type</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => onChange("type", value)}
                    >
                      <SelectTrigger size="sm" className="mt-1 max-w-48">
                        <SelectValue placeholder="Select house type" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypes &&
                          houseTypes.map((item) => (
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
                    <div>
                      <Label className="filter-label">Min Price</Label>
                      <Input
                        style={{ height: "2rem" }}
                        type="number"
                        placeholder="e.g. 50000"
                        onChange={(e) => onChange("minPrice", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="filter-label">Max Price</Label>
                      <Input
                        style={{ height: "2rem" }}
                        type="number"
                        placeholder="e.g. 300000"
                        onChange={(e) => onChange("maxPrice", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Bedrooms & Bathrooms */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="filter-label">Bedrooms</Label>
                      <Input
                        style={{ height: "2rem" }}
                        type="number"
                        placeholder="e.g. 3"
                        onChange={(e) => onChange("bedrooms", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="filter-label">Bathrooms</Label>
                      <Input
                        style={{ height: "2rem" }}
                        type="number"
                        placeholder="e.g. 2"
                        onChange={(e) => onChange("bathrooms", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="internalToilet">
                        Has Internal Toilet
                      </Label>
                      <Switch
                        id="internalToilet"
                        checked={filters.hasInternalToilet}
                        onCheckedChange={(val) =>
                          onChange("hasInternalToilet", val)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="well">Has Well</Label>
                      <Switch
                        id="well"
                        checked={filters.hasWell}
                        onCheckedChange={(val) => onChange("hasWell", val)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="parking">Has Parking</Label>
                      <Switch
                        id="parking"
                        checked={filters.hasParking}
                        onCheckedChange={(val) => onChange("hasParking", val)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="forRent">For Rent</Label>
                      <Switch
                        id="forRent"
                        checked={filters.forRent}
                        onCheckedChange={(val) => onChange("forRent", val)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="forSale">For Sale</Label>
                      <Switch
                        id="forSale"
                        checked={filters.forSale}
                        onCheckedChange={(val) => onChange("forSale", val)}
                      />
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Location Group */}
                  <div className="space-y-3">
                    <p className="font-medium text-slate-800">Location</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="filter-label">Region</Label>
                        <Select
                          value={filters.region}
                          onValueChange={(value) => onChange("region", value)}
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
                        <Label className="filter-label">Division</Label>
                        <Select
                          value={filters.division}
                          onValueChange={(value) => onChange("division", value)}
                          disabled={location.divisions.length === 0}
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
                        <Label className="filter-label">Subdivision</Label>
                        <Select
                          disabled={!location.subdivisions}
                          value={filters.subdivision}
                          onValueChange={(value) =>
                            onChange("subdivision", value)
                          }
                        >
                          <SelectTrigger className="max-w-40" size="sm">
                            <SelectValue placeholder="Select subdivision" />
                          </SelectTrigger>
                          <SelectContent>
                            {location.subdivisions &&
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
                        <Label className="filter-label">Neighborhood</Label>
                        <Select
                          disabled={!location.neighborhoods}
                          value={filters.neighborhood}
                          onValueChange={(value) =>
                            onChange("neighborhood", value)
                          }
                        >
                          <SelectTrigger className="max-w-40" size="sm">
                            <SelectValue placeholder="Select neighborhood" />
                          </SelectTrigger>
                          <SelectContent>
                            {location.neighborhoods &&
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
                      onClick={onApply}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant={"ghost"}
                      onClick={onApply}
                      className="border"
                    >
                      Reset Form
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};
