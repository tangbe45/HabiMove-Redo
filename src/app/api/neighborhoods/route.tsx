import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subdivisionId = url.searchParams.get("subdivisionId")!;
  const neighborhoods = await db.neighborhood.findMany({
    where: { subdivisionId },
  });
  return new Response(JSON.stringify(neighborhoods));
}
