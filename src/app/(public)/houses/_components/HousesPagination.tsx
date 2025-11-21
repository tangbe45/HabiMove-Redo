import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "../lib/pagination/getPageNumbers";

export function HousesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  console.log(pageNumbers);
  return (
    <Pagination className="bg-slate-800 text-white w-full flex justify-center mt-4 rounded-md">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() =>
              currentPage !== 1 &&
              currentPage !== totalPages &&
              onPageChange(currentPage - 1)
            }
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {pageNumbers.map((number, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              className="data-[state=active]:bg-white data-[state=active]:text-blue-500 cursor-pointer"
              isActive={number !== "..." && currentPage === Number(number)}
              onClick={
                number !== "..."
                  ? () => onPageChange(Number(number))
                  : undefined
              }
            >
              {number !== "..." ? Number(number) : "..."}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
