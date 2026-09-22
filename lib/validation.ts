import { z } from "zod";
import { ITEM_CATEGORIES, ITEM_TYPES } from "@/types/item";

const trimmedString = (max: number) => z.string().trim().min(1).max(max);

const emailSchema = z.string().trim().min(1, "Email is required").email("Enter a valid email address");

const phoneSchema = z
  .string()
  .trim()
  .max(20)
  .regex(/^[0-9+\-\s()]*$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

const imageDataUrlSchema = z
  .string()
  .regex(/^data:image\/[a-zA-Z+]+;base64,/, "Image must be a valid image file")
  .optional();

/** Base fields shared by lost and found reports. */
const baseItemSchema = {
  itemName: trimmedString(100),
  category: z.enum(ITEM_CATEGORIES, { errorMap: () => ({ message: "Select a category" }) }),
  description: trimmedString(1000),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  date: z.string().trim().max(20).optional().or(z.literal("")),
  contactName: trimmedString(100),
  email: emailSchema,
  phone: phoneSchema,
};

/** Lost items: color is required (matches the original lost.html form). */
export const lostItemSchema = z.object({
  type: z.literal("lost"),
  ...baseItemSchema,
  color: trimmedString(50),
});

/** Found items: color optional, image optional (matches found.html). */
export const foundItemSchema = z.object({
  type: z.literal("found"),
  ...baseItemSchema,
  color: z.string().trim().max(50).optional().or(z.literal("")),
  imageDataUrl: imageDataUrlSchema,
});

export const createItemSchema = z.discriminatedUnion("type", [lostItemSchema, foundItemSchema]);

export type CreateItemPayload = z.infer<typeof createItemSchema>;

export const itemTypeFilterSchema = z.enum([...ITEM_TYPES, "all"]).default("all");
export const itemCategoryFilterSchema = z.enum([...ITEM_CATEGORIES, "all"]).default("all");
