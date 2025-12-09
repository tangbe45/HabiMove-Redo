import { db } from "@/lib/data/db";
import { NextResponse } from "next/server";

export async function GET() {
  // replace with prisma.houseType.findMany()
  const response = await db.houseType.findMany();
  return NextResponse.json(response);
}
