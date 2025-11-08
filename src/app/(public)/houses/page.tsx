import { HeaderWithFilterButton } from "@/components/header/HeaderWithFilterButton";

const HousesPage = () => {
  return (
    <div className="page">
      <div className="px-1">
        <HeaderWithFilterButton title="Houses" hasFilter={true} />
      </div>
      <div className="p-sync">Houses Page</div>
    </div>
  );
};

export default HousesPage;
