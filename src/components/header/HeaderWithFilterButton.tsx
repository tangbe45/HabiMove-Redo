import { SlidersHorizontal } from "lucide-react";

type HeaderWithFilterButtonProps = {
  title: string;
  hasFilter?: boolean;
};

export const HeaderWithFilterButton = ({
  title,
  hasFilter = false,
}: HeaderWithFilterButtonProps) => {
  return (
    <div className="header p-sync">
      <h3>{title}</h3>
      {hasFilter && (
        <button className="flex gap-x-2 items-center hover:text-gray-50 cursor-pointer">
          <SlidersHorizontal height={20} width={20} /> Filter
        </button>
      )}
    </div>
  );
};
