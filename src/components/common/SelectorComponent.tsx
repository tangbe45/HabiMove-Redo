import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Division,
  Filter,
  HouseType,
  Neighborhood,
  Price,
  Region,
  Subdivision,
} from "@/lib/types";

type SelectorProps = {
  label: string;
  name: keyof Filter;
  filter: Filter;
  items:
    | HouseType[]
    | Region[]
    | Division[]
    | Subdivision[]
    | Neighborhood[]
    | Price[];
  onSelectChange: (name: keyof Filter, value: string) => void;
};

const Selector = ({
  name,
  label,
  filter,
  items,
  onSelectChange,
}: SelectorProps) => {
  return (
    <Select
      value={filter ? String(filter[name]) : ""}
      onValueChange={(value) => {
        onSelectChange(name, value);
      }}
    >
      <SelectGroup>
        <SelectLabel className="text-sm text-gray-300 pl-0 font-medium">
          {label}
        </SelectLabel>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {items &&
            items.map((item) => (
              <SelectItem className="max-w-48" key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
        </SelectContent>
      </SelectGroup>
    </Select>
  );
};

export default Selector;
