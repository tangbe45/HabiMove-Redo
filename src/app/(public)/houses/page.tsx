"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button"; // shadcn Button (adjust import to your setup)
import FilterModal from "./FilterModal";
import HouseList from "./HouseList";

export default function HousesPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen w-full pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Houses</h1>
        <div>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Filters
          </Button>
        </div>
      </div>
      <FilterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <HouseList />
    </main>
  );
}
