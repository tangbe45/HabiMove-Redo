import { HeaderWithFilterButton } from "@/components/header/HeaderWithFilterButton";
import { HouseCard } from "./_components/HouseCard";
import { db } from "@/lib/db";

const HousesPage = async () => {
  const houses = await db.property.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      location: true,
      status: true,
    },
  });

  return (
    <div className="page">
      <div className="px-1">
        <HeaderWithFilterButton title="Houses" hasFilter={true} />
      </div>
      <div className="p-sync pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 ">
        {houses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>
    </div>
  );
};

export default HousesPage;
