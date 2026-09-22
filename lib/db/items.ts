import { and, desc, eq, like, or } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "./client";
import { items } from "./schema";
import type { CreateItemPayload } from "@/lib/validation";
import type { Item, ItemFilters } from "@/types/item";

function toItem(row: typeof items.$inferSelect): Item {
  return {
    id: row.id,
    type: row.type as Item["type"],
    itemName: row.itemName,
    category: row.category as Item["category"],
    color: row.color,
    description: row.description,
    location: row.location,
    date: row.date,
    imageDataUrl: row.imageDataUrl,
    contactName: row.contactName,
    email: row.email,
    phone: row.phone,
    createdAt: row.createdAt,
  };
}

export async function createItem(input: CreateItemPayload): Promise<Item> {
  const row = {
    id: randomUUID(),
    type: input.type,
    itemName: input.itemName,
    category: input.category,
    color: input.color || null,
    description: input.description,
    location: input.location || null,
    date: input.date || null,
    imageDataUrl: input.type === "found" ? input.imageDataUrl || null : null,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone || null,
  };

  const [inserted] = await db.insert(items).values(row).returning();
  return toItem(inserted);
}

export async function listItems(filters: ItemFilters): Promise<Item[]> {
  const conditions = [];

  if (filters.type && filters.type !== "all") {
    conditions.push(eq(items.type, filters.type));
  }

  if (filters.category && filters.category !== "all") {
    conditions.push(eq(items.category, filters.category));
  }

  if (filters.q) {
    const term = `%${filters.q.toLowerCase()}%`;
    conditions.push(
      or(
        like(items.itemName, term),
        like(items.description, term),
        like(items.location, term),
      ),
    );
  }

  const rows = await db
    .select()
    .from(items)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(items.createdAt));

  return rows.map(toItem);
}

export async function getItemById(id: string): Promise<Item | null> {
  const [row] = await db.select().from(items).where(eq(items.id, id)).limit(1);
  return row ? toItem(row) : null;
}
