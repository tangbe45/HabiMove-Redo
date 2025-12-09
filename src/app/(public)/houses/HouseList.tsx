"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HouseCard } from "./_components/HouseCard";
import { Input } from "@/components/ui/input"; // optional: inline search debounce
import { debounce } from "lodash"; // optional, or implement your own debounce
import { HousesPagination } from "./_components/HousesPagination";
import { CustomSpinner } from "@/components/custom_spinner/CustomSpinner";

export default function HouseList() {
  const params = useSearchParams();
  const router = useRouter();
  const [houses, setHouses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [searchLocal, setSearchLocal] = useState(params.get("search") || "");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/houses?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setHouses(json.houses || []);
        setTotal(json.total || 0);
        setPages(json.pages || 1);
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [params]);

  // Debounced live search that writes to URL (keeps search experience snappy)
  useEffect(() => {
    const debounced = debounce((value: string) => {
      const p = new URLSearchParams(params.toString());
      if (value) p.set("search", value);
      else p.delete("search");
      //p.set("page", "1");
      router.push(`/houses?${p.toString()}`);
    }, 500);
    debounced(searchLocal);
    return () => debounced.cancel();
  }, [searchLocal]);

  function goToPage(page: number) {
    const p = new URLSearchParams(params.toString());
    p.set("page", String(page));
    setCurrentPage(page);
    router.push(`/houses?${p.toString()}`);
  }

  return (
    <section>
      <div className="mb-4 text-center">
        <Input
          className="max-w-2xl"
          value={searchLocal}
          onChange={(e: any) => setSearchLocal(e.target.value)}
          placeholder="Quick search..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <CustomSpinner style="w-12 h-12 text-indigo-600" />
        </div>
      ) : (
        <>
          {houses.length > 0 ? (
            <div className="flex-1">
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 ">
                {houses.map((house) => (
                  <HouseCard key={house.id} house={house} />
                ))}
              </div>
              <HousesPagination
                currentPage={currentPage}
                totalPages={pages}
                onPageChange={goToPage}
              />
              <div className="mt-4 text-sm text-gray-600">
                Total: {total} results
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[calc(100vh-220px)]">
              <h3 className="text-white">No houses in the database yet</h3>
            </div>
          )}
        </>
      )}
    </section>
  );
}
