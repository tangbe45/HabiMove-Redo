import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const divisionId = url.searchParams.get("divisionId")!;
  const subdivisions = await db.subdivision.findMany({
    where: { divisionId },
  });
  return new Response(JSON.stringify(subdivisions));
}
