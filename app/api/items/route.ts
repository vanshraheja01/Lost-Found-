import { NextRequest, NextResponse } from "next/server";
import { createItemSchema, itemCategoryFilterSchema, itemTypeFilterSchema } from "@/lib/validation";
import { createItem, listItems } from "@/lib/db/items";
import { parseImageDataUrl } from "@/lib/image";
import type { ApiErrorResponse, Item, ItemListResponse } from "@/types/item";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const type = itemTypeFilterSchema.safeParse(searchParams.get("type") ?? undefined);
  const category = itemCategoryFilterSchema.safeParse(searchParams.get("category") ?? undefined);
  const q = searchParams.get("q")?.trim() || undefined;

  if (!type.success || !category.success) {
    return NextResponse.json<ApiErrorResponse>({ message: "Invalid filter parameters." }, { status: 400 });
  }

  const items = await listItems({ type: type.data, category: category.data, q });

  return NextResponse.json<ItemListResponse>({ items, total: items.length });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiErrorResponse>({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = createItemSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json<ApiErrorResponse>(
      { message: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.type === "found" && parsed.data.imageDataUrl) {
    try {
      parseImageDataUrl(parsed.data.imageDataUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid image.";
      return NextResponse.json<ApiErrorResponse>({ message, fieldErrors: { imageDataUrl: message } }, { status: 400 });
    }
  }

  try {
    const item: Item = await createItem(parsed.data);
    return NextResponse.json<Item>(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create item:", error);
    return NextResponse.json<ApiErrorResponse>({ message: "Could not save the item. Please try again." }, { status: 500 });
  }
}
