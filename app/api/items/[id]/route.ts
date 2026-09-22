import { NextRequest, NextResponse } from "next/server";
import { getItemById } from "@/lib/db/items";
import type { ApiErrorResponse, Item } from "@/types/item";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    return NextResponse.json<ApiErrorResponse>({ message: "Item not found." }, { status: 404 });
  }

  return NextResponse.json<Item>(item);
}
