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

type FilterButtonProps = {
  hasFilter?: boolean;
  filter?: HouseFilter;
  isOpen?: boolean;
  houseTypes?: HouseType[];
  location?: LocationData;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (key: string, value: string | boolean) => void;
  onApply?: () => void;
};

export const FilterButton = ({
  houseTypes,
  location,
  isOpen,
  filter,
  hasFilter = false,
  onOpen,
  onClose,
  onChange,
  onApply,
}: FilterButtonProps) => {
  return (
    <div className="fixed rounded-lg text-gray-200 bg-slate-800 top-14 right-8 z-20">
      {hasFilter && (
        <button
          onClick={onOpen && (() => onOpen())}
          className="flex gap-x-1 rounded-3xl px-2 py-1 hover:bg-sky-500 items-center hover:text-gray-50 cursor-pointer"
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
                      value={filter && filter.houseType}
                      onValueChange={
                        onChange && ((value) => onChange("houseType", value))
                      }
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
                        onChange={
                          onChange &&
                          ((e) => onChange("minPrice", e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label className="filter-label">Max Price</Label>
                      <Input
                        style={{ height: "2rem" }}
                        type="number"
                        placeholder="e.g. 300000"
                        onChange={
                          onChange &&
                          ((e) => onChange("maxPrice", e.target.value))
                        }
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
                        onChange={
                          onChange &&
                          ((e) => onChange("bedrooms", e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label className="filter-label">Bathrooms</Label>
                      <Input
                        style={{ height: "2rem" }}
                        type="number"
                        placeholder="e.g. 2"
                        onChange={
                          onChange &&
                          ((e) => onChange("bathrooms", e.target.value))
                        }
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
                        checked={filter && filter.hasInternalToilet}
                        onCheckedChange={
                          onChange &&
                          ((val) => onChange("hasInternalToilet", val))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="well">Has Well</Label>
                      <Switch
                        id="well"
                        checked={filter && filter.hasWell}
                        onCheckedChange={
                          onChange && ((val) => onChange("hasWell", val))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="parking">Has Parking</Label>
                      <Switch
                        id="parking"
                        checked={filter && filter.hasParking}
                        onCheckedChange={
                          onChange && ((val) => onChange("hasParking", val))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="forRent">For Rent</Label>
                      <Switch
                        id="forRent"
                        checked={filter && filter.forRent}
                        onCheckedChange={
                          onChange && ((val) => onChange("forRent", val))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="forSale">For Sale</Label>
                      <Switch
                        id="forSale"
                        checked={filter && filter.forSale}
                        onCheckedChange={
                          onChange && ((val) => onChange("forSale", val))
                        }
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
                          value={filter && filter.region}
                          onValueChange={
                            onChange && ((value) => onChange("region", value))
                          }
                        >
                          <SelectTrigger className="max-w-40" size="sm">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {location &&
                              location.regions &&
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
                          value={filter && filter.division}
                          onValueChange={
                            onChange && ((value) => onChange("division", value))
                          }
                          disabled={location && location.divisions.length === 0}
                        >
                          <SelectTrigger className="max-w-40" size="sm">
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            {location &&
                              location.divisions &&
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
                          disabled={location && !location.subdivisions}
                          value={filter && filter.subdivision}
                          onValueChange={
                            onChange &&
                            ((value) => onChange("subdivision", value))
                          }
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
                        <Label className="filter-label">Neighborhood</Label>
                        <Select
                          disabled={location && !location.neighborhoods}
                          value={filter && filter.neighborhood}
                          onValueChange={
                            onChange &&
                            ((value) => onChange("neighborhood", value))
                          }
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
                      onClick={onApply}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Apply Filter
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
