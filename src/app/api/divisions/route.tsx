import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const regionId = url.searchParams.get("regionId")!;
  const divisions = await db.division.findMany({
    where: { regionId },
  });
  return new Response(JSON.stringify(divisions));
}
