import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["lost", "found"] }).notNull(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(),
  color: text("color"),
  description: text("description").notNull(),
  location: text("location"),
  date: text("date"),
  imageDataUrl: text("image_data_url"),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type ItemRow = typeof items.$inferSelect;
export type NewItemRow = typeof items.$inferInsert;
