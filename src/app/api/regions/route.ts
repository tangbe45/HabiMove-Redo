import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const regions = await db.region.findMany();
    return new Response(JSON.stringify(regions));
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, name: error.name, cause: error.cause };
    }
    return new Error("Failed to fetch regions");
  }
}
