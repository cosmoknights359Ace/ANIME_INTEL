import { NextRequest, NextResponse } from "next/server";
import { getWatchOrder } from "@/lib/watchOrder";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const animeId = Number(id);
  if (!Number.isInteger(animeId) || animeId <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const order = await getWatchOrder(animeId);
  if (!order) {
    return NextResponse.json({ error: "No watch order available" }, { status: 404 });
  }
  return NextResponse.json(order);
}
